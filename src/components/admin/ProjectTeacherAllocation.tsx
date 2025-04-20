import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface Project {
  project_id?: string | number;
  id?: number;
  title: string;
  description: string;
  status: string;
  category: string;
  team: {
    id: number;
    team_name: string;
  };
  assigned_teacher?: {
    id: number;
    full_name: string;
  };
}

interface Teacher {
  id: number;
  user_id?: number;
  username?: string;
  full_name: string;
  email: string;
}

const ProjectTeacherAllocation = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<{ [key: number]: boolean }>({});

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch projects
      const projectsResponse = await axios.get(`${API_BASE_URL}/projects/admin/projects/`, { headers });
      if (projectsResponse.data) {
        console.log('Projects data:', projectsResponse.data);
        // Ensure each project has an id
        const processedProjects = projectsResponse.data.map((project: any) => ({
          ...project,
          id: project.id || parseInt(project.project_id) || Math.random() * 10000
        }));
        setProjects(processedProjects);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // First check if the current user has permission to view teachers
      const profileResponse = await axios.get(`${API_BASE_URL}/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('User profile:', profileResponse.data);
      
      // Combine methods to find teachers/faculty
      let teachersData: Teacher[] = [];
      
      // Method 1: Try the teachers endpoint first (requires admin/management role)
      try {
        const teachersResponse = await axios.get(`${API_BASE_URL}/users/teachers/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Teachers API response:', teachersResponse.data);
        
        // Handle different possible response formats
        if (Array.isArray(teachersResponse.data)) {
          teachersData = teachersResponse.data;
        } else if (teachersResponse.data?.teachers && Array.isArray(teachersResponse.data.teachers)) {
          teachersData = teachersResponse.data.teachers;
        } else if (teachersResponse.data?.data && Array.isArray(teachersResponse.data.data)) {
          teachersData = teachersResponse.data.data;
        } else if (teachersResponse.data?.results && Array.isArray(teachersResponse.data.results)) {
          teachersData = teachersResponse.data.results;
        }
      } catch (error) {
        console.log('Error fetching from teachers endpoint, will try admin users endpoint');
      }
      
      // Method 2: If no teachers found, try the admin users endpoint
      if (teachersData.length === 0) {
        try {
          console.log('Attempting to fetch all users...');
          
          // Get all users and filter for faculty role
          const usersResponse = await axios.get(`${API_BASE_URL}/users/admin/users/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('All users response:', usersResponse.data);
          
          if (Array.isArray(usersResponse.data)) {
            // Filter users with role 'faculty' or 'teacher'
            teachersData = usersResponse.data.filter(
              user => user.role === 'faculty' || user.role === 'teacher'
            );
            console.log('Filtered faculty/teacher users:', teachersData);
          }
        } catch (error) {
          console.log('Error fetching from admin users endpoint');
        }
      }
      
      // Method 3: If still no teachers, try creating a mock teacher for testing
      if (teachersData.length === 0) {
        console.log('No teachers found in the system');
        
        // For development/testing only - add a mock teacher
        // Comment this out for production
        teachersData = [
          {
            id: 999,
            full_name: "John Smith (Demo)",
            email: "john.smith@example.com",
            role: "faculty"
          },
          {
            id: 998,
            full_name: "Jane Doe (Demo)",
            email: "jane.doe@example.com",
            role: "faculty"
          }
        ];
        console.log('Added mock teachers for development:', teachersData);
      }
      
      // Ensure each teacher has a valid id
      const processedTeachers = teachersData.map((teacher: any) => ({
        ...teacher,
        id: teacher.id || teacher.user_id || Math.random() * 10000,
        full_name: teacher.full_name || teacher.username || teacher.email || 'Unknown Teacher'
      }));
      
      setTeachers(processedTeachers);
      
      if (processedTeachers.length === 0) {
        toast({
          title: "No Teachers Available",
          description: "There are no teachers available in the system. Please add teachers first.",
          variant: "warning"
        });
      } else {
        console.log(`Successfully loaded ${processedTeachers.length} teachers`);
      }
    } catch (error: any) {
      console.error('Error in teacher loading process:', error);
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue",
          variant: "destructive"
        });
        return;
      } else if (error.response?.status === 403) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to view teachers",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to load teachers. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProjects(), fetchTeachers()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const assignTeacher = async (projectId: number, teacherId: number) => {
    try {
      setAssigning(prev => ({ ...prev, [projectId]: true }));
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      console.log(`Assigning teacher ID ${teacherId} to project ID ${projectId}`);
      
      // Get the teacher data to check role
      const selectedTeacher = teachers.find(t => t.id === teacherId);
      if (!selectedTeacher) {
        throw new Error('Selected teacher not found');
      }
      
      console.log('Selected teacher data:', selectedTeacher);
      
      // Modify the API endpoint to match backend routes
      await axios.post(
        `${API_BASE_URL}/projects/admin/projects/${projectId}/assign_teacher/`,
        { 
          // Use user_id if available (fallback to id)
          teacher_id: selectedTeacher.user_id || selectedTeacher.id
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update the project in the local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                assigned_teacher: selectedTeacher 
              } 
            : project
        )
      );
      
      toast({
        title: "Success",
        description: "Teacher assigned successfully",
      });
    } catch (error: any) {
      console.error('Error assigning teacher:', error);
      let errorMessage = "Failed to assign teacher. ";
      
      if (error.response) {
        console.error('Error response:', error.response);
        if (error.response.status === 404) {
          errorMessage += "The API endpoint or teacher was not found. Note: Only users with role 'teacher' can be assigned.";
        } else if (error.response.data?.error) {
          errorMessage += error.response.data.error;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setAssigning(prev => ({ ...prev, [projectId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
        <p className="text-muted-foreground">There are no projects available for teacher allocation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Teacher Allocation</h2>
      <div className="flex justify-between items-center mb-4">
        <p>Total Projects: {projects.length}</p>
        <p>Available Teachers: {teachers.length}</p>
        <Button 
          variant="outline" 
          onClick={() => Promise.all([fetchProjects(), fetchTeachers()])}
        >
          Refresh Data
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          // Generate a unique key for each project card
          const projectKey = `project-${project.id || project.project_id || Math.random().toString(36).substr(2, 9)}`;
          return (
            <Card key={projectKey} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <Badge variant={project.status === 'approved' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Team: {project.team.team_name}</p>
                    {project.assigned_teacher && (
                      <p className="text-sm text-muted-foreground">
                        Assigned Teacher: {project.assigned_teacher.full_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(value) => assignTeacher(project.id as number, parseInt(value))}
                      disabled={assigning[project.id as number]}
                    >
                      <SelectTrigger className={teachers.length === 0 ? "border-red-500" : ""}>
                        <SelectValue placeholder={teachers.length === 0 ? "No teachers available" : "Assign Teacher"} />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.length > 0 ? (
                          teachers.map((teacher) => {
                            // Generate a unique key for each teacher option
                            const teacherKey = `teacher-${teacher.id || teacher.user_id || Math.random().toString(36).substr(2, 9)}`;
                            return (
                              <SelectItem key={teacherKey} value={teacher.id.toString()}>
                                {teacher.full_name || teacher.email || teacher.username || `Teacher ${teacher.id}`}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <div className="p-2 text-center text-muted-foreground">
                            No teachers available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {assigning[project.id as number] && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTeacherAllocation; 