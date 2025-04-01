
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockProjects } from '../data/mockData';
import SDGBadge from '../components/SDGBadge';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Github, Heart, MessageCircle, Share, Star, ExternalLink } from 'lucide-react';
import useProject from '../hooks/use-project';
import { useToast } from '../components/ui/use-toast';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading, error } = useProject(id || '0');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [heartCount, setHeartCount] = useState(Math.floor(Math.random() * 100));
  const [hasLiked, setHasLiked] = useState(false);

  const [comments, setComments] = useState([
    { id: 1, author: 'Maria Garcia', avatar: '', text: 'This is a fantastic project! I especially like how you addressed SDG 4.', date: '2 days ago' },
    { id: 2, author: 'David Kim', avatar: '', text: 'Great work! The visualizations are very informative.', date: '1 week ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setHeartCount(prev => prev - 1);
    } else {
      setHeartCount(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
    
    if (!hasLiked) {
      toast({
        title: "Project liked!",
        description: "This project has been added to your favorites.",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Project link has been copied to clipboard.",
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: 'You',
          avatar: '',
          text: newComment,
          date: 'Just now'
        }
      ]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been added to the project.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="page-container py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !project) {
    return (
      <Layout>
        <div className="page-container py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            Sorry, the project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/discover">
            <Button>Back to Discover</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Additional check for project approval status
  if (project.status === 'pending' || project.status === 'rejected') {
    return (
      <Layout>
        <div className="page-container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              {project.status === 'pending' ? 'Project Pending Approval' : 'Project Not Approved'}
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <p className="text-amber-800">
                {project.status === 'pending' 
                  ? 'This project is currently awaiting administrator approval. It will be publicly visible once approved.'
                  : 'This project was not approved by administrators and is not publicly visible.'}
              </p>
            </div>
            <Link to="/discover">
              <Button>Back to Discover</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                {project.category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                Year: {project.year || '2024'}
              </Badge>
              <div className="flex items-center gap-1 text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                ))}
                <span className="text-sm font-medium ml-1">4.0</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Submitted by <span className="font-medium">{project.team.name}</span>
              </span>
            </div>

            {/* Project SDGs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.sdgs.map((sdg) => (
                <SDGBadge key={sdg} sdgNumber={sdg} showText={true} />
              ))}
            </div>
          </div>
          
          {/* Project Image */}
          <div className="w-full aspect-video mb-8 bg-gray-100 rounded-xl overflow-hidden">
            <img 
              src={project.image || "https://images.unsplash.com/photo-1629654291663-b91ad427698f"} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex items-center gap-1 ${hasLiked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart size={16} fill={hasLiked ? "currentColor" : "none"} /> 
                {heartCount}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle size={16} /> {comments.length}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShare}>
                <Share size={16} /> Share
              </Button>
            </div>
            
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Github size={16} /> View on GitHub
                </Button>
              </a>
            )}
          </div>
          
          {/* Project Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="discussion">Discussion ({comments.length})</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Project Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
              
              {project.features && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {Array.isArray(project.features) ? (
                      project.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">{feature}</li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No features listed</li>
                    )}
                  </ul>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Project Links</h2>
                <div className="space-y-2">
                  {project.githubLink && (
                    <div className="flex items-center gap-2">
                      <Github size={18} />
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        GitHub Repository
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
                  {project.mediaLink && (
                    <div className="flex items-center gap-2">
                      <ExternalLink size={18} />
                      <a 
                        href={project.mediaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Live Demo
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Team Tab */}
            <TabsContent value="team">
              <div>
                <h2 className="text-xl font-semibold mb-4">About the Team</h2>
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-medium mb-2">{project.team.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    A talented team of students passionate about using technology to address sustainability challenges.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Team Members</h3>
                <div className="space-y-4">
                  {project.team.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member}</div>
                        <div className="text-sm text-muted-foreground">Team Member</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Discussion Tab */}
            <TabsContent value="discussion">
              <div>
                <h2 className="text-xl font-semibold mb-4">Discussion</h2>
                
                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="border rounded-lg overflow-hidden">
                    <textarea 
                      placeholder="Add a comment..."
                      className="w-full p-3 focus:outline-none resize-none min-h-24"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="bg-gray-50 px-3 py-2 text-right">
                      <Button type="submit" disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </form>
                
                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
