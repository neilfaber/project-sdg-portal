import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImagePlus, Upload } from 'lucide-react';
import SDGBadge from '../components/SDGBadge';
import { useToast } from '../components/ui/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  teamMembers: z.array(z.string()),
  githubLink: z.string().optional().transform(val => val || ''),
  mediaLink: z.string().optional().transform(val => val || ''),
  sdgs: z.array(z.number()),
  agreeTerms: z.boolean()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

// Add this debug function
const debugFormState = (form: any) => {
  console.log('Form State Debug:');
  console.log('- Is Form Valid:', form.formState.isValid);
  console.log('- Form Errors:', form.formState.errors);
  console.log('- Form Values:', form.getValues());
  console.log('- Dirty Fields:', form.formState.dirtyFields);
  console.log('- Touched Fields:', form.formState.touchedFields);
};

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; email: string }>>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<Array<{ id: string; full_name: string; email: string }>>([]);

  // Fetch students on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found');
          toast({
            title: "Authentication Error",
            description: "Please sign in to create a project",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }

        const studentsUrl = `${API_BASE_URL}/users/students/`;
        console.log('Fetching students from:', studentsUrl);
        console.log('Using token:', token.substring(0, 10) + '...');
        
        const response = await axios.get(studentsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Full response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.status === 'success' && Array.isArray(response.data.users)) {
          console.log('Number of students loaded:', response.data.users.length);
          console.log('First student example:', response.data.users[0]);
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        } else {
          console.error('Unexpected response format:', response.data);
          toast({
            title: "Error",
            description: "Received unexpected data format from server",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        
        if (error.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue",
            variant: "destructive"
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/signin');
          return;
        }

        toast({
          title: "Error fetching students",
          description: error.response?.data?.message || "Could not load students. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchUsers();
  }, [navigate, toast]);

  // Update filteredUsers when search query or users change
  useEffect(() => {
    console.log('Search query:', searchQuery);
    console.log('All users:', users);
    
    const filtered = users.filter(user => {
      const matchesName = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEmail = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesName || matchesEmail;
    });
    
    console.log('Filtered users:', filtered);
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Initialize the form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      teamName: '',
      teamMembers: [],
      githubLink: '',
      mediaLink: '',
      sdgs: [],
      agreeTerms: false
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

  // Add this function to get selected user names
  const getSelectedUserNames = (selectedIds: string[]) => {
    return users
      .filter(user => selectedIds.includes(user.id))
      .map(user => user.full_name)
      .join(', ');
  };

  const onSubmit = async (data: ProjectFormValues) => {
    console.log('onSubmit function called');
    console.log('Form data received:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = {
      title: data.title,
      description: data.description,
      category: data.category,
      teamName: data.teamName,
      teamMembers: data.teamMembers,
      sdgs: data.sdgs,
      agreeTerms: data.agreeTerms
    };

    console.log('Checking required fields:', requiredFields);

    // Check each required field
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value;
      })
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (!data.agreeTerms) {
      console.log('Terms not accepted');
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    console.log('All validation passed, proceeding with submission');
    setUploading(true);
    
    try {
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

      // First, create a team
      console.log('Creating team with name:', data.teamName);
      const teamResponse = await axios.post(`${API_BASE_URL}/teams/`, {
        team_name: data.teamName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Team creation response:', JSON.stringify(teamResponse.data, null, 2));

      if (!teamResponse.data.team_id) {
        throw new Error('Team creation failed: No team ID received');
      }

      const teamId = teamResponse.data.team_id;
      console.log('Team created with ID:', teamId);

      // Add team members
      console.log('Adding team members:', data.teamMembers);
      try {
        const teamMemberPromises = data.teamMembers.map(async (userId) => {
          console.log(`Adding team member ${userId} to team ${teamId}`);
          const response = await axios.post(
            `${API_BASE_URL}/teams/${teamId}/add_member/`,
            {
              user_id: userId
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log(`Team member ${userId} added:`, response.data);
          return response;
        });

        const teamMemberResults = await Promise.all(teamMemberPromises);
        console.log('All team members added:', teamMemberResults.map(r => r.data));
      } catch (error: any) {
        console.error('Error adding team members:', error);
        if (error.response?.status === 405) {
          throw new Error('Invalid endpoint for adding team members. Please contact support.');
        }
        throw new Error(error.response?.data?.error || 'Failed to add team members');
      }

      // Create form data for project submission
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('team', teamId.toString());
      
      if (data.githubLink?.trim()) {
        formData.append('github_link', data.githubLink.trim());
      }
      if (data.mediaLink?.trim()) {
        formData.append('media_link', data.mediaLink.trim());
      }
      
      data.sdgs.forEach(sdg => {
        formData.append('sdgs', sdg.toString());
      });

      if (selectedImage) {
        try {
          const base64Response = await fetch(selectedImage);
          const blob = await base64Response.blob();
          formData.append('thumbnail', blob, 'thumbnail.jpg');
        } catch (error) {
          console.error('Error processing thumbnail:', error);
        }
      }

      // Log form data entries for debugging
      console.log('Submitting project with form data:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Submit the project
      const submitUrl = `${API_BASE_URL}/projects/projects/submit/`;
      console.log('Submitting to URL:', submitUrl);
      
      const projectResponse = await axios.post(
        submitUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Project submission response:', JSON.stringify(projectResponse.data, null, 2));

      toast({
        title: "Success!",
        description: "Your project has been submitted and is awaiting admin approval."
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      
      let errorMessage = "Failed to submit project. ";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage += error.response.data;
        } else if (error.response.data.detail) {
          errorMessage += error.response.data.detail;
        } else if (error.response.data.error) {
          errorMessage += error.response.data.error;
        } else if (typeof error.response.data === 'object') {
          const errors = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          errorMessage += errors;
        }
      } else {
        errorMessage += error.message || "Please try again.";
      }

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
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
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted');
                const values = form.getValues();
                console.log('Current form values:', values);
                
                // Validate required fields manually
                if (!values.title || values.title.length < 5) {
                  toast({ title: "Error", description: "Title must be at least 5 characters", variant: "destructive" });
                  return;
                }
                if (!values.description || values.description.length < 20) {
                  toast({ title: "Error", description: "Description must be at least 20 characters", variant: "destructive" });
                  return;
                }
                if (!values.category) {
                  toast({ title: "Error", description: "Please select a category", variant: "destructive" });
                  return;
                }
                if (!values.teamName || values.teamName.length < 3) {
                  toast({ title: "Error", description: "Team name must be at least 3 characters", variant: "destructive" });
                  return;
                }
                if (!values.teamMembers || values.teamMembers.length === 0) {
                  toast({ title: "Error", description: "Please select at least one team member", variant: "destructive" });
                  return;
                }
                if (!values.sdgs || values.sdgs.length === 0) {
                  toast({ title: "Error", description: "Please select at least one SDG goal", variant: "destructive" });
                  return;
                }
                if (!values.agreeTerms) {
                  toast({ title: "Error", description: "Please accept the terms and conditions", variant: "destructive" });
                  return;
                }

                // If all validation passes, call onSubmit
                onSubmit(values);
              }}
              className="space-y-8"
            >
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
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teamMembers"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Team Members</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              type="button"
                              aria-expanded={open}
                              className={cn(
                                "w-full justify-between",
                                !field.value?.length && "text-muted-foreground"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setOpen(!open);
                              }}
                            >
                              {field.value?.length > 0
                                ? getSelectedUserNames(field.value)
                                : "Select team members..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <div className="flex flex-col">
                            <div className="flex items-center border-b px-3 pb-2">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <input
                                placeholder="Search students..."
                                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                              {filteredUsers.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">
                                  No students found.
                                </div>
                              ) : (
                                filteredUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    className={cn(
                                      "flex items-center px-4 py-2 cursor-pointer hover:bg-accent",
                                      field.value?.includes(user.id) && "bg-accent"
                                    )}
                                    onClick={() => {
                                      const currentValue = Array.isArray(field.value) ? field.value : [];
                                      const newValue = currentValue.includes(user.id)
                                        ? currentValue.filter((id) => id !== user.id)
                                        : [...currentValue, user.id];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value?.includes(user.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div>
                                      <div className="font-medium">{user.full_name}</div>
                                      <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-sm text-muted-foreground mt-1">
                        {field.value?.length > 0 
                          ? `${field.value.length} team member${field.value.length === 1 ? '' : 's'} selected`
                          : "Select students to add to your team"}
                      </FormDescription>
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
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mediaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=example or other media URL" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Add a link to a video demo, presentation, or other media showcasing your project
                    </FormDescription>
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
                  </FormItem>
                )}
              />
              
              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By submitting this project, you agree to our terms of service and privacy policy.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className={cn(
                    "transition-all",
                    uploading && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={uploading}
                >
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
