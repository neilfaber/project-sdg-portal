import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { GithubIcon, UserPlus } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: '',
    email: '',
    password: '',
    password2: '',
    username: '',
    role: '',
    agreeTerms: false
  });

  // Function to generate username from full name
  const generateUsername = (fullName: string): string => {
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special characters and spaces
      .slice(0, 30); // Limit username length
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Generate username from full name if full_name field is being updated
      ...(name === 'full_name' && { username: generateUsername(value) })
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: "Role required",
        description: "Please select your role to continue",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.password2) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to create an account",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Send signup request to backend
      const response = await axios.post(`${API_BASE_URL}/users/signup/`, {
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        full_name: formData.full_name,
        username: formData.username,
        role: formData.role
      });

      if (response.data) {
        // Store the tokens in localStorage
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      
        toast({
          title: "Account created",
          description: "Welcome to LearnHub! Your account has been created successfully."
        });
      
        // Redirect based on role
        if (formData.role === 'faculty') {
          navigate('/teachers'); // Redirect to Teachers page
        } else if (formData.role === 'management') {
          navigate('/management'); // Redirect to Management page
        } else {
          navigate('/profile'); // Default redirect
        }
      }
      }
      catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.password?.[0] ||
                         error.response?.data?.email?.[0] ||
                         "An error occurred during signup. Please try again.";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.full_name}
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
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Teacher</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose how you want to participate in the platform
              </p>
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

            <div className="space-y-2">
              <label htmlFor="password2" className="text-sm font-medium">Confirm Password</label>
              <Input
                id="password2"
                name="password2"
                type="password"
                placeholder="Confirm your password"
                required
                value={formData.password2}
                onChange={handleChange}
              />
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
