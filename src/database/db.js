import * as SQLite from 'expo-sqlite';

let db = null; // Store our database connection

/**
 * Opens database connection (only once)
 */
export async function initDatabase() {
  try {
    if (!db) {
      // Open the database file (creates it if it doesn't exist)
      db = await SQLite.openDatabaseAsync('dh_reporting.db');
      
      // Turn on foreign key constraints for data integrity
      await db.execAsync('PRAGMA foreign_keys = ON;');
      
      console.log('✅ Database initialized successfully');
    }
    return db;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

/**
 * Gets database connection (creates it if needed)
 */
export async function getDb() {
  if (!db) {
    await initDatabase();
  }
  return db;
}

/**
 * Properly closes database connection
 */
export async function closeDatabase() {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log('✅ Database connection closed');
  }
}
