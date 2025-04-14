import React from 'react';
import { Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUsers } from '@/hooks/use-users';

const UserManagement = () => {
  const { toast } = useToast();
  const { users, isLoading, error, updateUserStatus } = useUsers();

  const handleUserStatus = async (userId: number, newStatus: string) => {
    try {
      await updateUserStatus(userId, newStatus);
      
      toast({
        title: "User Status Updated",
        description: `User status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse text-lg">Loading users...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-red-600">
            <p>Error loading users: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
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
                  {user.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleUserStatus(user.id, 'active')}
                    >
                      <Check size={16} className="mr-1" /> Approve
                    </Button>
                  ) : user.status === 'active' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleUserStatus(user.id, 'inactive')}
                    >
                      <X size={16} className="mr-1" /> Deactivate
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUserStatus(user.id, 'active')}
                    >
                      <Check size={16} className="mr-1" /> Reactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
