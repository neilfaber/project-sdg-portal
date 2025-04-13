import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, ExternalLink, Github, Clock, Calendar, Users } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useProject } from '../hooks/use-project';
import { useToast } from "../components/ui/use-toast";

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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading, error } = useProject(id || '');
  const { toast } = useToast();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Function to get styling based on project approval status
  const getStatusStyle = () => {
    if (!project) return {};
    
    switch(project.status) {
      case 'approved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          message: 'This project has been approved by administrators.'
        };
      case 'rejected':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          message: 'This project has been rejected by administrators.'
        };
      case 'pending':
      default:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          message: 'This project is pending administrator approval.'
        };
    }
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

  if (error || !project) {
    return (
      <Layout>
        <div className="page-container py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "The project you're looking for doesn't exist."}</p>
            <Link to="/discover">
              <Button>Browse Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Get status styling
  const statusStyle = getStatusStyle();

  return (
    <Layout>
      <div className="page-container py-8">
        {/* Back button */}
        <Link to="/discover" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Discover
        </Link>
        
        {/* Project Status Banner (if pending or rejected) */}
        {project.status && project.status !== 'approved' && (
          <div className={`mb-6 p-4 rounded-lg ${statusStyle.bgColor} ${statusStyle.textColor} border ${statusStyle.borderColor}`}>
            <p>{statusStyle.message}</p>
          </div>
        )}
        
        {/* Project Title and Category */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary">{project.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          
          {/* SDG Goals */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.sdgs.map((sdg) => (
              <div
                key={sdg.sdg_id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${SDG_COLORS[sdg.sdg_number]}`}
                title={`SDG ${sdg.sdg_number}: ${sdg.sdg_name}`}
              >
                {sdg.sdg_number}
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Image */}
        {project.thumbnail_url && (
          <div className="mb-8 cursor-pointer" onClick={() => setIsImageExpanded(!isImageExpanded)}>
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className={`rounded-lg shadow-md w-full object-cover transition-all ${isImageExpanded ? 'h-auto' : 'max-h-80'}`}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Description and Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Project Description</h2>
              <div className="prose max-w-none">
                <p>{project.description}</p>
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* GitHub Link */}
            {project.github_link && (
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Github size={20} className="mr-2" /> GitHub Repository
                </h2>
                <a 
                  href={project.github_link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  {project.github_link} <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
            
            {/* External Link */}
            {project.github_link && (
              <div className="flex justify-center mt-8">
                <a 
                  href={project.github_link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <Github size={16} />
                    View on GitHub
                  </Button>
                </a>
              </div>
            )}
            
            {/* Demo Link */}
            {project.media_link && (
              <div className="flex justify-center mt-4">
                <a 
                  href={project.media_link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button variant="default" size="lg" className="gap-2">
                    <ExternalLink size={16} />
                    View Live Demo
                  </Button>
                </a>
              </div>
            )}
          </div>
          
          {/* Sidebar - Team and Stats */}
          <div className="space-y-6">
            {/* Team Information */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users size={20} className="mr-2" /> Team Information
              </h2>
              <p className="font-medium text-lg">{project.team_name}</p>
            </div>
            
            {/* Project Metadata */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Project Metadata</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{project.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1" /> 
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge variant={
                    project.status === 'approved' ? 'default' : 
                    project.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {project.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <p className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {project.average_rating.toFixed(1)} ({project.total_ratings} ratings)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
