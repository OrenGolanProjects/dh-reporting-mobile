// src/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { Project } from '../orm/models';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectList = await Project.query()
        .where('is_active', 1)
        .orderBy('name')
        .get();

      setProjects(projectList.map(p => new Project(p)));
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { projects, isLoading, refreshProjects: loadProjects };
};
