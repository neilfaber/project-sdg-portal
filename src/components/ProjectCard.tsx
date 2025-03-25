
import React from 'react';
import { Link } from 'react-router-dom';
import SDGBadge from './SDGBadge';

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
}

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link 
      to={`/project/${project.id}`} 
      className="group block"
    >
      <div className="glass-card rounded-xl overflow-hidden hover-scale">
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
          <div className="text-xs font-medium text-primary uppercase mb-1">
            {project.category}
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {project.description}
          </p>
          <div className="text-xs text-muted-foreground">
            By <span className="font-medium">{project.team.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
