export const version = 2;
export const name = 'create_migration_tracking';
export const description = 'Create migrations table for tracking applied migrations';

// Create the migrations tracking table
export const up = `
-- Migrations table: tracks which migrations have been applied
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique record ID
  version INTEGER NOT NULL UNIQUE,         -- Migration version number
  name TEXT NOT NULL,                      -- Migration name
  applied_at INTEGER NOT NULL,             -- When it was run
  status TEXT NOT NULL DEFAULT 'applied'   -- Did it succeed?
);

-- Add a record for migration #1 (since it ran before this table existed)
INSERT OR IGNORE INTO migrations (version, name, applied_at, status) 
VALUES (1, 'create_initial_tables', strftime('%s', 'now') * 1000, 'applied');
`;

// How to undo this migration
export const down = `
DROP TABLE IF EXISTS migrations;
`;
