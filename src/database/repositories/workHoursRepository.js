import { getDb } from '../db.js';

/**
 * Start tracking work time on a project
 * Example: startWorkSession({ projectId: 1, userId: 1, startTime: Date.now() })
 */
export async function startWorkSession(sessionInput) {
  try {
    const { projectId, userId, startTime } = sessionInput;
    const db = await getDb();
    
    const result = await db.runAsync(
      `INSERT INTO work_hours (project_id, user_id, start_work_time) 
       VALUES (?, ?, ?)`,
      [projectId, userId, startTime || Date.now()]
    );
    
    console.log('✅ Work session started with ID:', result.lastInsertRowId);
    return { id: result.lastInsertRowId, ...sessionInput };
  } catch (error) {
    console.error('❌ Error starting work session:', error);
    throw error;
  }
}

/**
 * End a work session
 * Example: endWorkSession(1, Date.now())
 */
export async function endWorkSession(workHoursId, endTime) {
  try {
    const db = await getDb();
    
    await db.runAsync(
      `UPDATE work_hours 
       SET end_work_time = ?, updated_at = strftime('%s', 'now') * 1000
       WHERE id = ?`,
      [endTime || Date.now(), workHoursId]
    );
    
    console.log('✅ Work session ended');
    return await getWorkHoursById(workHoursId);
  } catch (error) {
    console.error('❌ Error ending work session:', error);
    throw error;
  }
}

/**
 * Get work hours entry by ID
 * Example: getWorkHoursById(1)
 */
export async function getWorkHoursById(workHoursId) {
  try {
    const db = await getDb();
    const workHours = await db.getFirstAsync(
      `SELECT * FROM work_hours WHERE id = ?`,
      [workHoursId]
    );
    
    return workHours;
  } catch (error) {
    console.error('❌ Error getting work hours by ID:', error);
    throw error;
  }
}

/**
 * Get all work hours for a user
 * Example: getWorkHoursByUser(1) or getWorkHoursByUser(1, startDate, endDate)
 */
export async function getWorkHoursByUser(userId, startDate, endDate) {
  try {
    const db = await getDb();
    
    let query = `
      SELECT wh.*, p.name as project_name, p.location 
      FROM work_hours wh 
      JOIN projects p ON wh.project_id = p.id 
      WHERE wh.user_id = ?
    `;
    const params = [userId];
    
    if (startDate) {
      query += ` AND wh.start_work_time >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND wh.start_work_time <= ?`;
      params.push(endDate);
    }
    
    query += ` ORDER BY wh.start_work_time DESC`;
    
    const workHours = await db.getAllAsync(query, params);
    console.log(`✅ Found ${workHours.length} work hour entries for user ${userId}`);
    return workHours;
  } catch (error) {
    console.error('❌ Error getting work hours by user:', error);
    throw error;
  }
}

/**
 * Get currently active work session (not ended yet)
 * Example: getActiveWorkSession(1)
 */
export async function getActiveWorkSession(userId) {
  try {
    const db = await getDb();
    const activeSession = await db.getFirstAsync(
      `SELECT wh.*, p.name as project_name, p.location 
       FROM work_hours wh 
       JOIN projects p ON wh.project_id = p.id 
       WHERE wh.user_id = ? AND wh.end_work_time IS NULL`,
      [userId]
    );
    
    if (activeSession) {
      console.log('✅ Active work session found for project:', activeSession.project_name);
    } else {
      console.log('ℹ️ No active work session found');
    }
    
    return activeSession;
  } catch (error) {
    console.error('❌ Error getting active work session:', error);
    throw error;
  }
}
