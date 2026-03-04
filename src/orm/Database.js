import * as SQLite from 'expo-sqlite';
import logger from '../utils/logger';

class Database {
  static db = null;
  
  static async getInstance() {
    if (!Database.db) {
      Database.db = await SQLite.openDatabaseAsync('dh_reporting.db');
      await Database.db.execAsync('PRAGMA foreign_keys = ON;');
      logger.log('✅ ORM: Database initialized');
    }
    return Database.db;
  }
  
  static async transaction(callback) {
    const db = await Database.getInstance();
    try {
      await db.execAsync('BEGIN TRANSACTION');
      const result = await callback(db);
      await db.execAsync('COMMIT');
      return result;
    } catch (error) {
      await db.execAsync('ROLLBACK');
      throw error;
    }
  }

  static async close() {
    if (Database.db) {
      await Database.db.closeAsync();
      Database.db = null;
    }
  }
}

export default Database;
