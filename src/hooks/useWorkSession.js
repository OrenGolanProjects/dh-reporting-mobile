// src/hooks/useWorkSession.js
import { useEffect } from 'react';
import { useUser } from './useUser';
import { useProjects } from './useProjects';
import { useActiveSession } from './useActiveSession';

export const useWorkSession = (navigation) => {
  const { currentUser, isLoading: isUserLoading, refreshUser } = useUser();
  const { projects, isLoading: isProjectsLoading, refreshProjects } = useProjects();
  const {
    activeSession,
    isLoading: isSessionLoading,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadActiveSession,
  } = useActiveSession(currentUser?.id);

  // Redirect to sign in if no user
  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      navigation.replace('Signin');
    }
  }, [isUserLoading, currentUser, navigation]);

  // Load active session when user is available
  useEffect(() => {
    if (currentUser?.id) {
      loadActiveSession();
    }
  }, [currentUser?.id, loadActiveSession]);

  const loadData = async () => {
    await Promise.all([refreshUser(), refreshProjects()]);
  };

  return {
    projects,
    currentUser,
    activeSession,
    isLoading: isUserLoading || isProjectsLoading || isSessionLoading,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadData,
  };
};
