
import React from 'react';
import { Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'student', status: 'active' },
    { id: 2, name: 'Emily Johnson', email: 'emily@example.com', role: 'faculty', status: 'active' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'student', status: 'pending' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', status: 'inactive' },
    { id: 5, name: 'David Miller', email: 'david@example.com', role: 'admin', status: 'active' },
  ]);

  const handleUserStatus = (userId: number, newStatus: string) => {
    // In a real implementation, this would make an API call to update the user status
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    
    toast({
      title: "User Status Updated",
      description: `User status has been updated to ${newStatus}.`,
    });
  };

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
