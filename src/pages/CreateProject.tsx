import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImagePlus, Upload } from 'lucide-react';
import SDGBadge from '../components/SDGBadge';
import { useToast } from '../components/ui/use-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const sdgNumbers = Array.from({ length: 17 }, (_, i) => i + 1);
const categories = [
  'Games',
  'Animations',
  'Web Applications',
  'Mobile Apps',
  'Digital Art',
  'Videos',
  'Documentaries',
  'Data Visualizations'
];

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  teamMembers: z.string().min(3, 'Please add at least one team member'),
  githubLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  sdgs: z.array(z.number()).min(1, 'Please select at least one SDG goal')
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize the form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      teamName: '',
      teamMembers: '',
      githubLink: '',
      sdgs: []
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSDG = (sdgNumber: number) => {
    const currentSDGs = form.getValues('sdgs');
    if (currentSDGs.includes(sdgNumber)) {
      form.setValue('sdgs', currentSDGs.filter(s => s !== sdgNumber));
    } else {
      form.setValue('sdgs', [...currentSDGs, sdgNumber]);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setUploading(true);
    
    try {
      // Get the access token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to submit a project.",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }

      // First, create a team with the correct URL
      const teamResponse = await axios.post(`${API_BASE_URL}/teams/teams/`, {
        team_name: data.teamName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Team created:', teamResponse.data);
      const teamId = teamResponse.data.team_id;

      // Team members require user IDs, which is beyond scope for this demo
      // This would typically be handled by backend logic
      
      // Create form data for project submission
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('github_link', data.githubLink || '');
      formData.append('team', teamId.toString());
      
      // Fix SDG format - backend expects a simple array of numbers
      // Don't use JSON.stringify directly on form data
      for (const sdg of data.sdgs) {
        formData.append('sdgs', sdg.toString());
      }

      // Add the thumbnail if it exists
      if (selectedImage) {
        // Convert base64 to blob
        const base64Response = await fetch(selectedImage);
        const blob = await base64Response.blob();
        formData.append('thumbnail', blob, 'thumbnail.jpg');
      }

      // Log form data for debugging
      console.log('Form data keys:', [...formData.entries()].map(entry => `${entry[0]}: ${entry[1]}`));

      // Submit the project with the right endpoint
      const projectResponse = await axios.post(`${API_BASE_URL}/projects/projects/submit/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Project submitted successfully:', projectResponse.data);

      toast({
        title: "Success!",
        description: "Your project has been submitted and is awaiting admin approval."
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting project:', error);
      
      // Show detailed error information
      if (error.response) {
        console.error('Error response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        });
        
        // Format error message for toast
        let errorMessage = "Failed to submit project. Please try again.";
        
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (typeof error.response.data === 'object') {
            // Format object errors
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
          }
        }
        
        toast({
          title: `Error (${error.response.status})`,
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit project. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  
  return (
    <Layout>
      <div className="page-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create New Project</h1>
          <p className="text-muted-foreground">
            Share your creative coding project with the community and align it with SDG goals.
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> All new projects require admin approval before appearing on the discover page.
            </p>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Project Image */}
              <div>
                <FormLabel>Project Image</FormLabel>
                <div className="mt-2">
                  {selectedImage ? (
                    <div className="relative w-full aspect-video mb-4">
                      <img 
                        src={selectedImage} 
                        alt="Project preview" 
                        className="w-full h-full object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex justify-center items-center w-full aspect-video cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center text-center p-6">
                        <ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Drag and drop an image, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 1280x720px (16:9 ratio)
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project, its features, technologies used, and how it addresses the SDG goals..." 
                        className="h-32 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Team Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teamMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Members</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., john@example.com, jane@example.com" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Separate member emails with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repository" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* SDG Goals */}
              <FormField
                control={form.control}
                name="sdgs"
                render={() => (
                  <FormItem>
                    <FormLabel>SDG Goals</FormLabel>
                    <FormDescription className="text-xs mb-2">
                      Select the Sustainable Development Goals that your project addresses
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sdgNumbers.map((sdg) => {
                        const isSelected = form.watch('sdgs').includes(sdg);
                        return (
                          <button
                            key={sdg}
                            type="button"
                            onClick={() => toggleSDG(sdg)}
                            className={`transition-all duration-200 ${isSelected ? 'scale-110' : ''}`}
                          >
                            <SDGBadge 
                              sdgNumber={sdg} 
                              size={isSelected ? "md" : "sm"}
                              className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Terms and Conditions */}
              <div className="flex items-top space-x-2">
                <Checkbox id="terms" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                  <p className="text-xs text-muted-foreground">
                    By submitting this project, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
