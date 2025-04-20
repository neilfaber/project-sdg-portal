import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useToast } from '../components/ui/use-toast';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';

import {
  Assessment,
  Comment,
  Feedback,
  Group,
  TrendingUp,
} from '@mui/icons-material';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Project {
  project_id: string;
  id: number;
  title: string;
  description: string;
  category: string;
  team: {
    id: number;
    name: string;
  };
  sdgs: Array<{
    sdg_id: number;
    sdg_name: string;
    sdg_number: number;
  }>;
  status: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at?: string;
}

interface FeedbackData {
  content: string;
  rating: number;
  project_id: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFaculty, setIsFaculty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    content: '',
    rating: 0,
    project_id: ''
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const checkFacultyStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to access the faculty dashboard.",
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

        console.log('User profile:', response.data);

        // Check if user is faculty
        if (response.data.role !== 'faculty') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the faculty dashboard.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setIsFaculty(true);

        // Fetch assigned projects
        await fetchTeacherProjects();
      } catch (error) {
        console.error('Error checking faculty status:', error);
        toast({
          title: "Error",
          description: "Failed to verify faculty privileges. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkFacultyStatus();
  }, [navigate, toast]);

  const fetchTeacherProjects = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      // Fetch projects assigned to this teacher
      const response = await axios.get(`${API_BASE_URL}/projects/user-projects/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Teacher assigned projects:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching teacher projects:', error);
      toast({
        title: "Error",
        description: "Failed to load your assigned projects.",
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFeedbackClick = (project: Project) => {
    setSelectedProject(project);
    setFeedbackData({
      content: '',
      rating: 0,
      project_id: project.project_id
    });
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackDialogOpen(false);
    setSelectedProject(null);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({
      ...feedbackData,
      content: e.target.value
    });
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setFeedbackData({
      ...feedbackData,
      rating: newValue || 0
    });
  };

  const handleSubmitFeedback = async () => {
    if (!selectedProject || !feedbackData.content || feedbackData.rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide both feedback text and a rating.",
        variant: "destructive"
      });
      return;
    }

    setFeedbackLoading(true);
    const accessToken = localStorage.getItem('accessToken');

    try {
      // Submit feedback to backend
      await axios.post(
        `${API_BASE_URL}/projects/feedback/`,
        feedbackData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Success",
        description: "Feedback submitted successfully.",
      });

      // Close dialog and refresh projects
      handleCloseFeedback();
      fetchTeacherProjects();
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      let errorMessage = "Failed to submit feedback. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-xl">Verifying faculty privileges...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isFaculty) {
    return null; // This should never render as the user will be redirected
  }

  return (
    <Layout>
      <div className="page-container">
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Teacher Dashboard
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<Group />} label="Project Overview" />
              <Tab icon={<TrendingUp />} label="SDG Review" />
              <Tab icon={<Comment />} label="Communication" />
              <Tab icon={<Feedback />} label="Feedback Management" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Student Group Projects
                  </Typography>
                  
                  {projects.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      You don't have any assigned projects yet. Projects will appear here when an admin assigns them to you.
                    </Alert>
                  ) : (
                    <List>
                      {projects.map((project) => (
                        <ListItem key={project.project_id} divider>
                          <ListItemText
                            primary={project.title}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  Category: {project.category} | Status: {project.status}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Team: {project.team?.name || 'Unknown Team'}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  SDGs: {project.sdgs?.map(sdg => `SDG ${sdg.sdg_number}`).join(', ') || 'None'}
                                </Typography>
                              </>
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFeedbackClick(project)}
                          >
                            Review
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    SDG Mapping Review
                  </Typography>
                  
                  {projects.length === 0 ? (
                    <Alert severity="info">No projects available for SDG review.</Alert>
                  ) : (
                    <List>
                      {projects.map((project) => (
                        <ListItem key={project.project_id} divider>
                          <ListItemText
                            primary={project.title}
                            secondary={`Current SDGs: ${project.sdgs?.map(sdg => `SDG ${sdg.sdg_number} - ${sdg.sdg_name}`).join(', ') || 'None assigned'}`}
                          />
                          <Box>
                            {project.sdgs?.map(sdg => (
                              <Chip 
                                key={sdg.sdg_id} 
                                label={`SDG ${sdg.sdg_number}`} 
                                color="primary" 
                                sx={{ mr: 1, mb: 1 }} 
                              />
                            ))}
                            <Button variant="outlined" color="primary">
                              Suggest SDG
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Team Communication
                  </Typography>
                  
                  {projects.length === 0 ? (
                    <Alert severity="info">No teams available for communication.</Alert>
                  ) : (
                    <List>
                      {projects.map((project) => (
                        <ListItem key={project.project_id} divider>
                          <ListItemText
                            primary={project.title}
                            secondary={`Team: ${project.team?.name || 'Unknown'} | Last updated: ${new Date(project.created_at).toLocaleDateString()}`}
                          />
                          <Button variant="contained" color="primary">
                            Send Message
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Feedback History
                  </Typography>
                  
                  {projects.length === 0 ? (
                    <Alert severity="info">No feedback history available.</Alert>
                  ) : (
                    <List>
                      {projects.map((project) => (
                        <ListItem key={project.project_id} divider>
                          <ListItemText
                            primary={project.title}
                            secondary={`Team: ${project.team?.name || 'Unknown'}`}
                          />
                          <Button variant="outlined" color="primary">
                            View History
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <Dialog 
            open={feedbackDialogOpen} 
            onClose={handleCloseFeedback}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              Provide Feedback
              {selectedProject && (
                <Typography variant="subtitle1" color="text.secondary">
                  {selectedProject.title}
                </Typography>
              )}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Feedback"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={feedbackData.content}
                onChange={handleFeedbackChange}
                placeholder="Provide your feedback on this project. This will be visible to the students."
              />
              <Box sx={{ mt: 2 }}>
                <Typography component="legend">Project Quality Rating</Typography>
                <Rating 
                  value={feedbackData.rating} 
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFeedback}>Cancel</Button>
              <Button 
                onClick={handleSubmitFeedback} 
                variant="contained" 
                color="primary"
                disabled={feedbackLoading || !feedbackData.content || feedbackData.rating === 0}
              >
                {feedbackLoading ? <CircularProgress size={24} /> : 'Submit Feedback'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </Layout>
  );
};

export default Teachers; 