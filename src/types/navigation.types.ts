// src/types/navigation.types.ts

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
  ErpCredentials: { onComplete?: () => void };
};

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  NewScreen: { userId?: number; projectId?: number };
  ProjectDetails: { projectId: number };
  Reports: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Home: undefined;
};

export type ReportsStackParamList = {
  ReportsList: undefined;
  ReportDetails: { reportId: number };
};

export type MainTabParamList = {
  Projects: undefined;
  Reports: undefined;
  Profile: undefined;
  Logout: { checkAuth?: () => void };
};

export type RootStackParamList = AuthStackParamList & ProjectsStackParamList;
