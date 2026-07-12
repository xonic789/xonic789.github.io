# xonic789.github.io

Personal engineering blog built with Jekyll and the Chirpy theme.

## Local development

The deployment workflow uses Node.js 20, the Ruby version in `.ruby-version`, and the Bundler version recorded in `Gemfile.lock`.

```sh
npm ci
npm run build
gem install bundler:2.5.6
bundle install
bundle exec jekyll serve
```

Open <http://localhost:4000> while the server is running.

## Verification

Run the same build and content checks used by GitHub Pages:

```sh
npm test
npm run build
JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer _site --disable-external=true \
  --ignore-urls '/^http:\/\/127\.0\.0\.1/,/^http:\/\/0\.0\.0\.0/,/^http:\/\/localhost/'
```

Post front matter must follow [`FRONTMATTER_POLICY.md`](FRONTMATTER_POLICY.md).
