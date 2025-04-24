import React, { useState } from 'react';
import { Container, Grid, Typography, Paper, Button, Box, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatInterface from '../components/chat/ChatInterface';
import CreateChatRoomDialog from '../components/chat/CreateChatRoomDialog';

const ChatPage: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Get user role from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const isTeacher = user?.role === 'faculty';
  
  // Handle selecting a chat room
  const handleRoomSelect = (roomId: number) => {
    setSelectedRoomId(roomId);
  };
  
  // Handle creating a new chat room
  const handleCreateRoom = () => {
    setIsCreateDialogOpen(true);
  };
  
  // Handle successful room creation
  const handleRoomCreated = (roomId: number) => {
    setSelectedRoomId(roomId);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {/* Chat Room List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Chat Rooms</Typography>
              {isTeacher && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleCreateRoom}
                >
                  New Chat
                </Button>
              )}
            </Box>
            <ChatRoomList 
              onRoomSelect={handleRoomSelect} 
              createNewRoom={isTeacher ? handleCreateRoom : undefined}
            />
          </Paper>
        </Grid>
        
        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          {selectedRoomId ? (
            <ChatInterface 
              roomId={selectedRoomId} 
              onClose={() => setSelectedRoomId(null)}
            />
          ) : (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '400px'
              }}
            >
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Select a chat room
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                {isTeacher ? 
                  "Choose a team chat room from the list or create a new one to start messaging." :
                  "Select a chat room to start messaging with your teacher."}
              </Typography>
              {isTeacher && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateRoom}
                  sx={{ mt: 2 }}
                >
                  Create New Chat Room
                </Button>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Create Chat Room Dialog */}
      <CreateChatRoomDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleRoomCreated}
      />
    </Container>
  );
};

export default ChatPage; 