import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import axios from 'axios';
import chatAPI from '../../services/ChatAPI';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface Team {
  team_id: number;
  team_name: string;
}

interface CreateChatRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (roomId: number) => void;
}

const CreateChatRoomDialog: React.FC<CreateChatRoomDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | ''>('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load available teams for faculty
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsTeamsLoading(true);
        
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No authentication token found');
        }
        
        // This URL must match exactly what's in Django's urls.py
        const response = await axios.get(`${API_BASE_URL}/teams/assigned/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        console.log('Teams response:', response.data);
        
        // Handle the response data format - might need adjusting based on actual API response
        let teamsData = response.data;
        if (Array.isArray(response.data.results)) {
          teamsData = response.data.results;
        } else if (Array.isArray(response.data.teams)) {
          teamsData = response.data.teams;
        }
        
        // Normalize team objects to ensure they have team_id and team_name properties
        const normalizedTeams = teamsData.map(team => {
          return {
            team_id: team.team_id || team.id,
            team_name: team.team_name || team.name
          };
        });
        
        setTeams(normalizedTeams);
      } catch (err: any) {
        console.error('Error fetching teams:', err);
        if (err.response && err.response.data && err.response.data.error) {
          // Display the API's error message if available
          setError(err.response.data.error);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Could not load teams. Please try again later.');
        }
      } finally {
        setIsTeamsLoading(false);
      }
    };
    
    if (open) {
      fetchTeams();
    }
  }, [open]);
  
  const handleCreate = async () => {
    if (!name.trim() || !selectedTeam) {
      setError('Please provide a room name and select a team');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new chat room
      const response = await chatAPI.createChatRoom({
        team: selectedTeam as number,
        name: name.trim()
      });
      
      onSuccess(response.room_id);
      handleClose();
    } catch (err: any) {
      console.error('Error creating chat room:', err);
      if (err.response && err.response.data && err.response.data.error) {
        // Display the API's error message if available
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create chat room. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state
    setName('');
    setSelectedTeam('');
    setError(null);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Chat Room</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ my: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Chat Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="e.g., Team Alpha Discussion"
            required
            disabled={isLoading}
          />
          
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            required
            disabled={isTeamsLoading || isLoading}
          >
            <InputLabel>Select Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e: SelectChangeEvent<number | string>) => 
                setSelectedTeam(e.target.value as number)}
              label="Select Team"
            >
              {isTeamsLoading ? (
                <MenuItem value="" disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading teams...
                </MenuItem>
              ) : teams.length === 0 ? (
                <MenuItem value="" disabled>
                  No teams available
                </MenuItem>
              ) : (
                teams.map((team) => (
                  <MenuItem key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>
              {teams.length === 0 && !isTeamsLoading ? 
                "You don't have any assigned teams. Ask an administrator to assign teams to you." :
                "Select the student team for this chat room"}
            </FormHelperText>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will create a chat room where you can communicate with all members of the selected team.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreate} 
          color="primary" 
          variant="contained"
          disabled={!name.trim() || !selectedTeam || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Create Chat Room'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChatRoomDialog; 