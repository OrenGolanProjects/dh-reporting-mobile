// src/hooks/useActiveSession.js
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Project, WorkSession } from '../orm/models';
import Database from '../orm/Database';
import logger from '../utils/logger';

export const useActiveSession = (userId) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadActiveSession = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const activeWork = await WorkSession.query()
        .where('user_id', userId)
        .whereNull('end_work_time')
        .first();

      if (activeWork) {
        const project = await Project.find(activeWork.project_id);
        activeWork.project_name = project?.name || 'Unknown Project';
        activeWork.active_location = activeWork.location || null;
      }

      setActiveSession(activeWork);
    } catch (err) {
      logger.error('❌ Error loading active session:', err);
      setError(err);
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
        location,
        notes: 'Started via mobile app'
      });

      const project = await Project.find(projectId);
      newSession.project_name = project.name;
      newSession.active_location = location;

      setActiveSession(newSession);
      Alert.alert('Started', `Working on "${project.name}" at ${location}.`);

      return newSession;
    } catch (error) {
      logger.error('❌ Error starting session:', error);
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
      logger.error('❌ Error ending session:', error);
      Alert.alert('Error', 'Failed to end session.');
      throw error;
    }
  }, [activeSession]);

  const handleSessionSwitch = useCallback(async (projectId, location, when) => {
    try {
      await Database.transaction(async () => {
        if (activeSession) {
          const session = await WorkSession.find(activeSession.id);
          await session.update({
            end_work_time: when.getTime(),
            notes: session.notes + ' | Switched to another task'
          });
          setActiveSession(null);
        }
      });

      const newSession = await startNewSession(projectId, location, when);
      return newSession;
    } catch (error) {
      logger.error('❌ Error switching sessions:', error);
      Alert.alert('Error', 'Failed to switch sessions.');
      throw error;
    }
  }, [activeSession, startNewSession]);

  return {
    activeSession,
    isLoading,
    error,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadActiveSession,
  };
};
