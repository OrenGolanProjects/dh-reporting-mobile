import QueryBuilder from './QueryBuilder';

class BaseModel {
  static tableName = '';
  
  constructor(data = {}) {
    Object.assign(this, data);
    this._isNew = !data.id;
  }
  
  static query() {
    return new QueryBuilder(this.tableName);
  }
  
  static async find(id) {
    const result = await this.query().where('id', id).first();
    return result ? new this(result) : null;
  }
  
  static async findBy(field, value) {
    const result = await this.query().where(field, value).first();
    return result ? new this(result) : null;
  }
  
  static async all() {
    const results = await this.query().get();
    return results.map(r => new this(r));
  }
  
  static async create(data) {
    const timestamp = Date.now();
    const dataWithTimestamps = {
      ...data,
      created_at: data.created_at || timestamp,
      updated_at: data.updated_at || timestamp
    };
    
    const result = await this.query().insert(dataWithTimestamps);
    return new this({ ...dataWithTimestamps, id: result.lastInsertRowId });
  }
  
  async save() {
    const timestamp = Date.now();
    
    if (this._isNew) {
      const data = { ...this };
      delete data._isNew;
      data.created_at = data.created_at || timestamp;
      data.updated_at = data.updated_at || timestamp;
      
      const result = await this.constructor.query().insert(data);
      this.id = result.lastInsertRowId;
      this._isNew = false;
    } else {
      const data = { ...this };
      delete data._isNew;
      delete data.id;
      data.updated_at = timestamp;
      
      await this.constructor.query().update(this.id, data);
    }
    return this;
  }
  
  async update(updates) {
    Object.assign(this, updates);
    this.updated_at = Date.now();
    
    const data = { ...this };
    delete data._isNew;
    delete data.id;
    
    await this.constructor.query().update(this.id, data);
    return this;
  }
  
  async delete() {
    if (this.id) {
      await this.constructor.query().delete(this.id);
      return true;
    }
    return false;
  }
  
  toJSON() {
    const data = { ...this };
    delete data._isNew;
    return data;
  }
}

export default BaseModel;
