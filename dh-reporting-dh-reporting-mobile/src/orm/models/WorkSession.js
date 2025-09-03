import BaseModel from '../BaseModel';

class WorkSession extends BaseModel {
    static tableName = 'work_hours';
  
  async getProject() {
    const Project = require('./Project').default;
    return Project.find(this.project_id);
  }
  
  async getUser() {
    const User = require('./User').default;
    return User.find(this.user_id);
  }
  
  getDuration() {
    if (!this.end_work_time) return 0;
    return this.end_work_time - this.start_work_time - (this.break_time || 0);
  }
  
  isActive() {
    return !this.end_work_time;
  }
}

export default WorkSession;