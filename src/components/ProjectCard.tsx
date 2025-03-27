
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SDGBadge from './SDGBadge';
import { Heart, MessageSquare } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sdgs: number[];
  team: {
    name: string;
    members: string[];
  };
  category: string;
  year?: string;
  likes?: number;
  comments?: number;
  gitHubUrl?: string;
}

interface ProjectCardProps {
  project: ProjectData;
  isRecommended?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isRecommended = false }) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || Math.floor(Math.random() * 50));
  const [commentCount, setCommentCount] = useState(project.comments || Math.floor(Math.random() * 20));
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
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
    }
    setLiked(!liked);
  };

  return (
    <Link 
      to={`/project/${project.id}`} 
      className="group block"
    >
      <div className="glass-card rounded-xl overflow-hidden hover-scale relative">
        {isRecommended && (
          <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium z-10">
            Recommended for you
          </div>
        )}
        
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
            {project.sdgs.slice(0, 3).map((sdg) => (
              <SDGBadge key={sdg} sdgNumber={sdg} size="sm" />
            ))}
            {project.sdgs.length > 3 && (
              <div className="bg-black/70 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium">
                +{project.sdgs.length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs font-medium text-primary uppercase">
              {project.category}
            </div>
            {project.year && (
              <div className="text-xs text-muted-foreground">
                {project.year}
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {project.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              By <span className="font-medium">{project.team.name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs"
              >
                <Heart size={14} className={liked ? "fill-red-500 text-red-500" : ""} />
                <span>{likeCount}</span>
              </button>
              
              <div className="flex items-center gap-1 text-xs">
                <MessageSquare size={14} />
                <span>{commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
