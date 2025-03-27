
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GithubIcon, LogIn } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication - would be replaced with actual auth
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        name: 'Demo User',
        email: formData.email,
        avatar: 'https://i.pravatar.cc/150?u=user-123',
        preferences: ['Web Applications', 'Games']
      }));
      
      setIsLoading(false);
      toast({
        title: "Signed in successfully",
        description: "Welcome back to LearnHub!"
      });
      navigate('/profile');
    }, 1500);
  };

  return (
    <Layout>
      <div className="page-container py-16 max-w-md mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue to LearnHub</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </span>
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">or continue with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <GithubIcon className="mr-2 h-4 w-4" /> GitHub
          </Button>
          
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
