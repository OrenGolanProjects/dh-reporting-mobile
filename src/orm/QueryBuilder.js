import Database from './Database';

const VALID_DIRECTIONS = ['ASC', 'DESC'];
const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function sanitizeIdentifier(name, label) {
  if (!IDENTIFIER_REGEX.test(name)) {
    throw new Error(`Invalid ${label}: ${name}`);
  }
  return name;
}

class QueryBuilder {
  constructor(tableName) {
    this.tableName = sanitizeIdentifier(tableName, 'table name');
    this.wheres = [];
    this.limitValue = null;
    this.orderByField = null;
    this.orderDirection = 'ASC';
  }

  where(field, value) {
    this.wheres.push({ field: sanitizeIdentifier(field, 'WHERE field'), value, operator: '=' });
    return this;
  }

  whereNull(field) {
    this.wheres.push({ field: sanitizeIdentifier(field, 'WHERE field'), value: null, operator: 'IS' });
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.orderByField = sanitizeIdentifier(field, 'ORDER BY field');
    const dir = direction.toUpperCase();
    if (!VALID_DIRECTIONS.includes(dir)) {
      throw new Error(`Invalid ORDER BY direction: ${direction}`);
    }
    this.orderDirection = dir;
    return this;
  }

  limit(value) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) {
      throw new Error(`Invalid LIMIT value: ${value}`);
    }
    this.limitValue = parsed;
    return this;
  }

  async get() {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (this.wheres.length > 0) {
      const whereClause = this.wheres.map(w => {
        if (w.operator === 'IS' && w.value === null) {
          return `${w.field} IS NULL`;
        }
        params.push(w.value);
        return `${w.field} ${w.operator} ?`;
      }).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }

    if (this.orderByField) {
      sql += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
    }

    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    const db = await Database.getInstance();
    return db.getAllAsync(sql, params);
  }

  async first() {
    this.limit(1);
    const results = await this.get();
    return results[0] || null;
  }

  async insert(data) {
    const fields = Object.keys(data).map(f => sanitizeIdentifier(f, 'INSERT field'));
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    const db = await Database.getInstance();
    return db.runAsync(sql, values);
  }

  async update(id, data) {
    const fields = Object.keys(data).map(f => sanitizeIdentifier(f, 'UPDATE field'));
    const values = Object.values(data);
    const sets = fields.map(f => `${f} = ?`).join(', ');

    const sql = `UPDATE ${this.tableName} SET ${sets} WHERE id = ?`;
    const db = await Database.getInstance();
    return db.runAsync(sql, [...values, id]);
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const db = await Database.getInstance();
    return db.runAsync(sql, [id]);
  }
}

export default QueryBuilder;

