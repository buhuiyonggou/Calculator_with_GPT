import React, { useState } from 'react';
import './Chat.css';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_API_KEY;

interface ChatGPTChatProps {
  userName: string;
  documentName: string;
}

interface ChatGPTMessage {
  role: string;
  content: string;
}

const ChatGPTChat: React.FC<ChatGPTChatProps> = ({ userName, documentName }) => {
  const [messages, setMessages] = useState<ChatGPTMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);

  const sendMessageToChatGPT = async (message: string) => {
    setIsWaitingForReply(true);
    const userMessage = { role: "user", content: message };
    const requestBody = {
      model: "gpt-4-1106-preview",
      temperature: 0.8,
      max_tokens: 2000,
      messages: [...messages, userMessage]
    };

    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error("API response not OK:", await response.text());
        setIsWaitingForReply(false);
        return;
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected API response format:", data);
        setIsWaitingForReply(false);
        return;
      }

      const chatGPTMessage = data.choices[0].message.content;
      setMessages(prevMessages => [...prevMessages, userMessage, { role: "system", content: chatGPTMessage }]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    } finally {
      setIsWaitingForReply(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessageToChatGPT(newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? 'my-message' : 'other-message'}>
            <strong>{msg.role === "user" ? userName : 'ChatGPT'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask ChatGPT a question..."
          disabled={isWaitingForReply}
        />
        <button onClick={handleSendMessage} disabled={isWaitingForReply}>
          {isWaitingForReply ? 'Waiting...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatGPTChat;
