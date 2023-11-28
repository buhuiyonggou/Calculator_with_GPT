import React, { useState, useEffect } from 'react';
import './Chat.css';

interface ChatProps {
  userName: string;
  documentName: string;  // Used to identify the chat room
  baseURL: string;
}

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ userName, documentName, baseURL }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Fetch messages from the server
  const fetchMessages = async (newPage: number) => {
    try {
      const response = await fetch(`${baseURL}/chat/${documentName}?page=${newPage}&pageSize=20`);
      if (response.ok) {
        const fetchedMessages = await response.json();
        if (newPage === 0) {
          setMessages(fetchedMessages.reverse());
        } else {
          // Insert new messages at the beginning of the current message list, keeping them in reverse order (i.e., newest at the top)
          setMessages(prevMessages => [...[...fetchedMessages].reverse(), ...prevMessages]);
        }
        return fetchedMessages;
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    return []; // Return an empty array in case of an error
  };

  // Polling for new messages
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isFetchingMore) {
      intervalId = setInterval(() => {
        fetchMessages(0);
      }, 2000); // Adjust polling interval
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [documentName, isFetchingMore]);

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
        setPage(0);
        fetchMessages(0);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Load more messages
  const loadMoreMessages = async () => {
    if (hasMore) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      const currentMessages = await fetchMessages(nextPage);
      if (currentMessages.length < 20) {
        setHasMore(false);
        // Set a delay to restore the original text
        setTimeout(() => {
          setHasMore(true); // Restore hasMore state so the button can be clicked again
        }, 1000); // Restore after 2 seconds
      }
      setPage(nextPage);
    }
  };

  // Exit load more messages mode and resume polling
  const exitLoadMoreMode = () => {
    setIsFetchingMore(false);
    // No need to change hasMore or page as user may click "Load More" again
    setPage(0);
  };

  const exitChatWindows = () => {
    document.getElementById("chatwindow")!.style.display = "none";
  };
    

  return (
    <div className="chat-container" id="chatwindow">
      <div className="chat-bar">
        <button onClick={exitChatWindows}>X</button>
        ChatRoom
        </div>
      <button onClick={loadMoreMessages} disabled={!hasMore}>
        {hasMore ? 'Load More Messages' : 'No More Messages'}
      </button>
      {isFetchingMore && (
        <button onClick={exitLoadMoreMode}>
          Exit Load More Mode
        </button>
      )}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          msg.user === userName ?
          <div className="my-messages">
            <div className="user-avatar">{msg.user[0]}</div>
            <div className="my-message-bubble">
              {msg.message}
            </div>
          </div>
          : <div className="other-messages">
            <div className="user-avatar">{msg.user[0]}</div>
            <div className="other-message-bubble">
              {msg.message}
            </div>
          </div>
          // <div key={index} className={msg.user === userName ? 'my-message' : 'other-message'}>
          //   <strong>{msg.user}:</strong> {msg.message}
          // </div>
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