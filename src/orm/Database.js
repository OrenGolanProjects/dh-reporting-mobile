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
  
  static async close() {
    if (Database.db) {
      await Database.db.closeAsync();
      Database.db = null;
    }
  }
}

export default Database;
