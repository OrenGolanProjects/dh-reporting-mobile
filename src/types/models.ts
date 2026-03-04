// src/types/models.ts

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  hms_user?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  hms_user?: string;
}

export interface ProjectData {
  id: number;
  name: string;
  description?: string;
  location: number;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  location: number;
  is_active?: number;
}

export interface WorkSessionData {
  id: number;
  project_id: number;
  user_id: number;
  start_work_time: number;
  end_work_time: number | null;
  break_time: number;
  notes?: string;
  created_at: number;
  updated_at: number;
  // Enriched fields (added at runtime)
  project_name?: string;
  active_location?: string;
}

export interface CreateWorkSessionData {
  project_id: number;
  user_id: number;
  start_work_time: number;
  end_work_time: number | null;
  break_time: number;
  notes?: string;
}

export interface SessionData {
  id: number;
  user_id: number;
  signed_in_at: number;
  last_activity: number;
}
