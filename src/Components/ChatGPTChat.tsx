import React, { useState, useEffect } from 'react';
import './ChatGPTChat.css';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_API_KEY;

interface ChatGPTChatProps {
  userName: string;
  documentName: string;
  baseURL: string;
}

interface ChatGPTMessage {
  role: string;
  content: string;
}

const ChatGPTChat: React.FC<ChatGPTChatProps> = ({ userName, documentName, baseURL }) => {
  const [messages, setMessages] = useState<ChatGPTMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);

  useEffect(() => {
    console.log("Component mounted or documentName changed, fetching messages");
    fetchMessagesFromBackend();
  }, [documentName]);

  const fetchMessagesFromBackend = async () => {
    try {
      const response = await fetch(`${baseURL}/chatgpt/${documentName}`);
      if (response.ok) {
        const fetchedMessages = await response.json();
        console.log("Fetched messages from backend:", fetchedMessages);
        setMessages(fetchedMessages);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessagesToBackend = async (message: ChatGPTMessage) => {
    console.log("Sending message to backend:", message);
    try {
      await fetch(`${baseURL}/chatgpt/${documentName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([message]), // 将单个消息作为数组发送
      });
    } catch (error) {
      console.error('Error sending message to backend:', error);
    }
};


  const sendMessageToChatGPT = async (message: string) => {
    console.log("Sending message to GPT:", message);
    setIsWaitingForReply(true);
    const userMessage = { role: "user", content: message };

    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4-1106-preview",
          temperature: 0.8,
          max_tokens: 2000,
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        console.error("API response not OK:", await response.text());
        setIsWaitingForReply(false);
        return;
      }

      const data = await response.json();
      console.log("Received response from GPT:", data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected API response format:", data);
        setIsWaitingForReply(false);
        return;
      }

      const chatGPTMessage = { role: "system", content: data.choices[0].message.content };
      setMessages([...messages, userMessage, chatGPTMessage]);

      // 分别发送用户消息和GPT的回复
      await sendMessagesToBackend(userMessage);
      await sendMessagesToBackend(chatGPTMessage);
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

  const exitChatGPTWindows = () => {
    document.getElementById("chatgptwindow")!.style.display = "none";
  };

  return (
    <div className="chatgpt-container" id="chatgptwindow">
      <div className="chatgpt-bar">
        <button onClick={exitChatGPTWindows}>X</button>
        Ask ChatGPT
      </div>
      <div className="chatgpt-messages">
      {messages.map((msg, index) => (
          msg.role === "user" ?
          <div className="chatgpt-my-messages">
            <div className="chatgpt-user-avatar">
            </div>
            <div className="chatgpt-my-message-bubble">
              {msg.content}
            </div>
          </div>
          : 
          <div className="chatgpt-other-messages">
            <div className="chatgpt-gpt-avatar"></div>
            <div className="chatgpt-other-message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="chatgpt-input">
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
