import React, { useState, useEffect } from 'react';
import './Chat.css';

interface ChatProps {
  userName: string;
}

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ userName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = (): Message[] => {
    // Replace with real fetching code later
    return [
      { user: 'Alice', message: 'Hello!' },
      { user: 'Bob', message: 'Hi there!' },
      // ... other messages
    ];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchedMessages = fetchMessages();
      setMessages(fetchedMessages.slice(-20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    // Replace with real sending message code later
    setNewMessage(''); // Reset input after sending
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
