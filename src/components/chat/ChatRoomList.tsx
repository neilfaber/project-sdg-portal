import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Badge, Button, Box, CircularProgress, Paper } from '@mui/material';
import { Chat as ChatIcon, Add as AddIcon } from '@mui/icons-material';
import chatAPI, { ChatRoom } from '../../services/ChatAPI';

interface ChatRoomListProps {
  onRoomSelect: (roomId: number) => void;
  teamId?: number;
  createNewRoom?: () => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  onRoomSelect,
  teamId,
  createNewRoom
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load chat rooms
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let rooms: ChatRoom[];
        if (teamId) {
          // If teamId is provided, get rooms for this team
          rooms = await chatAPI.getChatRoomsForTeam(teamId);
        } else {
          // Otherwise get all rooms for the current user
          rooms = await chatAPI.getChatRooms();
        }
        
        setChatRooms(rooms);
      } catch (err) {
        console.error('Error fetching chat rooms:', err);
        setError('Failed to load chat rooms. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatRooms();
    
    // Refresh chat rooms every 30 seconds
    const intervalId = setInterval(fetchChatRooms, 30000);
    
    return () => clearInterval(intervalId);
  }, [teamId]);
  
  // Format the timestamp of the latest message
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within a week, show day of week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date > oneWeekAgo) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Paper sx={{ width: '100%', maxHeight: '400px', overflow: 'auto' }}>
      <List sx={{ width: '100%' }}>
        {chatRooms.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              No chat rooms available
            </Typography>
            {createNewRoom && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={createNewRoom}
              >
                Create Chat Room
              </Button>
            )}
          </Box>
        ) : (
          <>
            {chatRooms.map((room) => (
              <ListItem 
                key={room.room_id}
                alignItems="flex-start"
                divider
                button
                onClick={() => onRoomSelect(room.room_id)}
              >
                <ListItemAvatar>
                  <Badge 
                    color="error" 
                    badgeContent={room.unread_count} 
                    invisible={room.unread_count === 0}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ChatIcon />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      {room.name}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {room.team_name}
                      </Typography>
                      {room.latest_message && (
                        <>
                          {' — '}
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                              maxWidth: '150px', 
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              display: 'inline-block'
                            }}
                          >
                            {room.latest_message.content}
                          </Typography>
                        </>
                      )}
                    </React.Fragment>
                  }
                />
                {room.latest_message && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ pl: 1, minWidth: '50px', textAlign: 'right' }}
                  >
                    {formatTimestamp(room.latest_message.timestamp)}
                  </Typography>
                )}
              </ListItem>
            ))}
            {createNewRoom && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={createNewRoom}
                >
                  Create New Chat
                </Button>
              </Box>
            )}
          </>
        )}
      </List>
    </Paper>
  );
};

export default ChatRoomList; 