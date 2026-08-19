CREATE TABLE IF NOT EXISTS pageviews (
  path       TEXT PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
