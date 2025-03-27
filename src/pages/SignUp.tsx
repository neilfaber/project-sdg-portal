
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { GithubIcon, UserPlus } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeTerms: checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to create an account",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration - would be replaced with actual auth
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        avatar: 'https://i.pravatar.cc/150?u=' + formData.email,
        preferences: ['Web Applications', 'Games']
      }));
      
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "Welcome to LearnHub! Your account has been created successfully."
      });
      navigate('/profile');
    }, 1500);
  };

  return (
    <Layout>
      <div className="page-container py-16 max-w-md mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-muted-foreground">Join LearnHub to discover amazing student projects</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
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
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms and conditions
                </Link>
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
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
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
