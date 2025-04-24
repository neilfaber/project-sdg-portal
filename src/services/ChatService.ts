// ChatService.ts - WebSocket chat service

class ChatService {
  private socket: WebSocket | null = null;
  private messageListeners: ((message: any) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  
  constructor(private apiUrl: string = 'http://127.0.0.1:8000') {}
  
  /**
   * Connect to a chat room via WebSocket
   * @param roomId The ID of the chat room to connect to
   * @returns Promise resolving when connected
   */
  connectToRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Close any existing connection
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        reject(new Error('No authentication token found'));
        return;
      }
      
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${this.apiUrl.replace(/^https?:\/\//, '')}/ws/chat/${roomId}/?token=${accessToken}`;
      
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log(`Connected to chat room ${roomId}`);
        this.reconnectAttempts = 0;
        this.notifyConnectionListeners(true);
        resolve();
      };
      
      this.socket.onclose = (event) => {
        console.log(`Disconnected from chat room: ${event.code} ${event.reason}`);
        this.notifyConnectionListeners(false);
        
        // Don't attempt to reconnect on normal closure (1000) or if we're explicitly closing
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect(roomId);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        
        // We don't reject here because onclose will be called after an error
        // and we want to give the reconnection logic a chance to work
        console.log('WebSocket connection failed. Will attempt to reconnect...');
      };
      
      this.socket.onmessage = (event) => {
        try {
          console.log('Received message:', event.data);
          const data = JSON.parse(event.data);
          this.notifyMessageListeners(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    });
  }
  
  /**
   * Send a message to the current chat room
   * @param message The message content to send
   */
  sendMessage(message: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not connected');
      return;
    }
    
    const payload = JSON.stringify({ message });
    this.socket.send(payload);
  }
  
  /**
   * Disconnect from the current chat room
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  /**
   * Register a listener for incoming messages
   * @param listener Callback function for new messages
   */
  onMessage(listener: (message: any) => void): void {
    this.messageListeners.push(listener);
  }
  
  /**
   * Register a listener for connection status changes
   * @param listener Callback function for connection status
   */
  onConnectionChange(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener);
  }
  
  /**
   * Remove a message listener
   * @param listener The listener to remove
   */
  removeMessageListener(listener: (message: any) => void): void {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }
  
  /**
   * Remove a connection listener
   * @param listener The listener to remove
   */
  removeConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
  }
  
  /**
   * Notify all message listeners of a new message
   * @param message The message data
   */
  private notifyMessageListeners(message: any): void {
    this.messageListeners.forEach(listener => listener(message));
  }
  
  /**
   * Notify all connection listeners of a connection status change
   * @param connected Whether the WebSocket is connected
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => listener(connected));
  }
  
  /**
   * Attempt to reconnect to the WebSocket
   * @param roomId The room ID to reconnect to
   */
  private attemptReconnect(roomId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms`);
    
    this.reconnectAttempts++;
    this.reconnectTimeout = window.setTimeout(() => {
      console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connectToRoom(roomId).catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService; 