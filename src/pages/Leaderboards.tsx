import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from 'react-router-dom';
import { Star, Users, Eye, MessageSquare, Trophy, Award, Medal } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import SDGBadge from '../components/SDGBadge';

// Sort projects by engagement (for demonstration)
const topProjects = [...mockProjects].sort((a, b) => {
  // Fake calculation of engagement score (rating * views)
  const aScore = (a.rating || 0) * (a.views || 50);
  const bScore = (b.rating || 0) * (b.views || 50);
  return bScore - aScore;
}).slice(0, 10);

const Leaderboards = () => {
  const [selectedYear, setSelectedYear] = useState('All Years');
  const years = ['All Years', '2022', '2023', '2024', '2025'];

  const getTopProjects = (category) => {
    let filteredProjects = [...topProjects];
    
    if (selectedYear !== 'All Years') {
      filteredProjects = filteredProjects.filter(p => p.year === selectedYear);
    }
    
    return filteredProjects.slice(0, 5);
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
          {getTopProjects().slice(0, 3).map((project, index) => (
            <Link to={`/project/${project.id}`} key={project.id}>
              <Card className={`h-full transition-all hover:shadow-md hover:-translate-y-1 border-2 ${getRankClass(index)}`}>
                <div className="absolute top-3 right-3">
                  {getRankIcon(index)}
                </div>
                <div className="relative h-36 overflow-hidden rounded-t-lg">
                  <img 
                    src={project.image || 'https://placehold.co/600x400/9b87f5/ffffff?text=Project+Image'} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <div className="flex items-center gap-1 text-sm font-medium text-amber-300">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {project.rating || (4 + Math.random()).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {project.team.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.sdgs.slice(0, 3).map((sdg) => (
                      <SDGBadge key={sdg} sdgNumber={sdg} size="sm" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {project.views || Math.floor(Math.random() * 1000 + 100)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {project.comments || Math.floor(Math.random() * 50)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.team.members.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
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
                    {getTopProjects().map((project, index) => {
                      const views = project.views || Math.floor(Math.random() * 1000 + 100);
                      const rating = project.rating || (4 + Math.random()).toFixed(1);
                      const score = (rating * views / 100).toFixed(0);
                      
                      return (
                        <TableRow key={project.id} className={index < 3 ? getRankClass(index) : ""}>
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
                            <Link to={`/project/${project.id}`} className="font-medium hover:text-primary">
                              {project.title}
                            </Link>
                          </TableCell>
                          <TableCell>{project.team.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {rating}
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
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would have similar structure but different sorting */}
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
                    {/* Similar structure to engagement tab */}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Change tab to view different rankings
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
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
                    {/* Similar structure to engagement tab */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Change tab to view different rankings
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
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
                    {/* Similar structure to engagement tab */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Change tab to view different rankings
                      </TableCell>
                    </TableRow>
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
