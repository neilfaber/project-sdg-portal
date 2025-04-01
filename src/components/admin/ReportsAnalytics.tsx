
import React from 'react';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects } from '@/hooks/use-project';

interface Report {
  id: number;
  name: string;
  description: string;
  date: string;
}

const ReportsAnalytics = () => {
  const { approvedProjects, pendingProjects, rejectedProjects } = useProjects();
  
  const mockReports: Report[] = [
    { id: 1, name: 'User Activity Report', description: 'Overview of user engagement and activity', date: '2025-03-15' },
    { id: 2, name: 'Project Submissions Report', description: 'Statistics on project submissions and approvals', date: '2025-03-10' },
    { id: 3, name: 'Engagement Analytics', description: 'Data on user interactions with projects', date: '2025-03-05' },
    { id: 4, name: 'SDG Coverage Report', description: 'Analysis of SDG coverage across projects', date: '2025-02-28' },
  ];

  return (
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
                  <span className="text-2xl font-bold">5</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Projects</span>
                  <span className="text-2xl font-bold">
                    {pendingProjects.length + approvedProjects.length + rejectedProjects.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Approved</span>
                  <span className="text-2xl font-bold">{approvedProjects.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Pending</span>
                  <span className="text-2xl font-bold">{pendingProjects.length}</span>
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
  );
};

export default ReportsAnalytics;
