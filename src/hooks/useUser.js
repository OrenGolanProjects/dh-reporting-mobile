// src/hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '../orm/models';
import logger from '../utils/logger';

export const useUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await Session.getCurrent();
      if (!session) {
        setCurrentUser(null);
        return null;
      }

      const user = await User.find(session.user_id);
      setCurrentUser(user);
      return user;
    } catch (error) {
      logger.error('❌ Error loading user:', error);
      setCurrentUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { currentUser, isLoading, refreshUser: loadUser };
};
