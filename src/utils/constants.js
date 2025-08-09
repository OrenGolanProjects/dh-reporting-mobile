export const LOCATION = {
  HOME: 1,    // Working from home
  WORK: 2,    // Main office
  OFFICE: 3   // Client office
};

export const LOCATION_NAMES = {
  [LOCATION.HOME]: 'HOME',
  [LOCATION.WORK]: 'WORK', 
  [LOCATION.OFFICE]: 'OFFICE'
};

export const MIGRATION_STATUS = {
  PENDING: 'pending',   // Not run yet
  APPLIED: 'applied',   // Successfully completed
  FAILED: 'failed'      // Something went wrong
};