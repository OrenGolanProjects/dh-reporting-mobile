import { LOCATION, LOCATION_NAMES, LOCATIONS, MIGRATION_STATUS } from '../constants';

describe('constants', () => {
  // --- LOCATION enum ---

  describe('LOCATION', () => {
    it('has HOME value', () => {
      expect(LOCATION.HOME).toBe('HOME');
    });

    it('has OFFICE value', () => {
      expect(LOCATION.OFFICE).toBe('OFFICE');
    });

    it('has CLIENT value', () => {
      expect(LOCATION.CLIENT).toBe('CLIENT');
    });

    it('has exactly 3 values', () => {
      expect(Object.keys(LOCATION)).toHaveLength(3);
    });
  });

  // --- LOCATION_NAMES ---

  describe('LOCATION_NAMES', () => {
    it('maps HOME location', () => {
      expect(LOCATION_NAMES[LOCATION.HOME]).toBe('HOME');
    });

    it('maps OFFICE location', () => {
      expect(LOCATION_NAMES[LOCATION.OFFICE]).toBe('OFFICE');
    });

    it('maps CLIENT location', () => {
      expect(LOCATION_NAMES[LOCATION.CLIENT]).toBe('CLIENT');
    });

    it('maps all LOCATION values', () => {
      const locationValues = Object.values(LOCATION);
      locationValues.forEach((loc) => {
        expect(LOCATION_NAMES[loc]).toBeDefined();
      });
    });
  });

  // --- LOCATIONS array ---

  describe('LOCATIONS', () => {
    it('has entries for each LOCATION value', () => {
      const locationValues = Object.values(LOCATION);
      expect(LOCATIONS).toHaveLength(locationValues.length);

      const locationIds = LOCATIONS.map((l) => l.id);
      locationValues.forEach((loc) => {
        expect(locationIds).toContain(loc);
      });
    });

    it('each entry has id, name, and icon properties', () => {
      LOCATIONS.forEach((location) => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('name');
        expect(location).toHaveProperty('icon');
        expect(typeof location.id).toBe('string');
        expect(typeof location.name).toBe('string');
        expect(typeof location.icon).toBe('string');
      });
    });

    it('contains HOME entry', () => {
      const home = LOCATIONS.find((l) => l.id === LOCATION.HOME);
      expect(home).toBeDefined();
      expect(home.name).toBe('Home');
    });

    it('contains OFFICE entry', () => {
      const office = LOCATIONS.find((l) => l.id === LOCATION.OFFICE);
      expect(office).toBeDefined();
      expect(office.name).toBe('Office');
    });

    it('contains CLIENT entry', () => {
      const client = LOCATIONS.find((l) => l.id === LOCATION.CLIENT);
      expect(client).toBeDefined();
      expect(client.name).toBe('Client');
    });
  });

  // --- MIGRATION_STATUS ---

  describe('MIGRATION_STATUS', () => {
    it('has APPLIED status', () => {
      expect(MIGRATION_STATUS.APPLIED).toBe('applied');
    });

    it('has PENDING status', () => {
      expect(MIGRATION_STATUS.PENDING).toBe('pending');
    });

    it('has FAILED status', () => {
      expect(MIGRATION_STATUS.FAILED).toBe('failed');
    });

    it('has exactly 3 statuses', () => {
      expect(Object.keys(MIGRATION_STATUS)).toHaveLength(3);
    });
  });
});
