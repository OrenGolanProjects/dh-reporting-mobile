// jest.setup.js
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

// Mock firebase
jest.mock('./src/services/firebase', () => ({
  signUpWithEmail: jest.fn(),
  signInWithEmail: jest.fn(),
  getIdToken: jest.fn(),
  signOut: jest.fn(),
  getCurrentFirebaseUser: jest.fn(),
  onAuthStateChange: jest.fn(() => jest.fn()),
  auth: { currentUser: null },
}));
