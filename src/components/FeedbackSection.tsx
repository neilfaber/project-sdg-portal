import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface FeedbackItem {
  feedback_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    username: string;
  };
}

interface FeedbackSectionProps {
  projectId: string | number;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ projectId }) => {
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHasRated, setUserHasRated] = useState(false);
  const [stats, setStats] = useState({ total_ratings: 0, average_rating: 0, total_comments: 0 });
  
  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch feedback for this project
    fetchFeedback();
  }, [projectId, isLoggedIn]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      // Fetch all feedback for this project
      const feedbackResponse = await axios.get(`${API_BASE_URL}/engagement/feedback/?project=${projectId}`);
      setFeedbackList(feedbackResponse.data);

      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/engagement/feedback/project_stats/?project=${projectId}`);
      setStats(statsResponse.data);

      // Check if logged-in user has already provided feedback
      if (isLoggedIn && user) {
        const userFeedback = feedbackResponse.data.find((item: FeedbackItem) => 
          item.user?.id === user.id
        );
        if (userFeedback) {
          setUserHasRated(true);
          // Optionally, pre-fill form with user's existing feedback
          setRating(userFeedback.rating);
          setComment(userFeedback.comment || '');
        } else {
          setUserHasRated(false);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rate this project",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `${API_BASE_URL}/engagement/feedback/`,
        {
          project: projectId,
          rating,
          comment: comment.trim() || null
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setRating(0);
      setComment('');
      setUserHasRated(true);
      
      // Refresh feedback list
      fetchFeedback();
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.error || "Failed to submit feedback";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render stars for rating input
  const renderRatingStars = (interactive: boolean = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && setRating(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`text-2xl ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            i <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'
          }`}
          disabled={!interactive || userHasRated || isSubmitting}
        >
          ★
        </button>
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  // Render stars for display (non-interactive)
  const renderDisplayStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="mt-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ratings & Reviews
          </CardTitle>
          <CardDescription>
            {stats.total_ratings > 0 
              ? `${stats.total_ratings} ratings with an average of ${stats.average_rating.toFixed(1)} stars`
              : 'No ratings yet. Be the first to rate this project!'}
          </CardDescription>
        </CardHeader>
        
        {isLoggedIn && !userHasRated && (
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  {renderRatingStars()}
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Your Comment (Optional)
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about this project..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={rating === 0 || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
        
        {userHasRated && (
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">You've already rated this project</p>
              <p className="text-xs text-muted-foreground">Thank you for your feedback!</p>
            </div>
          </CardContent>
        )}
        
        {!isLoggedIn && (
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Sign in to rate this project</p>
              <p className="text-xs text-muted-foreground">You need to be logged in to provide feedback.</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feedback list */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Comments ({feedbackList.filter(f => f.comment).length})</h3>
        
        {isLoading ? (
          <div className="animate-pulse text-center py-8">Loading comments...</div>
        ) : feedbackList.filter(f => f.comment).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackList
              .filter(feedback => feedback.comment)
              .map(feedback => (
                <Card key={feedback.feedback_id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User size={24} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                          <div className="font-medium">{feedback.user.full_name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {renderDisplayStars(feedback.rating)}
                            <span className="text-xs">•</span>
                            <span>{formatDate(feedback.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-sm">{feedback.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection; 