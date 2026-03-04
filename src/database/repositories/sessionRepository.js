import { getDb } from '../db.js';
import logger from '../../utils/logger';

/**
 * Check if someone is logged in
 * Returns session info or null if nobody is logged in
 */
export async function getSession() {
  try {
    const db = await getDb();
    const session = await db.getFirstAsync(`SELECT * FROM session WHERE id = 1`);
    
    if (session) {
      logger.log('✅ Active session found for user ID:', session.user_id);
    } else {
      logger.log('ℹ️ No active session found');
    }
    
    return session;
  } catch (error) {
    logger.error('❌ Error getting session:', error);
    throw error;
  }
}

/**
 * Log in a user (create a session)
 * Example: setCurrentUser(1) or setCurrentUser(1, Date.now())
 */
export async function setCurrentUser(userId, signedInAt) {
  try {
    const db = await getDb();
    const timestamp = signedInAt || Date.now();
    
    // Remove any existing session (only one user can be logged in)
    await db.runAsync(`DELETE FROM session`);
    
    // Create new session record
    await db.runAsync(
      `INSERT INTO session (id, user_id, signed_in_at, last_activity) VALUES (1, ?, ?, ?)`,
      [userId, timestamp, timestamp]
    );
    
    logger.log('✅ User logged in successfully. User ID:', userId);
  } catch (error) {
    logger.error('❌ Error setting current user:', error);
    throw error;
  }
}

/**
 * Log out the current user (remove session)
 */
export async function clearCurrentUser() {
  try {
    const db = await getDb();
    await db.runAsync(`DELETE FROM session`);
    logger.log('✅ User logged out successfully');
  } catch (error) {
    logger.error('❌ Error clearing current user:', error);
    throw error;
  }
}

/**
 * Get full user details for whoever is logged in
 * Returns user object or null if nobody is logged in
 */
export async function getCurrentUser() {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync(`
      SELECT u.* FROM session s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = 1
    `);
    
    if (user) {
      logger.log('✅ Current user:', user.email);
    } else {
      logger.log('ℹ️ No user currently logged in');
    }
    
    return user;
  } catch (error) {
    logger.error('❌ Error getting current user:', error);
    throw error;
  }
}

/**
 * Update when user was last active (for timeout features)
 */
export async function updateLastActivity(timestamp) {
  try {
    const db = await getDb();
    await db.runAsync(
      `UPDATE session SET last_activity = ? WHERE id = 1`,
      [timestamp || Date.now()]
    );
  } catch (error) {
    logger.error('❌ Error updating last activity:', error);
    throw error;
  }
}
