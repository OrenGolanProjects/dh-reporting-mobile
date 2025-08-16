import BaseModel from '../BaseModel';

class Session extends BaseModel {
  static tableName = 'session';
  
  static async getCurrent() {
    // Session table only has one row with id=1
    return this.find(1);
  }
  
  static async setCurrent(userId) {
    const timestamp = Date.now();
    const existing = await this.getCurrent();
    
    if (existing) {
      // Update existing session - WITHOUT created_at/updated_at
      const db = await this.query().db;
      await db.runAsync(
        'UPDATE session SET user_id = ?, signed_in_at = ?, last_activity = ? WHERE id = 1',
        [userId, timestamp, timestamp]
      );
    } else {
      // Create new session - WITHOUT created_at/updated_at
      const db = await this.query().db;
      await db.runAsync(
        'INSERT INTO session (id, user_id, signed_in_at, last_activity) VALUES (?, ?, ?, ?)',
        [1, userId, timestamp, timestamp]
      );
    }
    
    return this.getCurrent();
  }
  
  static async clear() {
    const existing = await this.getCurrent();
    if (existing) {
      await this.query().delete(1);
    }
    return true;
  }
  
  async updateActivity() {
    const db = await this.constructor.query().db;
    await db.runAsync(
      'UPDATE session SET last_activity = ? WHERE id = 1',
      [Date.now()]
    );
    return this;
  }
}

export default Session;