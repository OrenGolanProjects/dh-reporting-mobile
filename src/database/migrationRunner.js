import { getDb } from './db.js';
import { MIGRATION_STATUS } from '../utils/constants.js';

/**
 * Creates a table to track which migrations we've run
 * This is like a checklist of database changes
 */
async function createMigrationsTable() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,        -- Which migration (1, 2, 3...)
      name TEXT NOT NULL,                     -- What it does
      applied_at INTEGER NOT NULL,            -- When we ran it
      status TEXT NOT NULL DEFAULT 'applied'  -- Did it work?
    );
  `);
}

/**
 * Get list of migrations we've already run
 */
export async function getAppliedMigrations() {
  try {
    await createMigrationsTable(); // Make sure table exists
    const db = await getDb();
    const migrations = await db.getAllAsync(
      `SELECT * FROM migrations ORDER BY version ASC`
    );
    return migrations;
  } catch (error) {
    console.error('❌ Error getting applied migrations:', error);
    throw error;
  }
}

/**
 * Mark a migration as completed
 */
export async function recordMigration(version, name) {
  try {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO migrations (version, name, applied_at, status) 
       VALUES (?, ?, ?, ?)`,
      [version, name, Date.now(), MIGRATION_STATUS.APPLIED]
    );
    console.log(`✅ Migration ${version}_${name} recorded as applied`);
  } catch (error) {
    console.error('❌ Error recording migration:', error);
    throw error;
  }
}

/**
 * Remove migration record (when we undo changes)
 */
export async function removeMigrationRecord(version) {
  try {
    const db = await getDb();
    await db.runAsync(`DELETE FROM migrations WHERE version = ?`, [version]);
    console.log(`✅ Migration ${version} record removed`);
  } catch (error) {
    console.error('❌ Error removing migration record:', error);
    throw error;
  }
}

/**
 * Find the highest migration version we've run
 */
export async function getLatestMigrationVersion() {
  try {
    await createMigrationsTable();
    const db = await getDb();
    const result = await db.getFirstAsync(
      `SELECT MAX(version) as latest_version FROM migrations`
    );
    return result?.latest_version || 0;
  } catch (error) {
    console.error('❌ Error getting latest migration version:', error);
    throw error;
  }
}

/**
 * Run all migrations that haven't been applied yet
 * This is what updates your database when you start the app
 */
export async function runMigrations() {
  try {
    console.log('🔄 Starting migration process...');

    // Make sure migrations table exists
    await createMigrationsTable();

    // Find out which migrations we've already done
    const appliedMigrations = await getAppliedMigrations();
    const appliedVersions = appliedMigrations.map(m => m.version);

    const db = await getDb();

    let migrationsRun = 0;

    // Migration 1: Create initial tables (users, projects, work_hours, session)
    if (!appliedVersions.includes(1)) {
      console.log('🔄 Running migration 1_create_initial_tables...');

      const migration1SQL = `
PRAGMA foreign_keys = ON;

-- Users table: stores user information
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  hms_user TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Projects table: stores project information
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  location INTEGER NOT NULL CHECK (location IN (1,2,3)),
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  UNIQUE(name, location)
);

-- Work hours table: tracks time spent on projects
CREATE TABLE IF NOT EXISTS work_hours (
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

-- Session table: keeps track of logged-in user
CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  user_id INTEGER NOT NULL,
  signed_in_at INTEGER NOT NULL,
  last_activity INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_work_hours_user_id ON work_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_project_id ON work_hours(project_id);
CREATE INDEX IF NOT EXISTS idx_work_hours_start_time ON work_hours(start_work_time);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `;

      await db.execAsync(migration1SQL);
      await recordMigration(1, 'create_initial_tables');
      migrationsRun++;
      console.log('✅ Migration 1_create_initial_tables completed');
    }

    // Migration 2: Create migration tracking (mostly for record keeping)
    if (!appliedVersions.includes(2)) {
      console.log('🔄 Running migration 2_create_migration_tracking...');

      const migration2SQL = `
-- Add the record for migration 1 if it doesn't exist
-- (in case the migrations table was created after migration 1 ran)
INSERT OR IGNORE INTO migrations (version, name, applied_at, status) 
VALUES (1, 'create_initial_tables', strftime('%s', 'now') * 1000, 'applied');
      `;

      await db.execAsync(migration2SQL);
      await recordMigration(2, 'create_migration_tracking');
      migrationsRun++;
      console.log('✅ Migration 2_create_migration_tracking completed');
    }

    // NO MORE MIGRATIONS - We only have 1 and 2 now!

    if (migrationsRun === 0) {
      console.log('ℹ️ No pending migrations to run');
    } else {
      console.log(`✅ ${migrationsRun} migrations completed successfully`);
    }

  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

/**
 * Undo migrations back to a specific version
 * This is like "undo" for database changes
 */
export async function downgradeTo(targetVersion) {
  try {
    console.log(`🔄 Downgrading to version ${targetVersion}...`);

    // Find migrations to undo (newer than target version)
    const appliedMigrations = await getAppliedMigrations();
    const migrationsToReverse = appliedMigrations
      .filter(m => m.version > targetVersion)
      .sort((a, b) => b.version - a.version); // Newest first

    const db = await getDb();

    for (const appliedMigration of migrationsToReverse) {
      console.log(`🔄 Reversing migration ${appliedMigration.version}_${appliedMigration.name}...`);
      
      if (appliedMigration.version === 2) {
        // Migration 2 down: Just remove the record
        // (migrations table should stay since it's needed)
      } else if (appliedMigration.version === 1) {
        // Migration 1 down: Remove all tables
        const down1SQL = `
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
        await db.execAsync(down1SQL);
      }

      // Remove the migration record
      await removeMigrationRecord(appliedMigration.version);
      console.log(`✅ Migration ${appliedMigration.version}_${appliedMigration.name} reversed`);
    }

    console.log(`✅ Downgrade to version ${targetVersion} completed`);

  } catch (error) {
    console.error('❌ Error during downgrade:', error);
    throw error;
  }
}