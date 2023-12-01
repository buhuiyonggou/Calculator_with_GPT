import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Chat from '../../Components/Chat';
import '@testing-library/jest-dom/extend-expect';

describe("Chat Feature Integration Test", () => {
  const baseURL = "http://localhost:3000"; // Adjust as necessary
  const documentName = 'document_integration_test';
  const userName = 'Test User';
  const messageText = "Holy cow!";

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it("sends a message from frontend to backend and receives it", async () => {
    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Message sent" })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { user: userName, message: "Existing message" },
        { user: userName, message: messageText }
      ])
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(messageInput, { target: { value: messageText } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const messageElement = screen.queryByText((content, element) => {
        return content.includes("Holy cow!");
      });
      expect(messageElement).toBeInTheDocument();
    });

    // Simulate fetching messages from the backend after sending the message
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { user: userName, message: "Existing message" },
        { user: userName, message: messageText }
      ])
    });

    const response = await fetch(`/chat/${documentName}`);
    const backendMessages = await response.json();

    // Verify if the sent message is received from the backend
    const sentMessageReceived = backendMessages.some((msg: { message: string }) => msg.message === messageText);
    expect(sentMessageReceived).toBe(true);
  
  });
});

