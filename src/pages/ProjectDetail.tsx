import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SDGBadge from '../components/SDGBadge';
import ContactModal from '../components/ContactModal';
import { ArrowLeft, Calendar, Github, Heart, MessageSquare, Send, Share2, User } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../components/ui/use-toast';

interface CommentType {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const project = mockProjects.find(p => p.id === id);
  
  useEffect(() => {
    if (project) {
      // Set random like count if not already set
      setLikeCount(project.likes || Math.floor(Math.random() * 100));
      
      // Generate some mock comments if not already present
      if (!comments.length) {
        const mockComments: CommentType[] = [
          {
            id: '1',
            userName: 'Alex Johnson',
            userAvatar: 'https://i.pravatar.cc/150?u=alex',
            text: 'This project is amazing! I love how you integrated the SDG goals with creative coding.',
            timestamp: '3 days ago'
          },
          {
            id: '2',
            userName: 'Emma Chen',
            userAvatar: 'https://i.pravatar.cc/150?u=emma',
            text: 'The visualization is very intuitive. Great work!',
            timestamp: '1 day ago'
          },
          {
            id: '3',
            userName: 'Mohammed Al-Farsi',
            userAvatar: 'https://i.pravatar.cc/150?u=mohammed',
            text: 'Would love to see more documentation about how you built this. Is the code available somewhere?',
            timestamp: '12 hours ago'
          }
        ];
        setComments(mockComments);
      }
    }
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, [project, comments.length]);

  if (!project) {
    return (
      <Layout>
        <div className="page-container text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/discover" className="btn-primary px-4 py-2">
            Browse All Projects
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleLike = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like projects",
        variant: "destructive"
      });
      return;
    }
    
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      toast({
        title: "Project liked",
        description: "This project has been added to your likes"
      });
    }
    setLiked(!liked);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on projects",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    const newCommentObj: CommentType = {
      id: `${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      text: newComment,
      timestamp: 'Just now'
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the project"
    });
  };

  return (
    <Layout>
      <div className="page-container py-8 animate-fade-in">
        {/* Back Button */}
        <Link 
          to="/discover" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.sdgs.map((sdg) => (
                <SDGBadge key={sdg} sdgNumber={sdg} showText />
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>By {project.team.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{project.year || '2023'}</span>
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                {project.category}
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-end md:self-start">
            <button 
              className={`btn-outline flex items-center gap-1 px-3 py-2 rounded-lg border ${liked ? 'text-red-500 border-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart size={18} className={liked ? 'fill-red-500' : ''} />
              {likeCount}
            </button>
            <button 
              className="btn-secondary px-4 py-2 rounded-lg"
              onClick={() => {
                // Simple copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description: "Project link copied to clipboard"
                });
              }}
            >
              <Share2 size={18} className="mr-2" />
              Share
            </button>
            <button 
              className="btn-primary px-4 py-2 rounded-lg"
              onClick={() => setIsContactModalOpen(true)}
            >
              <MessageSquare size={18} className="mr-2" />
              Contact Team
            </button>
          </div>
        </div>

        {/* Project Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this Project</h2>
              <div className="prose max-w-none">
                <p className="mb-4">
                  {project.description}
                </p>
                <p className="mb-4">
                  This project aims to address real-world problems related to the Sustainable Development Goals. 
                  It was developed by students using Python and other creative coding techniques.
                </p>
                <p>
                  The team utilized various programming concepts, design principles, and interactive elements to 
                  create an engaging experience that educates users about sustainable development challenges and solutions.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Project Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Interactive elements that engage users</li>
                <li>Educational content about SDG goals</li>
                <li>Creative coding techniques using Python</li>
                <li>User-friendly interface and experience</li>
                <li>Data visualization of relevant statistics</li>
              </ul>
            </div>
            
            {/* Comments Section */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <MessageSquare className="mr-2" />
                Comments ({comments.length})
              </h2>
              
              <form onSubmit={handleSubmitComment} className="mb-6 flex gap-2">
                <Input 
                  placeholder={isLoggedIn ? "Add a comment..." : "Sign in to comment"} 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!isLoggedIn}
                  className="flex-grow"
                />
                <Button type="submit" disabled={!isLoggedIn || !newComment.trim()}>
                  <Send size={16} />
                </Button>
              </form>
              
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{comment.userName}</div>
                        <div className="text-xs text-muted-foreground">{comment.timestamp}</div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card rounded-xl p-6 mb-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <ul className="space-y-3 mb-6">
                {project.team.members.map((member, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium">
                      {member.charAt(0)}
                    </div>
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
              
              {project.gitHubUrl ? (
                <a 
                  href={project.gitHubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full btn-outline flex items-center justify-center py-2 mb-4 rounded-lg"
                >
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </a>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">GitHub repository not available for this project</p>
              )}
              
              <button 
                className="w-full btn-primary py-2 rounded-lg"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        recipientName={project.team.name}
        projectTitle={project.title}
      />
    </Layout>
  );
};

export default ProjectDetail;
