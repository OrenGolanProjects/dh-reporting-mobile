// src/hooks/useActiveSession.js
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Project, WorkSession } from '../orm/models';

export const useActiveSession = (userId) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadActiveSession = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const activeWork = await WorkSession.query()
        .where('user_id', userId)
        .whereNull('end_work_time')
        .first();

      if (activeWork) {
        const project = await Project.find(activeWork.project_id);
        activeWork.project_name = project?.name || 'Unknown Project';
        if (activeWork.notes && activeWork.notes.includes(' - ')) {
          const location = activeWork.notes.split(' - ')[1];
          activeWork.active_location = location;
        }
      }

      setActiveSession(activeWork);
    } catch (error) {
      console.error('❌ Error loading active session:', error);
      setActiveSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const startNewSession = useCallback(async (projectId, location, when) => {
    try {
      const newSession = await WorkSession.create({
        project_id: projectId,
        user_id: userId,
        start_work_time: when.getTime(),
        end_work_time: null,
        break_time: 0,
        notes: `Started via mobile app - ${location}`
      });

      const project = await Project.find(projectId);
      newSession.project_name = project.name;
      newSession.active_location = location;

      setActiveSession(newSession);
      Alert.alert('Started', `Working on "${project.name}" at ${location}.`);

      return newSession;
    } catch (error) {
      console.error('❌ Error starting session:', error);
      Alert.alert('Error', 'Failed to start work session.');
      throw error;
    }
  }, [userId]);

  const endSession = useCallback(async (endAt) => {
    if (!activeSession) return;

    try {
      const session = await WorkSession.find(activeSession.id);
      await session.update({
        end_work_time: endAt.getTime(),
        notes: session.notes + ' | Ended via mobile app'
      });

      const endedProject = activeSession.project_name;
      const endedLocation = activeSession.active_location;

      setActiveSession(null);
      Alert.alert('Ended', `Stopped working on "${endedProject}" at ${endedLocation}.`);

      return true;
    } catch (error) {
      console.error('❌ Error ending session:', error);
      Alert.alert('Error', 'Failed to end session.');
      throw error;
    }
  }, [activeSession]);

  const handleSessionSwitch = useCallback(async (projectId, location, when) => {
    try {
      if (activeSession) {
        const session = await WorkSession.find(activeSession.id);
        await session.update({
          end_work_time: when.getTime(),
          notes: session.notes + ' | Switched to another task'
        });
        setActiveSession(null);
      }

      const newSession = await startNewSession(projectId, location, when);
      return newSession;
    } catch (error) {
      console.error('❌ Error switching sessions:', error);
      Alert.alert('Error', 'Failed to switch sessions.');
      throw error;
    }
  }, [activeSession, startNewSession]);

  return {
    activeSession,
    isLoading,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadActiveSession,
  };
};
