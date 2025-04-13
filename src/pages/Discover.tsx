import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import SDGBadge from '../components/SDGBadge';
import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useProjects } from '../hooks/use-projects';

const years = ['All Years', '2022', '2023', '2024', '2025'];

const Discover = () => {
  const { toast } = useToast();
  const { projects, categories, sdgs, loading, error, fetchProjects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Apply filters and fetch projects
    const filters: any = {};
    if (selectedCategory !== 'All Categories') filters.category = selectedCategory;
    if (selectedYear !== 'All Years') filters.year = selectedYear;
    if (selectedSDGs.length > 0) filters.sdg = selectedSDGs[0];
    
    fetchProjects(filters);
  }, [selectedCategory, selectedYear, selectedSDGs]);

  const toggleSDG = (sdgNumber: number) => {
    setSelectedSDGs(prev => 
      prev.includes(sdgNumber) 
        ? prev.filter(s => s !== sdgNumber) 
        : [...prev, sdgNumber]
    );
  };

  useEffect(() => {
    // Apply search term filter locally
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm) ||
        project.team_name.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  if (loading) {
    return (
      <Layout>
        <div className="page-container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="page-container py-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

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
          <Link to="/create-project">
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Create Project
            </Button>
          </Link>
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
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === 'All Categories'}
                    onChange={() => setSelectedCategory('All Categories')}
                    className="mr-2"
                  />
                  <label htmlFor="all-categories" className="text-sm cursor-pointer">
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center">
                    <input
                      type="radio"
                      id={category.name}
                      name="category"
                      checked={selectedCategory === category.name}
                      onChange={() => setSelectedCategory(category.name)}
                      className="mr-2"
                    />
                    <label htmlFor={category.name} className="text-sm cursor-pointer">
                      {category.name} ({category.count})
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
                {sdgs.map((sdg) => (
                  <button
                    key={sdg.sdg_id}
                    onClick={() => toggleSDG(sdg.sdg_number)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${selectedSDGs.includes(sdg.sdg_number) 
                        ? 'bg-primary text-white' 
                        : 'bg-muted hover:bg-muted/80'}`}
                  >
                    {sdg.sdg_number}
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

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.project_id} className="animate-fade-in">
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
