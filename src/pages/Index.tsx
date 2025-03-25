
import React from 'react';
import { ArrowRight, Code, PlayCircle, PuzzleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import Layout from '../components/Layout';
import { mockProjects } from '../data/mockData';

const Index = () => {
  const featuredProjects = mockProjects.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 z-0"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Creative Coding × Sustainable Development
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Showcasing Student Innovations for a Better World
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore projects created by students that tackle real-world problems aligned with the Sustainable Development Goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/discover" className="btn-primary px-6 py-3 rounded-lg">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Creative Projects Across Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: "0ms" }}>
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Games & Animations</h3>
              <p className="text-muted-foreground mb-4">
                Interactive experiences that educate and engage on sustainability issues.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Applications</h3>
              <p className="text-muted-foreground mb-4">
                Web-based solutions that provide tools for sustainable development.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PuzzleIcon size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Art & Media</h3>
              <p className="text-muted-foreground mb-4">
                Creative expressions that visualize and communicate SDG concepts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link to="/discover" className="flex items-center text-primary font-medium hover:underline">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div key={project.id} className="animate-fade-in">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore Creative Solutions?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Dive into our collection of student projects that demonstrate how creative coding can address sustainable development challenges.
          </p>
          <Link to="/discover" className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors">
            Browse All Projects
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
