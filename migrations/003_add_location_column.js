export const version = 3;
export const name = 'add_location_column';
export const description = 'Add location column to work_hours table and migrate data from notes';

export const up = `
-- Add location column to work_hours
ALTER TABLE work_hours ADD COLUMN location TEXT;

-- Migrate existing location data from notes field
-- Notes format: "Started via mobile app - Home"
UPDATE work_hours
SET location = TRIM(SUBSTR(notes, INSTR(notes, ' - ') + 3))
WHERE notes LIKE '%Started via mobile app - %'
  AND location IS NULL;
`;

export const down = `
-- SQLite doesn't support DROP COLUMN directly, so we recreate the table
CREATE TABLE work_hours_backup AS SELECT
  id, project_id, user_id, start_work_time, end_work_time,
  break_time, notes, created_at, updated_at
FROM work_hours;

DROP TABLE work_hours;

CREATE TABLE work_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_work_time INTEGER NOT NULL,
  end_work_time INTEGER,
  break_time INTEGER DEFAULT 0,
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO work_hours SELECT * FROM work_hours_backup;
DROP TABLE work_hours_backup;

CREATE INDEX IF NOT EXISTS idx_work_hours_user_id ON work_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_project_id ON work_hours(project_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_start_time ON work_hours(start_work_time);
`;
