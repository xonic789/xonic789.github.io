#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "shellwords"
require "time"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
DRAFT_DIR = File.join(REPO_ROOT, "_drafts")
POST_DIR = File.join(REPO_ROOT, "_posts")
KST_OFFSET = "+09:00"

def parse_frontmatter(path)
  content = File.read(path)
  match = content.match(/\A---\n(.*?)\n---\n/m)
  return nil unless match

  frontmatter = YAML.safe_load(match[1], permitted_classes: [Time], aliases: false) || {}
  body = content[match[0].length..] || ""
  [frontmatter, body]
end

def dump_frontmatter(frontmatter)
  lines = ["---"]
  frontmatter.each do |key, value|
    yaml = YAML.dump({ key => value }).lines.drop(1)
    lines.concat(yaml.map(&:chomp))
  end
  lines << "---"
  lines.join("\n")
end

def normalize_time(value)
  Time.parse(value.to_s).getlocal(KST_OFFSET)
end

def slug_from_filename(path)
  basename = File.basename(path, ".md")
  basename.sub(/\A\d{4}-\d{2}-\d{2}-/, "")
end

def published_target_path(path, scheduled_at)
  date_prefix = scheduled_at.strftime("%Y-%m-%d")
  slug = slug_from_filename(path)
  File.join(POST_DIR, "#{date_prefix}-#{slug}.md")
end

def rewrite_as_post(source_path, target_path, frontmatter, body)
  frontmatter["published"] = true
  rendered = "#{dump_frontmatter(frontmatter)}\n#{body}"
  File.write(target_path, rendered)
  File.delete(source_path)
end

def due_drafts(now)
  Dir.glob(File.join(DRAFT_DIR, "*.md")).sort.each_with_object([]) do |path, drafts|
    parsed = parse_frontmatter(path)
    next unless parsed

    frontmatter, body = parsed
    next unless frontmatter["date"]

    scheduled_at = normalize_time(frontmatter["date"])
    next unless scheduled_at <= now

    drafts << [path, frontmatter, body, scheduled_at]
  end
end

def run!(cmd)
  success = system(cmd)
  raise "command failed: #{cmd}" unless success
end

now = Time.now.getlocal(KST_OFFSET)
drafts = due_drafts(now)

if drafts.empty?
  puts "[publish_scheduled_drafts] no due drafts at #{now.iso8601}"
  exit 0
end

published_paths = []
staged_paths = []

drafts.each do |source_path, frontmatter, body, scheduled_at|
  target_path = published_target_path(source_path, scheduled_at)
  if File.exist?(target_path)
    raise "target already exists: #{target_path}"
  end

  rewrite_as_post(source_path, target_path, frontmatter, body)
  published_paths << target_path
  staged_paths << source_path
  staged_paths << target_path
  puts "[publish_scheduled_drafts] published #{File.basename(source_path)} -> #{File.basename(target_path)}"
end

Dir.chdir(REPO_ROOT) do
  run!("git add -- #{staged_paths.map { |path| Shellwords.escape(path.sub("#{REPO_ROOT}/", "")) }.join(' ')}")
  run!("git commit -m \"Publish scheduled drafts\"")
  run!("git push")
end

puts "[publish_scheduled_drafts] completed #{published_paths.size} publication(s)"
