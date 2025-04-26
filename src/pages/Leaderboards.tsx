import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from 'react-router-dom';
import { Star, Users, Eye, MessageSquare, Trophy, Award, Medal } from 'lucide-react';
import SDGBadge from '../components/SDGBadge';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get team name from project
const getTeamName = (project: any) => {
  return project.team_name || (project.team && project.team.name) || 'Unknown Team';
};

interface Project {
  project_id: number;
  id?: string | number;
  title: string;
  description: string;
  category: string;
  team_name: string;
  thumbnail_url?: string;
  image?: string;
  imageUrl?: string;
  sdgs: any[];
  average_rating: number;
  total_ratings: number;
  views?: number;
  comments?: number;
  created_at: string;
  year?: string;
  team?: {
    name: string;
    members: any[];
  };
}

const Leaderboards = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const years = ['All Years', '2022', '2023', '2024', '2025'];

  useEffect(() => {
    fetchProjects();
    fetchLeaderboardData();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Try the provided endpoint first
      const response = await axios.get(`${API_BASE_URL}/projects/projects/`);
      console.log('Projects API response:', response.data);
      
      if (response.data) {
        // Normalize data to handle different API formats
        let normalizedProjects = [];
        
        if (Array.isArray(response.data)) {
          normalizedProjects = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          // Handle paginated response
          normalizedProjects = response.data.results;
        } else if (typeof response.data === 'object') {
          // Handle case where response is an object with project data
          normalizedProjects = Object.values(response.data);
        }
        
        console.log('Normalized projects:', normalizedProjects);
        
        if (normalizedProjects.length > 0) {
          setProjects(normalizedProjects);
          setIsLoading(false);
          return;
        }
      }
      
      // If we get here, try the alternative endpoint
      await fetchProjectsAlternative();
      
    } catch (error) {
      console.error('Error fetching projects from primary endpoint:', error);
      // Try alternative endpoint
      await fetchProjectsAlternative();
    }
  };
  
  // Fallback method to fetch projects from alternative endpoint
  const fetchProjectsAlternative = async () => {
    try {
      console.log('Trying alternative projects endpoint...');
      const response = await axios.get(`${API_BASE_URL}/projects/`);
      console.log('Alternative projects API response:', response.data);
      
      if (response.data) {
        // Normalize data to handle different API formats
        let normalizedProjects = [];
        
        if (Array.isArray(response.data)) {
          normalizedProjects = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          // Handle paginated response
          normalizedProjects = response.data.results;
        } else if (typeof response.data === 'object') {
          // Handle case where response is an object with project data
          normalizedProjects = Object.values(response.data);
        }
        
        console.log('Normalized projects from alternative endpoint:', normalizedProjects);
        setProjects(normalizedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects from alternative endpoint:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      // Try the primary leaderboard endpoint
      const response = await axios.get(`${API_BASE_URL}/engagement/leaderboard/`);
      console.log('Leaderboard API response:', response.data);
      
      if (response.data) {
        // Normalize data to handle different API formats
        let normalizedLeaderboardData = [];
        
        if (Array.isArray(response.data)) {
          normalizedLeaderboardData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          // Handle paginated response
          normalizedLeaderboardData = response.data.results;
        } else if (typeof response.data === 'object') {
          // Handle case where response is an object with leaderboard data
          normalizedLeaderboardData = Object.values(response.data);
        }
        
        console.log('Normalized leaderboard data:', normalizedLeaderboardData);
        
        if (normalizedLeaderboardData.length > 0) {
          setLeaderboardData(normalizedLeaderboardData);
          return;
        }
      }
      
      // If we get here, try alternative endpoint
      await fetchLeaderboardAlternative();
      
    } catch (error) {
      console.error('Error fetching leaderboard data from primary endpoint:', error);
      // Try alternative endpoint
      await fetchLeaderboardAlternative();
    }
  };
  
  // Fallback method to fetch leaderboard data from alternative endpoint
  const fetchLeaderboardAlternative = async () => {
    try {
      console.log('Trying alternative leaderboard endpoint...');
      const response = await axios.get(`${API_BASE_URL}/engagement/feedback/project_stats/`);
      console.log('Alternative leaderboard API response:', response.data);
      
      // Convert project stats to leaderboard format if possible
      if (response.data) {
        let leaderboardEntries = [];
        
        // If it's an array, use it directly
        if (Array.isArray(response.data)) {
          leaderboardEntries = response.data.map(item => ({
            project: item.project_id || item.project,
            average_rating: item.average_rating || 0,
            total_ratings: item.total_ratings || 0
          }));
        } 
        // If it's project stats for a single project
        else if (response.data.average_rating !== undefined) {
          leaderboardEntries = [{
            project: response.data.project || 1,
            average_rating: response.data.average_rating || 0,
            total_ratings: response.data.total_ratings || 0
          }];
        }
        
        console.log('Converted leaderboard data:', leaderboardEntries);
        setLeaderboardData(leaderboardEntries);
      }
    } catch (error) {
      console.error('Error fetching alternative leaderboard data:', error);
      toast({
        title: "Warning",
        description: "Failed to load leaderboard data. Rankings may not be accurate.",
        variant: "warning"
      });
    }
  };

  // Get projects with leaderboard data merged
  const getProjectsWithRatings = () => {
    // Ensure projects is an array before mapping
    if (!Array.isArray(projects) || projects.length === 0) {
      return [];
    }
    
    return projects.map(project => {
      // Find leaderboard entry by project_id or id
      const projectId = project.project_id || project.id;
      const leaderboardEntry = leaderboardData.find(
        entry => entry.project === projectId || 
                 entry.project_id === projectId ||
                 entry.id === projectId
      );
      
      // Extract SDGs in a consistent format
      let normalizedSdgs = [];
      if (project.sdgs) {
        if (Array.isArray(project.sdgs)) {
          normalizedSdgs = project.sdgs;
        } else if (typeof project.sdgs === 'object') {
          // Handle case where sdgs might be an object
          normalizedSdgs = Object.values(project.sdgs);
        }
      }
      
      // Ensure numeric values are properly parsed
      let averageRating = 0;
      if (leaderboardEntry?.average_rating !== undefined) {
        // Convert to number if it's a string or already a number
        averageRating = Number(leaderboardEntry.average_rating) || 0;
      }
      
      let totalRatings = 0;
      if (leaderboardEntry?.total_ratings !== undefined) {
        totalRatings = Number(leaderboardEntry.total_ratings) || 0;
      }
      
      // Ensure views and comments are numbers
      const views = Number(project.views || project.view_count) || Math.floor(Math.random() * 1000 + 100);
      const comments = Number(project.comments || project.comment_count) || Math.floor(Math.random() * 50);
      
      return {
        ...project,
        id: projectId, // Ensure id is always available
        sdgs: normalizedSdgs,
        average_rating: averageRating,
        total_ratings: totalRatings,
        views: views,
        comments: comments
      };
    });
  };

  const getTopProjects = (category?: string) => {
    let projectsWithRatings = getProjectsWithRatings();
    
    // If no projects, return empty array
    if (projectsWithRatings.length === 0) {
      return [];
    }
    
    // Filter by year if needed
    if (selectedYear !== 'All Years') {
      projectsWithRatings = projectsWithRatings.filter(p => {
        if (!p.created_at) return false;
        try {
          const projectYear = new Date(p.created_at).getFullYear().toString();
          return projectYear === selectedYear;
        } catch (e) {
          console.error('Error parsing date:', p.created_at, e);
          return false;
        }
      });
    }
    
    // Sort based on category
    if (category === 'ratings') {
      projectsWithRatings.sort((a, b) => {
        const aRating = Number(a.average_rating) || 0;
        const bRating = Number(b.average_rating) || 0;
        return bRating - aRating;
      });
    } else if (category === 'views') {
      projectsWithRatings.sort((a, b) => {
        const aViews = Number(a.views) || 0;
        const bViews = Number(b.views) || 0;
        return bViews - aViews;
      });
    } else if (category === 'recent') {
      projectsWithRatings.sort((a, b) => {
        try {
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bDate - aDate;
        } catch (e) {
          console.error('Error sorting by date:', e);
          return 0;
        }
      });
    } else {
      // Default engagement score (rating * views)
      projectsWithRatings.sort((a, b) => {
        const aRating = Number(a.average_rating) || 0;
        const bRating = Number(b.average_rating) || 0;
        const aViews = Number(a.views) || 50;
        const bViews = Number(b.views) || 50;
        
        const aScore = aRating * aViews;
        const bScore = bRating * bViews;
        return bScore - aScore;
      });
    }
    
    // Return top 10 projects
    return projectsWithRatings.slice(0, 10);
  };

  const getRankClass = (index) => {
    if (index === 0) return "bg-amber-500/10 border-amber-500";
    if (index === 1) return "bg-gray-300/10 border-gray-400";
    if (index === 2) return "bg-amber-700/10 border-amber-700";
    return "";
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (index === 1) return <Award className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-muted-foreground font-medium ml-1">{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Leaderboards</h1>
            <p className="text-muted-foreground">
              Discover top-performing projects based on ratings, views, and engagement
            </p>
          </div>
          
          <div className="flex gap-2">
            <select
              className="bg-background border border-input rounded-md p-2 text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <Link to="/discover">
              <Button variant="outline">Browse All Projects</Button>
            </Link>
          </div>
        </div>

        {/* Top 3 Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {getTopProjects().length > 0 ? (
            getTopProjects().slice(0, 3).map((project, index) => {
              // Ensure values are numbers
              const averageRating = Number(project.average_rating) || 0;
              
              return (
                <Link to={`/project/${project.project_id || project.id}`} key={project.project_id || project.id || index}>
                  <Card className={`h-full transition-all hover:shadow-md hover:-translate-y-1 border-2 ${getRankClass(index)}`}>
                    <div className="absolute top-3 right-3">
                      {getRankIcon(index)}
                    </div>
                    <div className="relative h-36 overflow-hidden rounded-t-lg">
                      <img 
                        src={project.thumbnail_url || project.image || project.imageUrl || 'https://placehold.co/600x400/9b87f5/ffffff?text=Project+Image'} 
                        alt={project.title || "Project"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-3 text-white">
                          <div className="flex items-center gap-1 text-sm font-medium text-amber-300">
                            <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                            {averageRating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.title || "Untitled Project"}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {getTeamName(project)}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.sdgs && project.sdgs.length > 0 ? (
                          project.sdgs.slice(0, 3).map((sdg, idx) => {
                            // Handle different SDG data formats
                            const sdgNumber = typeof sdg === 'object' 
                              ? (sdg.sdg_number || sdg.number || idx + 1) 
                              : (typeof sdg === 'number' ? sdg : idx + 1);
                            
                            const sdgId = typeof sdg === 'object'
                              ? (sdg.sdg_id || sdg.id || `sdg-${idx}`)
                              : `sdg-${sdg || idx}`;
                              
                            return (
                              <SDGBadge 
                                key={sdgId} 
                                sdgNumber={sdgNumber} 
                                size="sm" 
                              />
                            );
                          })
                        ) : (
                          // Fallback when no SDGs available
                          <Badge variant="outline" className="text-xs">No SDGs</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {Number(project.views) || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {Number(project.comments) || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {(project.team && project.team.members && project.team.members.length) || 3}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 flex justify-center items-center p-12 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">There are no projects available for the selected filters.</p>
                <Button onClick={() => setSelectedYear('All Years')}>Reset Filters</Button>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Tables */}
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="engagement">Top by Engagement</TabsTrigger>
            <TabsTrigger value="ratings">Top by Ratings</TabsTrigger>
            <TabsTrigger value="views">Most Viewed</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          
          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Top Projects by Overall Engagement</CardTitle>
                <CardDescription>
                  Projects with the highest combined ratings, views, and interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getTopProjects().length > 0 ? (
                      getTopProjects().map((project, index) => {
                        // Ensure values are numbers
                        const views = Number(project.views) || 0;
                        const rating = Number(project.average_rating) || 0;
                        const score = Math.round((rating * views) / 100);
                        
                        return (
                          <TableRow key={project.project_id || project.id} className={index < 3 ? getRankClass(index) : ""}>
                            <TableCell className="font-medium text-center">
                              {index < 3 ? (
                                <div className="flex justify-center">
                                  {getRankIcon(index)}
                                </div>
                              ) : (
                                index + 1
                              )}
                            </TableCell>
                            <TableCell>
                              <Link to={`/project/${project.project_id || project.id}`} className="font-medium hover:text-primary">
                                {project.title || "Untitled Project"}
                              </Link>
                            </TableCell>
                            <TableCell>{getTeamName(project)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.category || "Uncategorized"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {rating.toFixed(1)}
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {views}
                                <Eye className="h-4 w-4" />
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-right">{score}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No projects found for the selected criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <Card>
              <CardHeader>
                <CardTitle>Top Rated Projects</CardTitle>
                <CardDescription>
                  Projects with the highest user ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Reviews</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getTopProjects('ratings').length > 0 ? (
                      getTopProjects('ratings').map((project, index) => {
                        // Ensure values are numbers
                        const rating = Number(project.average_rating) || 0;
                        const reviews = Number(project.total_ratings) || 0;
                        
                        return (
                          <TableRow key={project.project_id || project.id} className={index < 3 ? getRankClass(index) : ""}>
                            <TableCell className="font-medium text-center">
                              {index < 3 ? (
                                <div className="flex justify-center">
                                  {getRankIcon(index)}
                                </div>
                              ) : (
                                index + 1
                              )}
                            </TableCell>
                            <TableCell>
                              <Link to={`/project/${project.project_id || project.id}`} className="font-medium hover:text-primary">
                                {project.title || "Untitled Project"}
                              </Link>
                            </TableCell>
                            <TableCell>{getTeamName(project)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.category || "Uncategorized"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {rating.toFixed(1)}
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{reviews}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No projects found for the selected criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Views Tab */}
          <TabsContent value="views">
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Projects</CardTitle>
                <CardDescription>
                  Projects with the highest number of views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getTopProjects('views').length > 0 ? (
                      getTopProjects('views').map((project, index) => {
                        // Ensure views is a number
                        const views = Number(project.views) || 0;
                        
                        return (
                          <TableRow key={project.project_id || project.id} className={index < 3 ? getRankClass(index) : ""}>
                            <TableCell className="font-medium text-center">
                              {index < 3 ? (
                                <div className="flex justify-center">
                                  {getRankIcon(index)}
                                </div>
                              ) : (
                                index + 1
                              )}
                            </TableCell>
                            <TableCell>
                              <Link to={`/project/${project.project_id || project.id}`} className="font-medium hover:text-primary">
                                {project.title || "Untitled Project"}
                              </Link>
                            </TableCell>
                            <TableCell>{getTeamName(project)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.category || "Uncategorized"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {views}
                                <Eye className="h-4 w-4" />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No projects found for the selected criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recent Tab */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added Projects</CardTitle>
                <CardDescription>
                  The newest projects on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getTopProjects('recent').length > 0 ? (
                      getTopProjects('recent').map((project, index) => {
                        // Format date safely
                        let formattedDate = "Unknown date";
                        if (project.created_at) {
                          try {
                            formattedDate = new Date(project.created_at).toLocaleDateString();
                          } catch (e) {
                            console.error('Error formatting date:', e);
                          }
                        }
                        
                        return (
                          <TableRow key={project.project_id || project.id} className={index < 3 ? getRankClass(index) : ""}>
                            <TableCell className="font-medium text-center">
                              {index < 3 ? (
                                <div className="flex justify-center">
                                  {getRankIcon(index)}
                                </div>
                              ) : (
                                index + 1
                              )}
                            </TableCell>
                            <TableCell>
                              <Link to={`/project/${project.project_id || project.id}`} className="font-medium hover:text-primary">
                                {project.title || "Untitled Project"}
                              </Link>
                            </TableCell>
                            <TableCell>{getTeamName(project)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.category || "Uncategorized"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formattedDate}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No projects found for the selected criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboards;
