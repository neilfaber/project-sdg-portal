import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  updateUserStatus: (userId: number, newStatus: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

/**
 * Hook to manage users in the admin panel
 */
export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No access token found');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/admin/users/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      
      // Fallback to mock data if API fails
      setUsers([
        { id: 1, username: 'johnsmith', full_name: 'John Smith', email: 'john@example.com', role: 'student', status: 'active', created_at: '2024-01-15' },
        { id: 2, username: 'emilyjohnson', full_name: 'Emily Johnson', email: 'emily@example.com', role: 'faculty', status: 'active', created_at: '2024-01-10' },
        { id: 3, username: 'michaelbrown', full_name: 'Michael Brown', email: 'michael@example.com', role: 'student', status: 'pending', created_at: '2024-02-05' },
        { id: 4, username: 'sarahwilliams', full_name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', status: 'inactive', created_at: '2024-01-20' },
        { id: 5, username: 'davidmiller', full_name: 'David Miller', email: 'david@example.com', role: 'admin', status: 'active', created_at: '2023-12-15' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No access token found');
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/users/admin/users/${userId}/`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh users after update
      await refreshUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
      
      // Fallback to update in local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    }
  };

  // Load users when the hook is first used
  useEffect(() => {
    refreshUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    updateUserStatus,
    refreshUsers
  };
};

export default useUsers; 