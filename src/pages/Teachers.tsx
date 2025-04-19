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
  const [tabValue, setTabValue] = useState(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFeedbackClick = (projectId: string) => {
    setSelectedProject(projectId);
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackDialogOpen(false);
    setSelectedProject(null);
  };

  // Mock data - replace with actual API calls
  const projects = [
    { id: 1, name: 'Sustainable Energy Project', sdg: 'SDG 7', status: 'In Progress' },
    { id: 2, name: 'Water Conservation Initiative', sdg: 'SDG 6', status: 'Completed' },
  ];

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
                  <List>
                    {projects.map((project) => (
                      <ListItem key={project.id} divider>
                        <ListItemText
                          primary={project.name}
                          secondary={`SDG: ${project.sdg} | Status: ${project.status}`}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleFeedbackClick(project.id.toString())}
                        >
                          Review
                        </Button>
                      </ListItem>
                    ))}
                  </List>
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
                  <List>
                    {projects.map((project) => (
                      <ListItem key={project.id} divider>
                        <ListItemText
                          primary={project.name}
                          secondary={`Current SDG: ${project.sdg}`}
                        />
                        <Box>
                          <Chip label={project.sdg} color="primary" sx={{ mr: 1 }} />
                          <Button variant="outlined" color="primary">
                            Suggest SDG
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
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
                  <List>
                    {projects.map((project) => (
                      <ListItem key={project.id} divider>
                        <ListItemText
                          primary={project.name}
                          secondary="Last updated: 2 days ago"
                        />
                        <Button variant="contained" color="primary">
                          Send Message
                        </Button>
                      </ListItem>
                    ))}
                  </List>
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
                  <List>
                    {projects.map((project) => (
                      <ListItem key={project.id} divider>
                        <ListItemText
                          primary={project.name}
                          secondary="Last feedback: 1 week ago"
                        />
                        <Button variant="outlined" color="primary">
                          View History
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedback}>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Feedback"
                type="text"
                fullWidth
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2 }}>
                <Typography component="legend">Project Quality</Typography>
                <Rating />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFeedback}>Cancel</Button>
              <Button onClick={handleCloseFeedback} variant="contained" color="primary">
                Submit Feedback
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </Layout>
  );
};

export default Teachers; 