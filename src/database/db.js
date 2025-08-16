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

export const getTodayWorkSessions = async (userId, startOfDay, endOfDay) => {
  try {
    // Ensure DB is initialized
    if (!db) {
      db = await SQLite.openDatabaseAsync('dh_reporting.db');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      console.log('✅ Database initialized successfully');
    }

    console.log(
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

    // Use async API method instead of .executeSql()
    const sessions = await db.getAllAsync(query, [userId, startOfDay, endOfDay]);

    console.log('Found', sessions.length, 'work sessions for today');
    return sessions;
  } catch (error) {
    console.error('Error fetching today work sessions:', error);
    throw error;
  }
};


// Alternative implementation for Expo SQLite
export const getTodayWorkSessionsExpo = async (userId, startOfDay, endOfDay) => {
  if (!db) {
    // Open the database file (creates it if it doesn't exist)
    db = await SQLite.openDatabaseAsync('dh_reporting.db');
    
    // Turn on foreign key constraints for data integrity
    await db.execAsync('PRAGMA foreign_keys = ON;');
    
    console.log('✅ Database initialized successfully');
  }
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT 
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
          ORDER BY ws.start_work_time DESC`,
          [userId, startOfDay, endOfDay],
          (_, { rows }) => {
            const sessions = rows._array || [];
            console.log('Found', sessions.length, 'work sessions for today');
            resolve(sessions);
          },
          (_, error) => {
            console.error('Database error:', error);
            reject(error);
          }
        );
      },
      error => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

// If you need to handle different database column names, adjust here:
export const getTodayWorkSessionsCustomSchema = async (userId, startOfDay, endOfDay) => {
  try {
    // Adjust column names to match your actual database schema
    const query = `
      SELECT 
        ws.session_id as id,
        ws.user_id,
        ws.project_id,
        ws.start_time as start_work_time,
        ws.end_time as end_work_time,
        ws.break_duration as break_time,
        ws.session_notes as notes,
        ws.created_date as created_at,
        ws.updated_date as updated_at,
        p.project_name as project_name,
        p.project_desc as project_description
      FROM user_work_sessions ws
      LEFT JOIN project_details p ON ws.project_id = p.project_id
      WHERE ws.user_id = ? 
        AND ws.start_time >= ? 
        AND ws.start_time <= ?
      ORDER BY ws.start_time DESC
    `;
    
    const result = await db.executeSql(query, [userId, startOfDay, endOfDay]);
    
    const sessions = [];
    for (let i = 0; i < result.rows.length; i++) {
      sessions.push(result.rows.item(i));
    }
    
    return sessions;
  } catch (error) {
    console.error('Error fetching today work sessions:', error);
    throw error;
  }
};