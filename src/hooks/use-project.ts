import { useState, useEffect } from 'react';
import { mockProjects } from '../data/mockData';
import { ProjectData } from '../components/ProjectCard';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
  const refreshProjects = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      // Fetch all projects that need admin approval (pending ones)
      const pendingResponse = await axios.get(`${API_BASE_URL}/projects/admin/projects/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Fetch approved projects
      const approvedResponse = await axios.get(`${API_BASE_URL}/projects/projects/`, {
        params: { status: 'approved' },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Fetch rejected projects
      const rejectedResponse = await axios.get(`${API_BASE_URL}/projects/admin/rejected/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Transform the data to match the expected format
      const transformProject = (project: any): ProjectData => ({
        id: parseInt(project.project_id),
        title: project.title,
        description: project.description,
        category: project.category,
        team: {
          id: project.team,
          name: project.team_name
        },
        thumbnail: project.thumbnail_url,
        sdgs: project.sdgs,
        createdAt: new Date(project.created_at).toLocaleDateString(),
        status: project.status,
        rating: project.average_rating || 0,
        year: new Date(project.created_at).getFullYear().toString()
      });

      // Set the projects
      const pendingData = pendingResponse.data.map(transformProject);
      const approvedData = approvedResponse.data.map(transformProject);
      const rejectedData = rejectedResponse.data.map(transformProject);
      
      setPendingProjects(pendingData);
      setApprovedProjects(approvedData);
      setRejectedProjects(rejectedData);
      setAllProjects([...pendingData, ...approvedData, ...rejectedData]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Fallback to mock data if API fails
      let projects = [...mockProjects].map(project => ({
        ...project,
        status: project.status || 'approved',
        year: project.year || '2024'
      }));
      
      setAllProjects(projects);
      setPendingProjects(projects.filter(p => p.status === 'pending'));
      setApprovedProjects(projects.filter(p => p.status === 'approved'));
      setRejectedProjects(projects.filter(p => p.status === 'rejected'));
    }
  };
  
  // Initialize projects on first render
  useEffect(() => {
    refreshProjects();
  }, []);
  
  // Function to approve a project
  const approveProject = async (projectId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      // Call the API to approve the project
      await axios.post(`${API_BASE_URL}/projects/admin/projects/${projectId}/approve/`, 
        { remarks: "Approved by admin" },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the projects to reflect the updated status
      refreshProjects();
    } catch (error) {
      console.error('Error approving project:', error);
      
      // Fallback to local state update if API fails
      const updatedProjects = allProjects.map(p => 
        p.id === projectId ? { ...p, status: 'approved' } : p
      );
      
      setAllProjects(updatedProjects);
      setPendingProjects(updatedProjects.filter(p => p.status === 'pending'));
      setApprovedProjects(updatedProjects.filter(p => p.status === 'approved'));
      setRejectedProjects(updatedProjects.filter(p => p.status === 'rejected'));
    }
  };
  
  // Function to reject a project
  const rejectProject = async (projectId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      // Call the API to reject the project
      await axios.post(`${API_BASE_URL}/projects/admin/projects/${projectId}/reject/`, 
        { remarks: "Rejected by admin" },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the projects to reflect the updated status
      refreshProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
      
      // Fallback to local state update if API fails
      const updatedProjects = allProjects.map(p => 
        p.id === projectId ? { ...p, status: 'rejected' } : p
      );
      
      setAllProjects(updatedProjects);
      setPendingProjects(updatedProjects.filter(p => p.status === 'pending'));
      setApprovedProjects(updatedProjects.filter(p => p.status === 'approved'));
      setRejectedProjects(updatedProjects.filter(p => p.status === 'rejected'));
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
