
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SDGBadge from '../components/SDGBadge';
import ContactModal from '../components/ContactModal';
import { ArrowLeft, Calendar, MessageSquare, Share2, User } from 'lucide-react';
import { mockProjects } from '../data/mockData';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const project = mockProjects.find(p => p.id === id);

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
                <span>2023</span>
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                {project.category}
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-end md:self-start">
            <button 
              className="btn-secondary px-4 py-2 rounded-lg"
              onClick={() => {
                // Simple copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
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

            <div className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Project Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Interactive elements that engage users</li>
                <li>Educational content about SDG goals</li>
                <li>Creative coding techniques using Python</li>
                <li>User-friendly interface and experience</li>
                <li>Data visualization of relevant statistics</li>
              </ul>
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
