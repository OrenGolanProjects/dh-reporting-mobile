// src/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { Project } from '../orm/models';
import logger from '../utils/logger';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectList = await Project.query()
        .where('is_active', 1)
        .orderBy('name')
        .get();

      setProjects(projectList.map(p => new Project(p)));
    } catch (err) {
      logger.error('❌ Error loading projects:', err);
      setError(err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { projects, isLoading, error, refreshProjects: loadProjects };
};
