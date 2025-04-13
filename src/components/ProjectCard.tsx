import React from 'react';
import { Link } from 'react-router-dom';
import SDGBadge from './SDGBadge';
import { Star, Github, ExternalLink } from 'lucide-react';

export interface ProjectData {
  project_id: number;
  title: string;
  description: string;
  team_name: string;
  category: string;
  sdgs: Array<{
    sdg_id: number;
    sdg_number: number;
    sdg_name: string;
  }>;
  status?: 'pending' | 'approved' | 'rejected';
  github_link?: string;
  media_link?: string;
  thumbnail_url?: string;
  created_at: string;
  average_rating: number;
  total_ratings: number;
}

interface ProjectCardProps {
  project: ProjectData;
  isRecommended?: boolean;
}

// SDG color mapping
const SDG_COLORS: { [key: number]: string } = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-teal-500',
  6: 'bg-blue-500',
  7: 'bg-indigo-500',
  8: 'bg-purple-500',
  9: 'bg-pink-500',
  10: 'bg-rose-500',
  11: 'bg-amber-500',
  12: 'bg-lime-500',
  13: 'bg-emerald-500',
  14: 'bg-cyan-500',
  15: 'bg-sky-500',
  16: 'bg-violet-500',
  17: 'bg-fuchsia-500',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isRecommended = false }) => {
  return (
    <Link to={`/project/${project.project_id}`} className="block">
      <div className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="relative h-48">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No thumbnail</span>
            </div>
          )}
          {/* SDG Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {project.sdgs.map((sdg) => (
              <div
                key={sdg.sdg_id}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white
                  ${SDG_COLORS[sdg.sdg_number] || 'bg-primary'}`}
                title={`SDG ${sdg.sdg_number}: ${sdg.sdg_name}`}
              >
                {sdg.sdg_number}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">{project.team_name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{project.average_rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({project.total_ratings})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{project.category}</span>
            <div className="flex gap-2">
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.media_link && (
                <a
                  href={project.media_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
