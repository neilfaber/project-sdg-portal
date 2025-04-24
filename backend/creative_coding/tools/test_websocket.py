"""
Test script for WebSocket connections.
Usage: python tools/test_websocket.py

Make sure to obtain a valid JWT token first by logging in through the API:
curl -X POST http://127.0.0.1:8000/api/token/ -d "username=your_username&password=your_password"
"""

import asyncio
import websockets
import json
import sys
import os

# Add the project path to system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

async def connect_websocket():
    # Replace with your values
    room_id = "1"  # The room ID to connect to
    token = input("Enter your JWT token: ")
    
    uri = f"ws://127.0.0.1:8000/ws/chat/{room_id}/?token={token}"
    
    print(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            
            # Start a task to receive messages
            receive_task = asyncio.create_task(receive_messages(websocket))
            
            # Allow user to send messages
            await send_messages(websocket)
            
            # Cancel the receive task when we're done
            receive_task.cancel()
            
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed: {e.code} {e.reason}")
    except Exception as e:
        print(f"Error: {str(e)}")

async def receive_messages(websocket):
    try:
        while True:
            message = await websocket.recv()
            print(f"\nReceived: {message}")
            print("> ", end="", flush=True)
    except asyncio.CancelledError:
        # Task was cancelled
        pass
    except Exception as e:
        print(f"Error receiving messages: {str(e)}")

async def send_messages(websocket):
    try:
        while True:
            message = input("> ")
            if message.lower() in ["exit", "quit", "q"]:
                break
                
            # Send the message as JSON
            await websocket.send(json.dumps({"message": message}))
    except Exception as e:
        print(f"Error sending messages: {str(e)}")

if __name__ == "__main__":
    # Check if websockets is installed
    try:
        import websockets
    except ImportError:
        print("The 'websockets' package is required. Install it with:")
        print("pip install websockets")
        sys.exit(1)
        
    # Run the async function
    asyncio.run(connect_websocket()) 