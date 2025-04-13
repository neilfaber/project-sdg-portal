import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface Project {
  project_id: number;
  title: string;
  description: string;
  category: string;
  team_name: string;
  sdgs: Array<{
    sdg_id: number;
    sdg_number: number;
    sdg_name: string;
  }>;
  github_link: string;
  media_link: string;
  thumbnail_url: string;
  created_at: string;
  average_rating: number;
  total_ratings: number;
  status?: 'pending' | 'approved' | 'rejected';
}

interface Category {
  name: string;
  count: number;
}

interface SDG {
  sdg_id: number;
  sdg_number: number;
  sdg_name: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sdgs, setSDGs] = useState<SDG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (filters?: {
    category?: string;
    year?: string;
    sdg?: number;
    search?: string;
  }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.year) params.append('year', filters.year);
      if (filters?.sdg) params.append('sdg', filters.sdg.toString());
      
      const response = await axios.get(`${API_BASE_URL}/projects/projects/`, { params });
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/categories/`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSDGs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/sdgs/`);
      setSDGs(response.data);
    } catch (err) {
      console.error('Error fetching SDGs:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchSDGs();
  }, []);

  return {
    projects,
    categories,
    sdgs,
    loading,
    error,
    fetchProjects,
  };
}; 