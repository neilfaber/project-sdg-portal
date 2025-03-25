
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GithubIcon, MenuIcon, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full">
        <div className="glass-nav py-4">
          <div className="container flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GithubIcon className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl">LearnHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation Toggle */}
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-nav animate-slide-down">
            <nav className="container py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 page-transition">
        {children}
      </main>

      <footer className="bg-secondary py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SDG Coding Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
