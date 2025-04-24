import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Paper, Typography, Avatar, CircularProgress, Box, IconButton } from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import chatService from '../../services/ChatService';
import chatAPI, { ChatMessage, ChatRoom } from '../../services/ChatAPI';

interface ChatInterfaceProps {
  roomId: number;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  roomId,
  onClose,
  showCloseButton = true
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [roomDetails, setRoomDetails] = useState<ChatRoom | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load initial messages and connect to WebSocket
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        // Load room details from first message or from API
        const messagesResponse = await chatAPI.getChatMessages(roomId);
        setMessages(messagesResponse);
        
        // Connect to WebSocket
        await chatService.connectToRoom(roomId.toString());
        
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Setup connection listener
    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
    };
    
    // Setup message listener
    const messageListener = (data: any) => {
      // Add incoming message to state
      setMessages(prevMessages => [...prevMessages, {
        message_id: data.message_id,
        room: roomId,
        sender: data.sender_id,
        sender_name: data.sender_name,
        sender_role: data.sender_role,
        sender_id: data.sender_id,
        content: data.message,
        timestamp: data.timestamp,
        is_read: false
      }]);
    };
    
    chatService.onConnectionChange(connectionListener);
    chatService.onMessage(messageListener);
    
    // Cleanup on unmount
    return () => {
      chatService.removeConnectionListener(connectionListener);
      chatService.removeMessageListener(messageListener);
      chatService.disconnect();
    };
  }, [roomId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;
    
    try {
      // Send via WebSocket
      chatService.sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to REST API if WebSocket fails
      try {
        const sentMessage = await chatAPI.sendMessage(roomId, newMessage);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      } catch (fallbackError) {
        console.error('Fallback send also failed:', fallbackError);
      }
    }
  };
  
  // Handle pressing Enter to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        maxHeight: '600px',
        minHeight: '400px',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {/* Chat Header */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">
          {roomDetails?.name || `Chat Room #${roomId}`}
          {!isConnected && ' (Reconnecting...)'}
        </Typography>
        {showCloseButton && (
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: 'background.default'
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">No messages yet. Start the conversation!</Typography>
          </Box>
        ) : (
          messages.map((message) => {
            // Get current user ID from localStorage
            const user = localStorage.getItem('user');
            const userId = user ? JSON.parse(user).id : null;
            const isCurrentUser = message.sender === userId;
            
            return (
              <Box 
                key={message.message_id}
                sx={{ 
                  display: 'flex',
                  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1.5
                }}
              >
                <Avatar 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender_name}`}
                  sx={{ width: 36, height: 36 }}
                />
                <Box 
                  sx={{ 
                    bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                    color: isCurrentUser ? 'white' : 'text.primary',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {message.sender_name}
                    <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">{message.content}</Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField 
            fullWidth
            placeholder="Type a message..."
            multiline
            maxRows={4}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isConnected || isLoading}
            sx={{ bgcolor: 'background.paper' }}
          />
          <Button 
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || isLoading}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface; 