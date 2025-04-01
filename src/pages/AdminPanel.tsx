
import React from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, BarChart3, Shield } from 'lucide-react';
import ProjectApprovalQueue from '../components/admin/ProjectApprovalQueue';
import UserManagement from '../components/admin/UserManagement';
import ReportsAnalytics from '../components/admin/ReportsAnalytics';
import ContentModeration from '../components/admin/ContentModeration';

const AdminPanel = () => {
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
            <ProjectApprovalQueue />
          </TabsContent>
          
          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <ReportsAnalytics />
          </TabsContent>
          
          {/* Content Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <ContentModeration />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
