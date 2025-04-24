import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectCard, { ProjectData } from '../components/ProjectCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Edit2, LogOut, Plus, Settings, User, MessageCircle } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import axios from 'axios';
import { Badge } from '../components/ui/badge';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatInterface from '../components/chat/ChatInterface';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface UserData {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
}

// Extended ProjectData interface to include status
interface UserProjectData extends ProjectData {
  status: 'pending' | 'approved' | 'rejected';
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [userProjects, setUserProjects] = useState<UserProjectData[]>([]);
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/signin');
        return;
      }

      try {
        // Fetch user profile
        const response = await axios.get(`${API_BASE_URL}/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        setUser(response.data);
        
        // Fetch user's projects (including pending ones)
        const projectsResponse = await axios.get(`${API_BASE_URL}/projects/user-projects/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUserProjects(projectsResponse.data);

        // Fetch saved projects
        // const savedResponse = await axios.get(`${API_BASE_URL}/projects/saved/`, {
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`
        //   }
        // });
        // setSavedProjects(savedResponse.data);

        setIsLoading(false);
      } catch (error: any) {
        console.error('Profile loading error:', error);
        const errorMessage = error.response?.data?.message || "Failed to load profile";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        if (error.response?.status === 401) {
          navigate('/signin');
        }
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending Approval</Badge>;
    }
  };

  const handleChatRoomSelect = (roomId: number) => {
    setSelectedChatRoomId(roomId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-xl">Loading profile...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container py-8">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`}
                alt={user?.full_name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.full_name}</h1>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                  {user?.role}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button variant="outline" size="sm">
                  <Settings size={16} className="mr-2" /> Account Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Tabs */}
        <Tabs defaultValue="myprojects" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="myprojects" className="px-6">My Projects</TabsTrigger>
            <TabsTrigger value="saved" className="px-6">Saved Projects</TabsTrigger>
            <TabsTrigger value="chat" className="px-6">
              <MessageCircle size={16} className="mr-2" /> Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="myprojects">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <Link to="/create-project">
                <Button>
                  <Plus size={16} className="mr-2" /> Create New Project
                </Button>
              </Link>
            </div>
            
            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <div key={project.project_id} className="animate-fade-in relative">
                    <div className="absolute top-3 right-3 z-10">
                      {renderStatusBadge(project.status)}
                    </div>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <User size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any projects yet. Start creating your first project to showcase your work.
                </p>
                <Link to="/create-project">
                  <Button>
                    <Plus size={16} className="mr-2" /> Create Your First Project
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Saved Projects</h2>
            </div>
            
            {savedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProjects.map((project) => (
                  <div key={project.project_id} className="animate-fade-in">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <User size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No Saved Projects</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't saved any projects yet. Browse the discover page to find projects that interest you.
                </p>
                <Link to="/discover">
                  <Button>Browse Projects</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Chat with Faculty</h2>
              <p className="text-muted-foreground">
                Connect with your assigned faculty members to discuss your projects.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Chat Rooms</h3>
                <ChatRoomList onRoomSelect={handleChatRoomSelect} />
              </div>
              <div className="glass-card rounded-xl p-4 md:col-span-2">
                {selectedChatRoomId ? (
                  <ChatInterface 
                    roomId={selectedChatRoomId} 
                    onClose={() => setSelectedChatRoomId(null)} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <MessageCircle size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Select a Chat Room</h3>
                    <p className="text-muted-foreground">
                      Choose a chat room from the list to start messaging with your faculty.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
