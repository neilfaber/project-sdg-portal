import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useToast } from '../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, PieChart, Activity, Users, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Management = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isManagement, setIsManagement] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkManagementStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to access the management dashboard.",
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

        if (response.data.role !== 'management') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the management dashboard.",
            variant: "destructive"
          });
          navigate('/');
          return;
}

        setIsManagement(true);
      } catch (error) {
        console.error('Error checking management status:', error);
        toast({
          title: "Error",
          description: "Failed to verify management privileges. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkManagementStatus();
  }, [navigate, toast]);

  if (isLoading) {
  return (
      <Layout>
        <div className="page-container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-xl">Verifying management privileges...</div>
          </div>
    </div>
      </Layout>
  );
}

  if (!isManagement) {
    return null; // This should never render as the user will be redirected
  }

  return (
    <Layout>
      <div className="page-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Management Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of platform activities, statistics, and reports
            </p>
          </div>
          <Button>
            Generate Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Projects</CardTitle>
                  <CardDescription>All submitted projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Users</CardTitle>
                  <CardDescription>Registered platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">157</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Engagement</CardTitle>
                  <CardDescription>Average project interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">+7% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>User engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">Activity Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
                  <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Projects by SDG category</CardDescription>
              </CardHeader>
                    <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">SDG Distribution Chart Placeholder</p>
                </div>
                    </CardContent>
                  </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
                  <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by role</CardDescription>
              </CardHeader>
                    <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">User Demographics Chart Placeholder</p>
                </div>
                    </CardContent>
                  </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
                  <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
                    <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">KPI Dashboard Placeholder</p>
                </div>
                    </CardContent>
                  </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Management; 