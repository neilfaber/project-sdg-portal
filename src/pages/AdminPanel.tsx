import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, BarChart3, Shield, BookOpen } from 'lucide-react';
import ProjectApprovalQueue from '../components/admin/ProjectApprovalQueue';
import UserManagement from '../components/admin/UserManagement';
import ReportsAnalytics from '../components/admin/ReportsAnalytics';
import ProjectTeacherAllocation from '../components/admin/ProjectTeacherAllocation';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to access the admin panel.",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }

      try {
        // Fetch user profile to check role
        const response = await axios.get(`${API_BASE_URL}/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.data.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin privileges. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-xl">Verifying admin privileges...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null; // This should never render as the user will be redirected
  }

  return (
    <Layout>
      <div className="page-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, approve projects, generate reports, and moderate content.
            </p>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText size={16} />
              Project Approvals
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              User Management
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <BookOpen size={16} />
              Teacher Allocation
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Reports
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield size={16} />
              Content Moderation
            </TabsTrigger>
          </TabsList>
          
          {/* Project Approvals Tab */}
          <TabsContent value="projects" className="space-y-4">
            <ProjectApprovalQueue />
          </TabsContent>
          
          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          
          {/* Teacher Allocation Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <ProjectTeacherAllocation />
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <ReportsAnalytics />
          </TabsContent>
          
          {/* Content Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Content Moderation</h2>
              <p className="text-muted-foreground mb-6">
                Manage and moderate user-generated content, comments, and reports.
              </p>
              <p className="text-sm">This feature is coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
