import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProjects } from '@/hooks/use-project';

const ProjectApprovalQueue = () => {
  const { pendingProjects, approvedProjects, rejectedProjects, approveProject, rejectProject } = useProjects();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [approvalTab, setApprovalTab] = React.useState('pending');

  const handleApprove = async (projectId: number) => {
    try {
      await approveProject(projectId);
      toast({
        title: "Project Approved",
        description: "Project has been approved and is now visible on the discover page.",
      });
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Error",
        description: "Failed to approve project. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleReject = async (projectId: number) => {
    try {
      await rejectProject(projectId);
      toast({
        title: "Project Rejected",
        description: "Project has been rejected.",
      });
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Error",
        description: "Failed to reject project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProjectsByTab = () => {
    switch (approvalTab) {
      case 'approved':
        return approvedProjects;
      case 'rejected':
        return rejectedProjects;
      default:
        return pendingProjects;
    }
  };

  const navigateToProject = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
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
            <TabsTrigger value="pending">
              Pending
              <Badge variant="outline" className="ml-2">
                {pendingProjects.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="outline" className="ml-2">
                {approvedProjects.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="outline" className="ml-2">
                {rejectedProjects.length}
              </Badge>
            </TabsTrigger>
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
              {getProjectsByTab().length > 0 ? (
                getProjectsByTab().map((project) => (
                  <TableRow key={project.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => navigateToProject(project.id)}
                    >
                      {project.title}
                    </TableCell>
                    <TableCell>{project.team.name}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.createdAt}</TableCell>
                    <TableCell className="space-x-2">
                      {approvalTab === 'pending' ? (
                        <>
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
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigateToProject(project.id)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No {approvalTab} projects to review
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectApprovalQueue;
