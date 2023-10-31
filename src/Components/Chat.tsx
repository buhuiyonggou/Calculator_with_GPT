import React, { useState, useEffect } from 'react';
import './Chat.css';

interface ChatProps {
  userName: string;
  documentName: string;  // Assuming you need this to identify the chat room
  baseURL: string;
}

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ userName, documentName, baseURL }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${baseURL}/chat/${documentName}`);
      if (response.ok) {
        const fetchedMessages = await response.json();
        setMessages(fetchedMessages);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [documentName]);  // Ensure effect runs again if documentName changes

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Avoid sending empty messages

    try {
      const response = await fetch(`${baseURL}/chat/${documentName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userName, message: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Fetch latest messages including the new one
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user === userName ? 'my-message' : 'other-message'}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
