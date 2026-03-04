import BaseModel from '../BaseModel';
import QueryBuilder from '../QueryBuilder';

jest.mock('../QueryBuilder');

class TestModel extends BaseModel {
  static tableName = 'test_table';
}

describe('BaseModel', () => {
  let mockQueryBuilder;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      whereNull: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
      get: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockResolvedValue({ lastInsertRowId: 1 }),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    QueryBuilder.mockImplementation(() => mockQueryBuilder);
  });

  // --- find() ---

  describe('find()', () => {
    it('returns model instance when found', async () => {
      mockQueryBuilder.first.mockResolvedValueOnce({ id: 1, name: 'Test' });

      const result = await TestModel.find(1);

      expect(QueryBuilder).toHaveBeenCalledWith('test_table');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id', 1);
      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(result).toBeInstanceOf(TestModel);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test');
      expect(result._isNew).toBe(false);
    });

    it('returns null when not found', async () => {
      mockQueryBuilder.first.mockResolvedValueOnce(null);

      const result = await TestModel.find(999);

      expect(result).toBeNull();
    });
  });

  // --- findBy() ---

  describe('findBy()', () => {
    it('returns model instance when found', async () => {
      mockQueryBuilder.first.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });

      const result = await TestModel.findBy('email', 'test@test.com');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('email', 'test@test.com');
      expect(result).toBeInstanceOf(TestModel);
      expect(result.email).toBe('test@test.com');
    });

    it('returns null when not found', async () => {
      mockQueryBuilder.first.mockResolvedValueOnce(null);

      const result = await TestModel.findBy('email', 'missing@test.com');

      expect(result).toBeNull();
    });
  });

  // --- create() ---

  describe('create()', () => {
    it('adds timestamps and returns instance with id', async () => {
      const beforeCreate = Date.now();

      const result = await TestModel.create({ name: 'New Item' });

      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      const insertedData = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertedData.name).toBe('New Item');
      expect(insertedData.created_at).toBeGreaterThanOrEqual(beforeCreate);
      expect(insertedData.updated_at).toBeGreaterThanOrEqual(beforeCreate);
      expect(result).toBeInstanceOf(TestModel);
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Item');
    });

    it('does not override provided timestamps', async () => {
      const customTimestamp = 1000000;

      const result = await TestModel.create({
        name: 'Item',
        created_at: customTimestamp,
        updated_at: customTimestamp,
      });

      const insertedData = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertedData.created_at).toBe(customTimestamp);
      expect(insertedData.updated_at).toBe(customTimestamp);
    });
  });

  // --- save() ---

  describe('save()', () => {
    it('inserts for new models (no id)', async () => {
      const model = new TestModel({ name: 'Fresh' });
      expect(model._isNew).toBe(true);

      const result = await model.save();

      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.update).not.toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result._isNew).toBe(false);
    });

    it('updates for existing models (has id)', async () => {
      const model = new TestModel({ id: 5, name: 'Existing' });
      expect(model._isNew).toBe(false);

      await model.save();

      expect(mockQueryBuilder.update).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
      const [updateId, updateData] = mockQueryBuilder.update.mock.calls[0];
      expect(updateId).toBe(5);
      expect(updateData.name).toBe('Existing');
      expect(updateData).not.toHaveProperty('_isNew');
      expect(updateData).not.toHaveProperty('id');
    });
  });

  // --- update() ---

  describe('update()', () => {
    it('applies changes and calls query update', async () => {
      const model = new TestModel({ id: 3, name: 'Old Name' });

      const beforeUpdate = Date.now();
      await model.update({ name: 'New Name' });

      expect(model.name).toBe('New Name');
      expect(model.updated_at).toBeGreaterThanOrEqual(beforeUpdate);
      expect(mockQueryBuilder.update).toHaveBeenCalledTimes(1);
      const [updateId, updateData] = mockQueryBuilder.update.mock.calls[0];
      expect(updateId).toBe(3);
      expect(updateData.name).toBe('New Name');
      expect(updateData).not.toHaveProperty('_isNew');
      expect(updateData).not.toHaveProperty('id');
    });
  });

  // --- delete() ---

  describe('delete()', () => {
    it('deletes by id and returns true', async () => {
      const model = new TestModel({ id: 7, name: 'To Delete' });

      const result = await model.delete();

      expect(mockQueryBuilder.delete).toHaveBeenCalledWith(7);
      expect(result).toBe(true);
    });

    it('returns false when model has no id', async () => {
      const model = new TestModel({ name: 'No ID' });

      const result = await model.delete();

      expect(mockQueryBuilder.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  // --- toJSON() ---

  describe('toJSON()', () => {
    it('excludes _isNew from output', () => {
      const model = new TestModel({ id: 1, name: 'Test' });

      const json = model.toJSON();

      expect(json).toEqual({ id: 1, name: 'Test' });
      expect(json).not.toHaveProperty('_isNew');
    });

    it('includes all data properties', () => {
      const model = new TestModel({ id: 2, name: 'Full', email: 'a@b.com', created_at: 123 });

      const json = model.toJSON();

      expect(json).toEqual({ id: 2, name: 'Full', email: 'a@b.com', created_at: 123 });
    });
  });
});
