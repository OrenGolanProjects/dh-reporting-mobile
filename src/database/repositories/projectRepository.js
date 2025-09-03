import { getDb } from '../db.js';

/**
 * Create a new project
 * Example: createProject({ name: "Website Design", location: 1, description: "Client website project" })
 */
export async function createProject(projectInput) {
  try {
    const { name, location, description } = projectInput;
    const db = await getDb();
    
    const result = await db.runAsync(
      `INSERT INTO projects (name, location, description) VALUES (?, ?, ?)`,
      [name, location, description || null]
    );
    
    console.log('✅ Project created with ID:', result.lastInsertRowId);
    return { id: result.lastInsertRowId, ...projectInput };
  } catch (error) {
    console.error('❌ Error creating project:', error);
    throw error;
  }
}

/**
 * Get all projects
 * Example: getAllProjects()
 */
export async function getAllProjects() {
  try {
    const db = await getDb();
    const projects = await db.getAllAsync(`SELECT * FROM projects WHERE is_active = 1 ORDER BY name`);
    
    console.log(`✅ Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('❌ Error getting all projects:', error);
    throw error;
  }
}

/**
 * Get projects by location (1=HOME, 2=WORK, 3=OFFICE)
 * Example: getProjectsByLocation(1) // Gets all HOME projects
 */
export async function getProjectsByLocation(location) {
  try {
    const db = await getDb();
    const projects = await db.getAllAsync(
      `SELECT * FROM projects WHERE location = ? AND is_active = 1 ORDER BY name`,
      [location]
    );
    
    console.log(`✅ Found ${projects.length} projects for location ${location}`);
    return projects;
  } catch (error) {
    console.error('❌ Error getting projects by location:', error);
    throw error;
  }
}

/**
 * Get a single project by ID
 * Example: getProjectById(1)
 */
export async function getProjectById(projectId) {
  try {
    const db = await getDb();
    const project = await db.getFirstAsync(
      `SELECT * FROM projects WHERE id = ?`,
      [projectId]
    );
    
    return project;
  } catch (error) {
    console.error('❌ Error getting project by ID:', error);
    throw error;
  }
}

/**
 * Update project information
 * Example: updateProject(1, { name: "Updated Project Name", description: "New description" })
 */
export async function updateProject(projectId, projectInput) {
  try {
    const { name, location, description, isActive } = projectInput;
    const db = await getDb();
    
    await db.runAsync(
      `UPDATE projects 
       SET name = ?, location = ?, description = ?, is_active = ?,
           updated_at = strftime('%s', 'now') * 1000
       WHERE id = ?`,
      [name, location, description || null, isActive !== undefined ? isActive : 1, projectId]
    );
    
    console.log('✅ Project updated successfully');
    return await getProjectById(projectId);
  } catch (error) {
    console.error('❌ Error updating project:', error);
    throw error;
  }
}

/**
 * Deactivate a project (soft delete)
 * Example: deactivateProject(1)
 */
export async function deactivateProject(projectId) {
  try {
    const db = await getDb();
    await db.runAsync(
      `UPDATE projects SET is_active = 0, updated_at = strftime('%s', 'now') * 1000 WHERE id = ?`,
      [projectId]
    );
    console.log('✅ Project deactivated successfully');
  } catch (error) {
    console.error('❌ Error deactivating project:', error);
    throw error;
  }
}

/**
 * Activate a project
 * Example: activateProject(1)
 */
export async function activateProject(projectId) {
  try {
    const db = await getDb();
    await db.runAsync(
      `UPDATE projects SET is_active = 1, updated_at = strftime('%s', 'now') * 1000 WHERE id = ?`,
      [projectId]
    );
    console.log('✅ Project activated successfully');
  } catch (error) {
    console.error('❌ Error activating project:', error);
    throw error;
  }
}

/**
 * Delete a project permanently (this will also delete all related work hours)
 * Example: deleteProject(1)
 */
export async function deleteProject(projectId) {
  try {
    const db = await getDb();
    await db.runAsync(`DELETE FROM projects WHERE id = ?`, [projectId]);
    console.log('✅ Project deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    throw error;
  }
}

/**
 * Search projects by name
 * Example: searchProjects("website")
 */
export async function searchProjects(searchTerm) {
  try {
    const db = await getDb();
    const projects = await db.getAllAsync(
      `SELECT * FROM projects 
       WHERE name LIKE ? AND is_active = 1 
       ORDER BY name`,
      [`%${searchTerm}%`]
    );
    
    console.log(`✅ Found ${projects.length} projects matching "${searchTerm}"`);
    return projects;
  } catch (error) {
    console.error('❌ Error searching projects:', error);
    throw error;
  }
}
