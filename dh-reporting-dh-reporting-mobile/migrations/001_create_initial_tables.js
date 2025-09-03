export const version = 1;
export const name = 'create_initial_tables';
export const description = 'Create users, projects, work_hours, and session tables';

// SQL to create our tables
export const up = `
PRAGMA foreign_keys = ON;

-- Users table: stores user information
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique user ID
  first_name TEXT NOT NULL,                -- User's first name
  last_name TEXT NOT NULL,                 -- User's last name  
  email TEXT NOT NULL UNIQUE,              -- Email (must be unique)
  phone_number TEXT,                       -- Optional phone
  hms_user TEXT,                          -- Optional HMS system ID
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),  -- When created
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)   -- When last updated
);

-- Projects table: stores project information
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique project ID
  name TEXT NOT NULL,                      -- Project name
  description TEXT,                        -- Optional description
  location INTEGER NOT NULL CHECK (location IN (1,2,3)),  -- 1=HOME, 2=WORK, 3=OFFICE
  is_active INTEGER DEFAULT 1,             -- Is project still active?
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  UNIQUE(name, location)                   -- Same project name can't exist in same location
);

-- Work hours table: tracks time spent on projects
CREATE TABLE IF NOT EXISTS work_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique entry ID
  project_id INTEGER NOT NULL,             -- Which project
  user_id INTEGER NOT NULL,                -- Which user
  start_work_time INTEGER NOT NULL,        -- When they started working
  end_work_time INTEGER,                   -- When they stopped (NULL if still working)
  break_time INTEGER DEFAULT 0,            -- Break time in minutes
  notes TEXT,                              -- Optional notes
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,  -- Delete if project deleted
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE         -- Delete if user deleted
);

-- Session table: keeps track of who's logged in
CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY CHECK (id = 1),   -- Only allow one session (id must be 1)
  user_id INTEGER NOT NULL,                -- Which user is logged in
  signed_in_at INTEGER NOT NULL,           -- When they logged in
  last_activity INTEGER NOT NULL,          -- Last time they used the app
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_work_hours_user_id ON work_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_project_id ON work_hours(project_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_start_time ON work_hours(start_work_time);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

// SQL to undo everything above (for rollbacks)
export const down = `
-- Remove indexes first
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_projects_location;
DROP INDEX IF EXISTS idx_work_hours_start_time;
DROP INDEX IF EXISTS idx_work_hours_project_id;
DROP INDEX IF EXISTS idx_work_hours_user_id;

-- Remove tables in reverse order (because of foreign keys)
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS work_hours;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
`;
