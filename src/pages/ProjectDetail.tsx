
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, ExternalLink, Github, Clock, Calendar, Users } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SDGBadge from '../components/SDGBadge';
import useProject from '../hooks/use-project';
import { useToast } from "../components/ui/use-toast";

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
            {project.year && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar size={14} /> {project.year}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          
          {/* SDG Goals */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.sdgs.map((sdgNumber) => (
              <SDGBadge key={sdgNumber} sdgNumber={sdgNumber} showText={false} />
            ))}
          </div>
        </div>
        
        {/* Project Image */}
        {project.image && (
          <div className="mb-8 cursor-pointer" onClick={() => setIsImageExpanded(!isImageExpanded)}>
            <img 
              src={project.image} 
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
            
            {/* GitHub Link */}
            {project.githubLink && (
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Github size={20} className="mr-2" /> GitHub Repository
                </h2>
                <a 
                  href={project.githubLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  {project.githubLink} <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
            
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
            
            {/* External Link */}
            {project.githubLink && (
              <div className="flex justify-center mt-8">
                <a 
                  href={project.githubLink}
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
            {project.mediaLink && (
              <div className="flex justify-center mt-4">
                <a 
                  href={project.mediaLink}
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
              <p className="font-medium text-lg">{project.team.name}</p>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Team Members</h3>
                <ul className="space-y-1">
                  {project.team.members.map((member, i) => (
                    <li key={i} className="text-sm">{member}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Project Metadata */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Project Metadata</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{project.category}</p>
                </div>
                
                {project.year && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Year</h3>
                    <p>{project.year}</p>
                  </div>
                )}
                
                {project.createdAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
                    <p className="flex items-center">
                      <Clock size={14} className="mr-1" /> 
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge variant={
                    project.status === 'approved' ? 'default' : 
                    project.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {project.status || 'Approved'}
                  </Badge>
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
