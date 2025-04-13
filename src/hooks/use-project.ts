import { useState, useEffect } from 'react';
import { mockProjects } from '../data/mockData';
import { ProjectData } from '../components/ProjectCard';
import axios from 'axios';

// Define return type for useProjects hook
interface UseProjectsReturn {
  allProjects: ProjectData[];
  pendingProjects: ProjectData[];
  approvedProjects: ProjectData[];
  rejectedProjects: ProjectData[];
  approveProject: (projectId: number) => void;
  rejectProject: (projectId: number) => void;
  refreshProjects: () => void;
}

interface Project {
  project_id: string;
  title: string;
  description: string;
  category: string;
  team_name: string;
  sdgs: {
    sdg_id: number;
    sdg_number: number;
    sdg_name: string;
  }[];
  status: string;
  github_link: string | null;
  media_link: string | null;
  thumbnail_url: string | null;
  created_at: string;
  average_rating: number;
  total_ratings: number;
  features: string[];
}

interface UseProjectReturn {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage multiple projects and their approval states
 */
export const useProjects = (): UseProjectsReturn => {
  const [allProjects, setAllProjects] = useState<ProjectData[]>([]);
  const [pendingProjects, setPendingProjects] = useState<ProjectData[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<ProjectData[]>([]);
  const [rejectedProjects, setRejectedProjects] = useState<ProjectData[]>([]);
  
  // Function to load and categorize projects
  const refreshProjects = () => {
    // Start with mock projects (in a real app, this would be an API call)
    let projects = [...mockProjects].map(project => ({
      ...project,
      status: project.status || 'approved',  // Mark mockProjects as approved by default
      year: project.year || '2024'
    }));
    
    // Get user-submitted projects from localStorage
    const storedProjects = localStorage.getItem('pendingProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        projects = [...projects, ...parsedProjects];
      } catch (error) {
        console.error('Error parsing stored projects:', error);
      }
    }
    
    // Set all projects
    setAllProjects(projects);
    
    // Categorize projects by status
    setPendingProjects(projects.filter(p => p.status === 'pending'));
    setApprovedProjects(projects.filter(p => p.status === 'approved'));
    setRejectedProjects(projects.filter(p => p.status === 'rejected'));
  };
  
  // Initialize projects on first render
  useEffect(() => {
    refreshProjects();
  }, []);
  
  // Function to approve a project
  const approveProject = (projectId: number) => {
    // Find the project
    const projectToApprove = allProjects.find(p => p.id === projectId);
    
    if (projectToApprove) {
      // Update project status in the array
      const updatedProjects = allProjects.map(p => 
        p.id === projectId ? { ...p, status: 'approved' } : p
      );
      
      // Save to localStorage
      localStorage.setItem('pendingProjects', JSON.stringify(
        updatedProjects.filter(p => !mockProjects.some(mp => mp.id === p.id))
      ));
      
      // Refresh all project lists
      refreshProjects();
    }
  };
  
  // Function to reject a project
  const rejectProject = (projectId: number) => {
    // Find the project
    const projectToReject = allProjects.find(p => p.id === projectId);
    
    if (projectToReject) {
      // Update project status in the array
      const updatedProjects = allProjects.map(p => 
        p.id === projectId ? { ...p, status: 'rejected' } : p
      );
      
      // Save to localStorage
      localStorage.setItem('pendingProjects', JSON.stringify(
        updatedProjects.filter(p => !mockProjects.some(mp => mp.id === p.id))
      ));
      
      // Refresh all project lists
      refreshProjects();
    }
  };
  
  return {
    allProjects,
    pendingProjects,
    approvedProjects,
    rejectedProjects,
    approveProject,
    rejectProject,
    refreshProjects
  };
};

/**
 * Hook to get a single project by ID
 */
export const useProject = (projectId: string): UseProjectReturn => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/projects/${projectId}/`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch project details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { project, isLoading, error };
};

export default useProject;
