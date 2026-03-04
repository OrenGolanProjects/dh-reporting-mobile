export const LOCATION = {
  HOME: 'HOME',
  OFFICE: 'OFFICE',
  CLIENT: 'CLIENT'
};

export const LOCATION_NAMES = {
  [LOCATION.HOME]: 'HOME',
  [LOCATION.CLIENT]: 'CLIENT',
  [LOCATION.OFFICE]: 'OFFICE'
};

export const LOCATIONS = [
  { id: LOCATION.HOME, name: 'Home', icon: '\u{1F3E0}' },
  { id: LOCATION.OFFICE, name: 'Office', icon: '\u{1F3E2}' },
  { id: LOCATION.CLIENT, name: 'Client', icon: '\u{1F465}' },
];

export const MIGRATION_STATUS = {
  APPLIED: 'applied',
  PENDING: 'pending',
  FAILED: 'failed'
};
