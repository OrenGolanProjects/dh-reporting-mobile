import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { User, Project, WorkSession, Session } from '../orm/models';

export const useWorkSession = (navigation) => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const session = await Session.getCurrent();
      if (!session) {
        navigation.replace('Signin');
        return;
      }

      const user = await User.find(session.user_id);
      if (!user) {
        navigation.replace('Signin');
        return;
      }

      const projectList = await Project.query()
        .where('is_active', 1)
        .orderBy('name')
        .get();

      const activeWork = await WorkSession.query()
        .where('user_id', user.id)
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

      setCurrentUser(user);
      setProjects(projectList.map(p => new Project(p)));
      setActiveSession(activeWork);

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = async (projectId, location, when) => {
    try {
      const newSession = await WorkSession.create({
        project_id: projectId,
        user_id: currentUser.id,
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
      console.error('Error starting session:', error);
      Alert.alert('Error', 'Failed to start work session.');
      throw error;
    }
  };

  const endSession = async (endAt) => {
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
      console.error('Error ending session:', error);
      Alert.alert('Error', 'Failed to end session.');
      throw error;
    }
  };

  const handleSessionSwitch = async (projectId, location, when) => {
    try {
      // CRITICAL: Wait for the current session to end BEFORE starting new one
      if (activeSession) {
        const session = await WorkSession.find(activeSession.id);
        await session.update({
          end_work_time: when.getTime(),
          notes: session.notes + ' | Switched to another task'
        });

        // Update state to clear active session
        setActiveSession(null);
      }

      // Now start the new session
      const newSession = await startNewSession(projectId, location, when);
      return newSession;
    } catch (error) {
      console.error('Error switching sessions:', error);
      Alert.alert('Error', 'Failed to switch sessions.');
      throw error;
    }
  };


  return {
    projects,
    currentUser,
    activeSession,
    isLoading,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadData
  };
};
