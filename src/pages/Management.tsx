import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import {
  Assessment,
  TrendingUp,
  Business,
  Description,
  Group,
} from '@mui/icons-material';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

const Management: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for charts
  const performanceData = [
    { name: 'Jan', participation: 65, quality: 75 },
    { name: 'Feb', participation: 70, quality: 80 },
    { name: 'Mar', participation: 75, quality: 85 },
    { name: 'Apr', participation: 80, quality: 90 },
  ];

  const sdgData = [
    { name: 'SDG 6', projects: 15 },
    { name: 'SDG 7', projects: 20 },
    { name: 'SDG 13', projects: 25 },
    { name: 'SDG 15', projects: 10 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Management Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Assessment />} label="Institutional Performance" />
          <Tab icon={<TrendingUp />} label="SDG Contribution" />
          <Tab icon={<Group />} label="Project Impact" />
          <Tab icon={<Business />} label="Industry Engagement" />
          <Tab icon={<Description />} label="Reports" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Participation Rates
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participation" fill="#8884d8" />
                  <Bar dataKey="quality" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Projects"
                    secondary="150"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Active Students"
                    secondary="450"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Average Project Score"
                    secondary="85%"
                  />
                </ListItem>
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
                SDG Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sdgData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Project Impact Analysis
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Environmental Impact"
                    secondary="Reduced carbon footprint by 25%"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Social Impact"
                    secondary="Engaged with 5 local communities"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Educational Impact"
                    secondary="85% of students reported improved skills"
                  />
                </ListItem>
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
                Industry Partners
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Tech Solutions Inc."
                    secondary="Partnering on 3 projects"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Green Energy Corp"
                    secondary="Mentoring 2 student teams"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Local NGO"
                    secondary="Community engagement partner"
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Add New Partner
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Report Generation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Performance Report</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Detailed analysis of institutional performance
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setReportDialogOpen(true)}>
                        Generate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">SDG Impact Report</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Analysis of SDG contributions
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setReportDialogOpen(true)}>
                        Generate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Project Summary</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overview of all projects
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setReportDialogOpen(true)}>
                        Generate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Report Type</InputLabel>
            <Select label="Report Type">
              <MenuItem value="performance">Performance Report</MenuItem>
              <MenuItem value="sdg">SDG Impact Report</MenuItem>
              <MenuItem value="project">Project Summary</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Date Range"
            type="text"
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setReportDialogOpen(false)} variant="contained" color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Management; 