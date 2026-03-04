import { getDb } from '../db.js';
import logger from '../../utils/logger';

/**
 * Create a new user in the database
 * Example: createUser({ firstName: "John", lastName: "Doe", email: "john@example.com" })
 */
export async function createUser(userInput) {
  try {
    const { firstName, lastName, email, phoneNumber, hmsUser } = userInput;
    const db = await getDb();
    
    const result = await db.runAsync(
      `INSERT INTO users (first_name, last_name, email, phone_number, hms_user) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phoneNumber || null, hmsUser || null]
    );
    
    logger.log('✅ User created with ID:', result.lastInsertRowId);
    return { id: result.lastInsertRowId, ...userInput };
  } catch (error) {
    logger.error('❌ Error creating user:', error);
    throw error;
  }
}

/**
 * Find a user by their email address
 * Example: getUserByEmail("john@example.com")
 */
export async function getUserByEmail(email) {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    
    if (user) {
      logger.log('✅ User found:', user.email);
    } else {
      logger.log('ℹ️ No user found with email:', email);
    }
    
    return user;
  } catch (error) {
    logger.error('❌ Error getting user by email:', error);
    throw error;
  }
}

/**
 * Find a user by their ID
 * Example: getUserById(1)
 */
export async function getUserById(userId) {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    
    return user;
  } catch (error) {
    logger.error('❌ Error getting user by ID:', error);
    throw error;
  }
}

/**
 * Update user information
 * Example: updateUser(1, { firstName: "Jane", lastName: "Smith", email: "jane@example.com" })
 */
export async function updateUser(userId, userInput) {
  try {
    const { firstName, lastName, email, phoneNumber, hmsUser } = userInput;
    const db = await getDb();
    
    await db.runAsync(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, phone_number = ?, hms_user = ?,
           updated_at = strftime('%s', 'now') * 1000
       WHERE id = ?`,
      [firstName, lastName, email, phoneNumber || null, hmsUser || null, userId]
    );
    
    logger.log('✅ User updated successfully');
    return await getUserById(userId);
  } catch (error) {
    logger.error('❌ Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user
 * Example: deleteUser(1)
 */
export async function deleteUser(userId) {
  try {
    const db = await getDb();
    await db.runAsync(`DELETE FROM users WHERE id = ?`, [userId]);
    logger.log('✅ User deleted successfully');
  } catch (error) {
    logger.error('❌ Error deleting user:', error);
    throw error;
  }
}

/**
 * Get all users
 * Example: getAllUsers()
 */
export async function getAllUsers() {
  try {
    const db = await getDb();
    const users = await db.getAllAsync(`SELECT * FROM users ORDER BY first_name, last_name`);
    
    logger.log(`✅ Found ${users.length} users`);
    return users;
  } catch (error) {
    logger.error('❌ Error getting all users:', error);
    throw error;
  }
}
