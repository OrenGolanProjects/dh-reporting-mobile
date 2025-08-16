import BaseModel from '../BaseModel';

class User extends BaseModel {
  static tableName = 'users';
  
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }
  
  async workSessions() {
    const WorkSession = require('./WorkSession').default;
    const results = await WorkSession.query()
      .where('user_id', this.id)
      .orderBy('start_work_time', 'DESC')
      .get();
    return results.map(r => new WorkSession(r));
  }
}

export default User;