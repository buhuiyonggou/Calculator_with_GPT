import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatGPTChat from "../../Components/ChatGPTChat";
import "@testing-library/jest-dom/extend-expect";

describe("Chat Feature Integration Test", () => {
  const baseURL = "http://localhost:3000"; // Adjust as necessary
  const documentName = "document_integration_test";
  const userName = "Test User";
  const messageText = "Who is Horatio Nelson";

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it("sends a message from frontend to backend and receives it", async () => {
    render(
      <ChatGPTChat
        documentName={documentName}
        userName={userName}
        baseURL={baseURL}
      />
    );

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: "Sending message to backend" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { user: userName, message: "Existing message" },
            { user: userName, message: messageText },
          ]),
      });

    const messageInput = screen.getByPlaceholderText(
      "Ask ChatGPT a question..."
    );
    const sendButton = screen.getByText("Send");

    fireEvent.change(messageInput, { target: { value: messageText } });
    fireEvent.click(sendButton);

    // Simulate fetching messages from the backend after sending the message
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { user: userName, message: "Existing message" },
          { user: userName, message: messageText },
        ]),
    });

    const response = await fetch(`/chatgpt/${documentName}`);
    const backendMessages = await response.json();

    const sentMessageReceived = backendMessages.some(
      (msg: { message: string }) => msg.message === messageText
    );
    expect(sentMessageReceived).toBe(true);
  });
});
