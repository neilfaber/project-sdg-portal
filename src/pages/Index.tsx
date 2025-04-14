import React from 'react';
import { ArrowRight, BookOpen, Code, Globe, PlayCircle, PuzzleIcon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import Layout from '../components/Layout';
import { mockProjects } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

const testimonials = [
  {
    id: 1,
    name: "Soham",
    role: "Computer Science Student",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    quote: "LearnHub helped me showcase my Python game project and get feedback from peers. The SDG alignment made my work more meaningful."
  },
  {
    id: 2,
    name: "Chaitanya Jatan",
    role: "Digital Media Arts",
    avatar: "https://i.pravatar.cc/150?u=michael",
    quote: "As a creative coder, this platform gave me exposure to industry mentors who appreciated my project's focus on climate action."
  },
  {
    id: 3,
    name: "Neil Faber",
    role: "Data Science Major",
    avatar: "https://i.pravatar.cc/150?u=",
    quote: "The feedback I received on my data visualization project helped me refine it for a national competition where we won first place!"
  }
];

const projectsByCategory = {
  'Games': mockProjects.filter(p => p.category === 'Games').slice(0, 1),
  'Animations': mockProjects.filter(p => p.category === 'Games').slice(1, 2), // Using Games as placeholder for Animations
  'Web Applications': mockProjects.filter(p => p.category === 'Web Applications').slice(0, 1),
  'Videos': mockProjects.filter(p => p.category === 'Mobile Apps').slice(0, 1), // Using Mobile Apps as placeholder for Videos
  'Digital Art': mockProjects.filter(p => p.category === 'Digital Art').slice(0, 1),
};

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
              <Link to="/signup" className="btn-outline px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10">
                Join Our Community
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
              <Link to="/discover" className="text-primary hover:underline font-medium inline-flex items-center">
                View Projects <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            <div className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Applications</h3>
              <p className="text-muted-foreground mb-4">
                Web-based solutions that provide tools for sustainable development.
              </p>
              <Link to="/discover" className="text-primary hover:underline font-medium inline-flex items-center">
                View Projects <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            <div className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PuzzleIcon size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Art & Media</h3>
              <p className="text-muted-foreground mb-4">
                Creative expressions that visualize and communicate SDG concepts.
              </p>
              <Link to="/discover" className="text-primary hover:underline font-medium inline-flex items-center">
                View Projects <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore All Project Categories
          </h2>
          
          {Object.entries(projectsByCategory).map(([category, projects], index) => (
            <div key={category} className={`mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  {projects.length > 0 && (
                    <div className="animate-fade-in">
                      <ProjectCard project={projects[0]} />
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{category}</h3>
                  <p className="text-muted-foreground mb-6">
                    {getCategoryDescription(category)}
                  </p>
                  <Link to="/discover" className="btn-primary px-4 py-2 rounded-lg inline-flex items-center">
                    Explore {category} <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-muted/30">
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
      
      {/* Testimonials Section */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Community Says
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-6 rounded-xl relative">
                <div className="absolute -top-4 -left-4 text-primary">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 22.5H7.5C6.83696 22.5 6.20107 22.2366 5.73223 21.7678C5.26339 21.2989 5 20.663 5 20V15C5 14.337 5.26339 13.7011 5.73223 13.2322C6.20107 12.7634 6.83696 12.5 7.5 12.5H10C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10V7.5C12.5 6.83696 12.2366 6.20107 11.7678 5.73223C11.2989 5.26339 10.663 5 10 5H7.5M27.5 22.5H22.5C21.837 22.5 21.2011 22.2366 20.7322 21.7678C20.2634 21.2989 20 20.663 20 20V15C20 14.337 20.2634 13.7011 20.7322 13.2322C21.2011 12.7634 21.837 12.5 22.5 12.5H25C25.663 12.5 26.2989 12.2366 26.7678 11.7678C27.2366 11.2989 27.5 10.663 27.5 10V7.5C27.5 6.83696 27.2366 6.20107 26.7678 5.73223C26.2989 5.26339 25.663 5 25 5H22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="pt-6">
                  <p className="italic mb-6">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Making an Impact Together
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-card p-6 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">350+</div>
              <div className="text-lg font-medium mb-1">Student Projects</div>
              <p className="text-sm text-muted-foreground">Creative coding solutions developed by students</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">17</div>
              <div className="text-lg font-medium mb-1">SDG Goals</div>
              <p className="text-sm text-muted-foreground">All Sustainable Development Goals addressed</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-lg font-medium mb-1">Partner Institutions</div>
              <p className="text-sm text-muted-foreground">Schools and universities participating</p>
            </div>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button variant="secondary" size="lg">
                Browse All Projects
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Helper function for category descriptions
function getCategoryDescription(category: string): string {
  switch (category) {
    case 'Games':
      return 'Interactive games that educate and raise awareness about sustainable development goals.';
    case 'Animations':
      return 'Creative animations that visualize and explain sustainability concepts.';
    case 'Web Applications':
      return 'Web-based solutions that help track, measure, and promote sustainable practices.';
    case 'Videos':
      return 'Educational and promotional videos highlighting sustainability initiatives.';
    case 'Digital Art':
      return 'Digital artwork that inspires and communicates sustainable development messages.';
    default:
      return 'Explore creative projects that contribute to sustainable development goals.';
  }
}

export default Index;
