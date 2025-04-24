import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface ChatRoom {
  room_id: number;
  team: number;
  team_name: string;
  faculty: number;
  faculty_name: string;
  name: string;
  created_at: string;
  latest_message?: {
    content: string;
    timestamp: string;
    sender_name: string;
  };
  unread_count: number;
  project?: number;
}

interface ChatMessage {
  message_id: number;
  room: number;
  sender: number;
  sender_name: string;
  sender_role: string;
  sender_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
}

class ChatAPI {
  /**
   * Get all chat rooms the current user has access to
   */
  async getChatRooms(): Promise<ChatRoom[]> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/rooms/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  }
  
  /**
   * Get chat rooms for a specific team
   * @param teamId The team ID
   */
  async getChatRoomsForTeam(teamId: number): Promise<ChatRoom[]> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/rooms/for_team/?team_id=${teamId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat rooms for team ${teamId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get chat messages for a specific room
   * @param roomId The chat room ID
   */
  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/rooms/${roomId}/messages/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for room ${roomId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new chat room
   * @param data The chat room data
   */
  async createChatRoom(data: {
    team: number;
    name: string;
    project?: number;
  }): Promise<ChatRoom> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/rooms/`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      // Log the detailed error
      console.error('Error creating chat room:', error);
      
      // Make sure the full error is propagated
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
      
      // Rethrow the error for the component to handle
      throw error;
    }
  }
  
  /**
   * Send a message via REST API (fallback if WebSocket fails)
   * @param roomId The chat room ID
   * @param content The message content
   */
  async sendMessage(roomId: number, content: string): Promise<ChatMessage> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/messages/`,
        { room: roomId, content },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error sending message to room ${roomId}:`, error);
      throw error;
    }
  }
}

// Export types
export type { ChatRoom, ChatMessage };

// Export singleton instance
export const chatAPI = new ChatAPI();
export default chatAPI; 