
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import SDGBadge from '../components/SDGBadge';
import { Filter, Plus, Search, SlidersHorizontal, Trophy } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { ProjectData } from '../components/ProjectCard';
import { Button } from '../components/ui/button';

const categories = [
  'All Categories',
  'Games',
  'Animations',
  'Web Applications',
  'Mobile Apps',
  'Digital Art',
  'Videos',
  'Documentaries',
  'Data Visualizations'
];

const years = ['All Years', '2022', '2023', '2024', '2025'];
const sdgNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>(mockProjects);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
    
    // Assign year to mock projects if not already there
    mockProjects.forEach(project => {
      if (!project.year) {
        project.year = ['2022', '2023', '2024', '2025'][Math.floor(Math.random() * 4)];
      }
    });
    
    // Check for user preferences for recommendations
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.preferences && user.preferences.length > 0) {
        // Move projects matching user preferences to the beginning
        const userPrefs = user.preferences;
        const sortedProjects = [...mockProjects].sort((a, b) => {
          const aMatchesPref = userPrefs.includes(a.category) ? 1 : 0;
          const bMatchesPref = userPrefs.includes(b.category) ? 1 : 0;
          return bMatchesPref - aMatchesPref;
        });
        
        setFilteredProjects(sortedProjects);
      }
    }
  }, []);

  const toggleSDG = (sdgNumber: number) => {
    setSelectedSDGs(prev => 
      prev.includes(sdgNumber) 
        ? prev.filter(s => s !== sdgNumber) 
        : [...prev, sdgNumber]
    );
  };

  useEffect(() => {
    let result = mockProjects;

    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm) ||
        project.team.name.toLowerCase().includes(lowerSearchTerm) ||
        project.team.members.some(member => member.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    // Apply year filter
    if (selectedYear !== 'All Years') {
      result = result.filter(project => project.year === selectedYear);
    }

    // Apply SDG filter
    if (selectedSDGs.length > 0) {
      result = result.filter(project => 
        selectedSDGs.some(sdg => project.sdgs.includes(sdg))
      );
    }

    setFilteredProjects(result);
  }, [searchTerm, selectedCategory, selectedYear, selectedSDGs]);

  // Check if there are any recommended projects based on user preferences
  const hasRecommendations = isLoggedIn && filteredProjects.length > 0;

  return (
    <Layout>
      <div className="page-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover Projects</h1>
            <p className="text-muted-foreground">
              Explore student coding projects aligned with Sustainable Development Goals.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/leaderboards">
              <Button variant="outline" className="flex items-center gap-2">
                <Trophy size={16} /> Leaderboards
              </Button>
            </Link>
            
            {isLoggedIn && (
              <Link to="/create-project">
                <Button>
                  <Plus size={16} className="mr-2" /> Add Project
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters (Mobile) */}
          <button
            className="md:hidden flex items-center gap-2 btn-secondary px-4 py-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={18} />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters (Desktop & Mobile when opened) */}
          <div className={`md:w-64 shrink-0 space-y-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Filter size={18} />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                    />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Filter size={18} />
                Year
              </h3>
              <div className="space-y-2">
                {years.map((year) => (
                  <div key={year} className="flex items-center">
                    <input
                      type="radio"
                      id={year}
                      name="year"
                      checked={selectedYear === year}
                      onChange={() => setSelectedYear(year)}
                      className="mr-2"
                    />
                    <label htmlFor={year} className="text-sm cursor-pointer">
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <h3 className="font-medium mb-3">SDG Goals</h3>
              <div className="flex flex-wrap gap-2">
                {sdgNumbers.map((sdg) => (
                  <button
                    key={sdg}
                    onClick={() => toggleSDG(sdg)}
                    className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                      selectedSDGs.includes(sdg) 
                        ? 'bg-primary text-white ring-2 ring-primary' 
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {sdg}
                  </button>
                ))}
              </div>
              {selectedSDGs.length > 0 && (
                <button
                  onClick={() => setSelectedSDGs([])}
                  className="text-sm text-primary mt-2 hover:underline"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search projects, teams, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </p>

            {/* Recommended Section */}
            {hasRecommendations && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="animate-fade-in">
                      <ProjectCard project={filteredProjects[0]} isRecommended={true} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.slice(hasRecommendations ? 1 : 0).map((project) => (
                  <div key={project.id} className="animate-fade-in">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
