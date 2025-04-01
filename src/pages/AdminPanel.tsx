
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, X, FileText, Users, BarChart3, Shield } from 'lucide-react';
import { mockProjects } from '../data/mockData';

// Mock data for pending projects
const pendingProjects = mockProjects.slice(0, 3).map(project => ({
  ...project,
  status: 'pending'
}));

// Mock data for user management
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'student', status: 'active' },
  { id: 2, name: 'Emily Johnson', email: 'emily@example.com', role: 'faculty', status: 'active' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'student', status: 'pending' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', status: 'inactive' },
  { id: 5, name: 'David Miller', email: 'david@example.com', role: 'admin', status: 'active' },
];

// Mock data for reports
const mockReports = [
  { id: 1, name: 'User Activity Report', description: 'Overview of user engagement and activity', date: '2025-03-15' },
  { id: 2, name: 'Project Submissions Report', description: 'Statistics on project submissions and approvals', date: '2025-03-10' },
  { id: 3, name: 'Engagement Analytics', description: 'Data on user interactions with projects', date: '2025-03-05' },
  { id: 4, name: 'SDG Coverage Report', description: 'Analysis of SDG coverage across projects', date: '2025-02-28' },
];

const AdminPanel = () => {
  const [approvalTab, setApprovalTab] = useState('pending');
  
  const handleApprove = (projectId: number) => {
    console.log(`Approving project ${projectId}`);
    // In a real implementation, this would make an API call to update the project status
  };
  
  const handleReject = (projectId: number) => {
    console.log(`Rejecting project ${projectId}`);
    // In a real implementation, this would make an API call to update the project status
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText size={16} />
              Project Approvals
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              User Management
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
            <Card>
              <CardHeader>
                <CardTitle>Project Approval Queue</CardTitle>
                <CardDescription>
                  Review and approve or reject project submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={approvalTab} onValueChange={setApprovalTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProjects.length > 0 ? (
                        pendingProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.team.name}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                            <TableCell className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(project.id)}
                              >
                                <Check size={16} className="mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleReject(project.id)}
                              >
                                <X size={16} className="mr-1" /> Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No pending projects to review
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'faculty' ? 'outline' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === 'active' ? 'default' : 
                              user.status === 'pending' ? 'outline' : 'secondary'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  Generate and view reports on platform usage and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button className="w-full justify-start" variant="outline">
                          <FileText size={16} className="mr-2" /> Generate Activity Report
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <FileText size={16} className="mr-2" /> Generate Engagement Report
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <FileText size={16} className="mr-2" /> Export Users List
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Total Users</span>
                          <span className="text-2xl font-bold">125</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Projects</span>
                          <span className="text-2xl font-bold">48</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">SDGs Covered</span>
                          <span className="text-2xl font-bold">17</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Avg. Engagement</span>
                          <span className="text-2xl font-bold">76%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Table>
                  <TableCaption>Recent Reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.description}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Download</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Review and moderate user-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content flagged for moderation at this time.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
