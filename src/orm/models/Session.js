import BaseModel from '../BaseModel';
import { getDb } from '../../database/db';

class Session extends BaseModel {
  static tableName = 'session';
  
  static async getCurrent() {
    // Session table only has one row with id=1
    return this.find(1);
  }
  
  static async setCurrent(userId) {
    const timestamp = Date.now();
    
    try {
      // Get the database connection directly
      const db = await getDb();
      
      // Check if session exists
      const existing = await db.getFirstAsync(
        'SELECT * FROM session WHERE id = 1'
      );
      
      if (existing) {
        // Update existing session
        await db.runAsync(
          'UPDATE session SET user_id = ?, signed_in_at = ?, last_activity = ? WHERE id = 1',
          [userId, timestamp, timestamp]
        );
        console.log('✅ Session updated for user:', userId);
      } else {
        // Create new session
        await db.runAsync(
          'INSERT INTO session (id, user_id, signed_in_at, last_activity) VALUES (?, ?, ?, ?)',
          [1, userId, timestamp, timestamp]
        );
        console.log('✅ Session created for user:', userId);
      }
      
      return this.getCurrent();
    } catch (error) {
      console.error('❌ Session.setCurrent error:', error);
      throw error;
    }
  }
  
  static async clear() {
    try {
      const db = await getDb();
      
      // Check if session exists before trying to delete
      const existing = await db.getFirstAsync(
        'SELECT * FROM session WHERE id = 1'
      );
      
      if (existing) {
        await db.runAsync('DELETE FROM session WHERE id = 1');
        console.log('✅ Session cleared');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Session.clear error:', error);
      throw error;
    }
  }
  
  async updateActivity() {
    try {
      const db = await getDb();
      await db.runAsync(
        'UPDATE session SET last_activity = ? WHERE id = 1',
        [Date.now()]
      );
      console.log('✅ Session activity updated');
      return this;
    } catch (error) {
      console.error('❌ updateActivity error:', error);
      throw error;
    }
  }
}

export default Session;