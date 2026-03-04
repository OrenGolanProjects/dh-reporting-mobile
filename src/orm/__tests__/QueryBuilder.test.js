import QueryBuilder from '../QueryBuilder';

jest.mock('../Database', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockResolvedValue({
      getAllAsync: jest.fn().mockResolvedValue([]),
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1 }),
    }),
  },
}));

const Database = require('../Database').default;

describe('QueryBuilder', () => {
  let mockDb;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockDb = await Database.getInstance();
  });

  // --- sanitizeIdentifier ---

  describe('sanitizeIdentifier', () => {
    it('rejects SQL injection attempt with semicolon and DROP', () => {
      expect(() => new QueryBuilder("'; DROP TABLE")).toThrow('Invalid table name');
    });

    it('rejects SQL injection attempt with OR 1=1', () => {
      expect(() => new QueryBuilder('name OR 1=1')).toThrow('Invalid table name');
    });

    it('rejects names with spaces', () => {
      expect(() => new QueryBuilder('my table')).toThrow('Invalid table name');
    });

    it('rejects names starting with a number', () => {
      expect(() => new QueryBuilder('1table')).toThrow('Invalid table name');
    });

    it('rejects names with special characters', () => {
      expect(() => new QueryBuilder('table-name')).toThrow('Invalid table name');
    });

    it('rejects empty string', () => {
      expect(() => new QueryBuilder('')).toThrow('Invalid table name');
    });

    it('accepts valid alphanumeric names', () => {
      expect(() => new QueryBuilder('users')).not.toThrow();
      expect(() => new QueryBuilder('work_sessions')).not.toThrow();
      expect(() => new QueryBuilder('Table123')).not.toThrow();
    });

    it('accepts names starting with underscore', () => {
      expect(() => new QueryBuilder('_internal')).not.toThrow();
    });

    it('accepts names starting with a letter', () => {
      expect(() => new QueryBuilder('Projects')).not.toThrow();
    });
  });

  // --- where() ---

  describe('where()', () => {
    it('builds correct SQL with parameter binding', async () => {
      const qb = new QueryBuilder('users');
      await qb.where('name', 'Alice').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE name = ?',
        ['Alice']
      );
    });

    it('chains multiple where clauses with AND', async () => {
      const qb = new QueryBuilder('users');
      await qb.where('name', 'Alice').where('age', 30).get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE name = ? AND age = ?',
        ['Alice', 30]
      );
    });

    it('rejects invalid field names', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.where('field; DROP TABLE', 'val')).toThrow('Invalid WHERE field');
    });
  });

  // --- whereNull() ---

  describe('whereNull()', () => {
    it('builds correct SQL with IS NULL', async () => {
      const qb = new QueryBuilder('sessions');
      await qb.whereNull('ended_at').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM sessions WHERE ended_at IS NULL',
        []
      );
    });

    it('combines with regular where clauses', async () => {
      const qb = new QueryBuilder('sessions');
      await qb.where('user_id', 5).whereNull('ended_at').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM sessions WHERE user_id = ? AND ended_at IS NULL',
        [5]
      );
    });

    it('rejects invalid field names', () => {
      const qb = new QueryBuilder('sessions');
      expect(() => qb.whereNull('bad field')).toThrow('Invalid WHERE field');
    });
  });

  // --- orderBy() ---

  describe('orderBy()', () => {
    it('accepts ASC direction', async () => {
      const qb = new QueryBuilder('users');
      await qb.orderBy('name', 'ASC').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY name ASC',
        []
      );
    });

    it('accepts DESC direction', async () => {
      const qb = new QueryBuilder('users');
      await qb.orderBy('name', 'DESC').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY name DESC',
        []
      );
    });

    it('accepts lowercase direction and normalizes to uppercase', async () => {
      const qb = new QueryBuilder('users');
      await qb.orderBy('name', 'desc').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY name DESC',
        []
      );
    });

    it('defaults to ASC when no direction given', async () => {
      const qb = new QueryBuilder('users');
      await qb.orderBy('name').get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY name ASC',
        []
      );
    });

    it('rejects invalid direction', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.orderBy('name', 'RANDOM')).toThrow('Invalid ORDER BY direction');
    });

    it('rejects invalid field names', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.orderBy('bad field')).toThrow('Invalid ORDER BY field');
    });
  });

  // --- limit() ---

  describe('limit()', () => {
    it('accepts valid numeric values', async () => {
      const qb = new QueryBuilder('users');
      await qb.limit(10).get();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM users LIMIT 10',
        []
      );
    });

    it('accepts zero as a valid limit', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.limit(0)).not.toThrow();
    });

    it('rejects NaN', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.limit('not a number')).toThrow('Invalid LIMIT value');
    });

    it('rejects negative values', () => {
      const qb = new QueryBuilder('users');
      expect(() => qb.limit(-1)).toThrow('Invalid LIMIT value');
    });
  });

  // --- insert() ---

  describe('insert()', () => {
    it('builds correct parameterized INSERT', async () => {
      const qb = new QueryBuilder('users');
      await qb.insert({ name: 'Alice', email: 'alice@test.com' });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        ['Alice', 'alice@test.com']
      );
    });

    it('returns result with lastInsertRowId', async () => {
      const qb = new QueryBuilder('users');
      const result = await qb.insert({ name: 'Bob' });

      expect(result).toEqual({ lastInsertRowId: 1 });
    });

    it('rejects invalid field names in insert data', () => {
      const qb = new QueryBuilder('users');
      expect(qb.insert({ 'bad field': 'value' })).rejects.toThrow('Invalid INSERT field');
    });
  });

  // --- update() ---

  describe('update()', () => {
    it('builds correct parameterized UPDATE', async () => {
      const qb = new QueryBuilder('users');
      await qb.update(1, { name: 'Bob', email: 'bob@test.com' });

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        ['Bob', 'bob@test.com', 1]
      );
    });

    it('rejects invalid field names in update data', () => {
      const qb = new QueryBuilder('users');
      expect(qb.update(1, { 'bad field': 'value' })).rejects.toThrow('Invalid UPDATE field');
    });
  });

  // --- delete() ---

  describe('delete()', () => {
    it('builds correct parameterized DELETE', async () => {
      const qb = new QueryBuilder('users');
      await qb.delete(42);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        [42]
      );
    });
  });

  // --- first() ---

  describe('first()', () => {
    it('returns the first result', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([{ id: 1, name: 'Alice' }]);

      const qb = new QueryBuilder('users');
      const result = await qb.first();

      expect(result).toEqual({ id: 1, name: 'Alice' });
    });

    it('returns null when no results', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([]);

      const qb = new QueryBuilder('users');
      const result = await qb.first();

      expect(result).toBeNull();
    });
  });
});
