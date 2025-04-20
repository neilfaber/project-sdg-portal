import { useState, useEffect } from 'react';
import { mockProjects } from '../data/mockData';
import { ProjectData } from '../components/ProjectCard';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  // Function to load and categorize projects
  const refreshProjects = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("No access token found");
      toast({
        title: "Authentication Error",
        description: "Please sign in again to continue",
        variant: "destructive"
      });
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
      
      // Filter out duplicates - ensure a project only appears in one category
      // Get all project IDs
      const approvedIds = new Set(approvedData.map(p => p.id));
      const rejectedIds = new Set(rejectedData.map(p => p.id));
      
      // Filter pending projects to remove any that are also in approved or rejected
      const filteredPendingData = pendingData.filter(p => 
        !approvedIds.has(p.id) && !rejectedIds.has(p.id)
      );
      
      setPendingProjects(filteredPendingData);
      setApprovedProjects(approvedData);
      setRejectedProjects(rejectedData);
      
      // Combine all projects for the allProjects state
      setAllProjects([...filteredPendingData, ...approvedData, ...rejectedData]);
      
      console.log("Projects loaded:", {
        pending: filteredPendingData.length,
        approved: approvedData.length,
        rejected: rejectedData.length
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
      
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
      toast({
        title: "Authentication Error",
        description: "Please sign in again to continue",
        variant: "destructive"
      });
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
      
      // Update local state
      const projectToMove = pendingProjects.find(p => p.id === projectId);
      if (projectToMove) {
        const updatedProject = { ...projectToMove, status: 'approved' };
        
        // Update all relevant state atomically
        setPendingProjects(prev => prev.filter(p => p.id !== projectId));
        setApprovedProjects(prev => [...prev, updatedProject]);
        setAllProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      }

      toast({
        title: "Success",
        description: "Project has been approved successfully",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Error",
        description: "Failed to approve project. Please try again.",
        variant: "destructive"
      });
      // Only refresh projects if there was an error
      refreshProjects();
    }
  };
  
  // Function to reject a project
  const rejectProject = async (projectId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast({
        title: "Authentication Error",
        description: "Please sign in again to continue",
        variant: "destructive"
      });
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
      
      // Update local state immediately before refreshing
      const projectToMove = pendingProjects.find(p => p.id === projectId);
      if (projectToMove) {
        const updatedProject = { ...projectToMove, status: 'rejected' };
        setPendingProjects(prev => prev.filter(p => p.id !== projectId));
        setRejectedProjects(prev => [...prev, updatedProject]);
      }
      
      // Refresh the projects to ensure sync with backend
      refreshProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Error",
        description: "Failed to reject project. Please try again.",
        variant: "destructive"
      });
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
