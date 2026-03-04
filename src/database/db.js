import * as SQLite from 'expo-sqlite';
import logger from '../utils/logger';

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
      
      logger.log('✅ Database initialized successfully');
    }
    return db;
  } catch (error) {
    logger.error('❌ Error initializing database:', error);
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
    logger.log('✅ Database connection closed');
  }
}

export const getTodayWorkSessions = async (userId, startOfDay, endOfDay) => {
  try {
    const database = await getDb();

    logger.log(
      'Fetching work sessions for user:',
      userId,
      'from:',
      new Date(startOfDay),
      'to:',
      new Date(endOfDay)
    );

    const query = `
      SELECT
        ws.id,
        ws.user_id,
        ws.project_id,
        ws.start_work_time,
        ws.end_work_time,
        ws.break_time,
        ws.notes,
        ws.created_at,
        ws.updated_at,
        p.name as project_name,
        p.description as project_description
      FROM work_sessions ws
      LEFT JOIN projects p ON ws.project_id = p.id
      WHERE ws.user_id = ?
        AND ws.start_work_time >= ?
        AND ws.start_work_time <= ?
      ORDER BY ws.start_work_time DESC
    `;

    const sessions = await database.getAllAsync(query, [userId, startOfDay, endOfDay]);

    logger.log('Found', sessions.length, 'work sessions for today');
    return sessions;
  } catch (error) {
    logger.error('Error fetching today work sessions:', error);
    throw error;
  }
};