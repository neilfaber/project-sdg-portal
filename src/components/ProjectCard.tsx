import React from 'react';
import { Link } from 'react-router-dom';
import SDGBadge from './SDGBadge';

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  team: {
    name: string;
    members: string[];
  };
  category: string;
  sdgs: number[];
  status?: 'pending' | 'approved' | 'rejected';
  year?: string;
  rating?: number;
  views?: number;
  image?: string;
  githubLink?: string;
  mediaLink?: string;
  features?: string[];
  createdAt?: string;
}

interface ProjectCardProps {
  project: ProjectData;
  isRecommended?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isRecommended = false }) => {
  return (
    <div className="glass-card rounded-xl p-4 hover:scale-105 transition-transform">
      {isRecommended && (
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md z-10">
          Recommended
        </div>
      )}
      <Link to={`/project/${project.id}`}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-xl mb-3"
          />
        ) : (
          <div className="w-full aspect-video bg-secondary rounded-xl mb-3 flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.sdgs.map((sdgNumber) => (
            <SDGBadge key={sdgNumber} sdgNumber={sdgNumber} size="sm" />
          ))}
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
