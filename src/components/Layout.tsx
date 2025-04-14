import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GithubIcon, LogIn, Menu, UserCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './ui/navigation-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Discover', path: '/discover' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ]
  },
  {
    title: 'Categories',
    links: [
      { name: 'Games', path: '/discover?category=Games' },
      { name: 'Web Applications', path: '/discover?category=Web Applications' },
      { name: 'Animations', path: '/discover?category=Animations' },
      { name: 'Videos', path: '/discover?category=Videos' },
      { name: 'Digital Art', path: '/discover?category=Digital Art' },
    ]
  },
  {
    title: 'SDG Goals',
    links: [
      { name: 'No Poverty', path: '/discover?sdg=1' },
      { name: 'Quality Education', path: '/discover?sdg=4' },
      { name: 'Climate Action', path: '/discover?sdg=13' },
      { name: 'View All Goals', path: '/sdg' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Tutorials', path: '/tutorials' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Support', path: '/support' },
    ]
  }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]); // Re-check when path changes

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
            <div className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <Link to="/">Home</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <Link to="/discover">Discover</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {['Games', 'Animations', 'Web Applications', 'Mobile Apps', 'Digital Art', 'Videos', 'Documentaries', 'Data Visualizations'].map((category) => (
                          <li key={category}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/discover?category=${category}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{category}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {getCategoryShortDescription(category)}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <Link to="/profile">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <UserCircle size={18} />
                      <span>Profile</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signin">
                      <Button variant="ghost" className="flex items-center gap-2">
                        <LogIn size={18} />
                        <span>Sign In</span>
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="flex items-center gap-2">
                        <span>Sign Up</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Navigation Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="md:hidden p-2 text-foreground"
                  aria-label="Toggle menu"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full py-4">
                  <div className="flex items-center mb-8">
                    <GithubIcon className="h-6 w-6 text-primary mr-2" />
                    <span className="font-semibold text-lg">LearnHub</span>
                  </div>
                  
                  <nav className="flex flex-col space-y-4 mb-auto">
                    <Link
                      to="/"
                      className={`font-medium transition-colors hover:text-primary ${
                        location.pathname === '/' ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/discover"
                      className={`font-medium transition-colors hover:text-primary ${
                        location.pathname === '/discover' ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      Discover
                    </Link>
                    
                    <div className="py-2">
                      <div className="font-medium mb-2">Categories</div>
                      <div className="pl-2 flex flex-col space-y-2">
                        {['Games', 'Animations', 'Web Applications', 'Digital Art', 'Videos'].map((category) => (
                          <Link
                            key={category}
                            to={`/discover?category=${category}`}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                  
                  <div className="pt-6 border-t">
                    {isLoggedIn ? (
                      <div className="flex flex-col gap-2">
                        <Link to="/profile" className="w-full">
                          <Button variant="default" className="w-full">
                            <UserCircle size={16} className="mr-2" />
                            My Profile
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/signin" className="w-full">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" className="w-full">
                          <Button className="w-full">
                            Create Account
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 page-transition">
        {children}
      </main>

      <footer className="bg-secondary py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 mt-8 border-t border-muted">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <GithubIcon className="h-6 w-6 text-primary" />
                <span className="font-semibold">LearnHub</span>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SDG Coding Hub. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-foreground">Terms of Service</a>
                <a href="#" className="hover:text-foreground">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function for category descriptions in Navigation
function getCategoryShortDescription(category: string): string {
  switch (category) {
    case 'Games':
      return 'Interactive educational games focused on sustainability';
    case 'Animations':
      return 'Animated content explaining environmental concepts';
    case 'Web Applications':
      return 'Web-based tools for sustainable development';
    case 'Mobile Apps':
      return 'Mobile applications promoting sustainability';
    case 'Digital Art':
      return 'Digital artwork with environmental themes';
    case 'Videos':
      return 'Educational videos about sustainability';
    case 'Documentaries':
      return 'In-depth explorations of environmental issues';
    case 'Data Visualizations':
      return 'Visual representations of environmental data';
    default:
      return 'Projects promoting sustainable development';
  }
}

export default Layout;
