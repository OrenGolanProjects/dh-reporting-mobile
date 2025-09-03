import BaseModel from '../BaseModel';

class Project extends BaseModel {
  static tableName = 'projects';
  
  static async getActive() {
    const results = await this.query()
      .where('is_active', 1)
      .orderBy('name')
      .get();
    return results.map(r => new this(r));
  }
  
  async workSessions() {
    const WorkSession = require('./WorkSession').default;
    const results = await WorkSession.query()
      .where('project_id', this.id)
      .orderBy('start_work_time', 'DESC')
      .get();
    return results.map(r => new WorkSession(r));
  }
}

export default Project;