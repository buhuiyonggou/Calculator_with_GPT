import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { PortsGlobal, LOCAL_SERVER_URL } from "../../ServerDataDefinitions";
import ChatGPTChat from "../../Components/ChatGPTChat";

describe("ChatGPTChat Component", () => {
  const serverPort = PortsGlobal.serverPort;
  const baseURL = `${LOCAL_SERVER_URL}:${serverPort}`;

  it("renders ChatGPT component correctly", () => {
    const userName = "Test User";
    const documentName = "document1";

    render(
      <ChatGPTChat
        documentName={documentName}
        userName={userName}
        baseURL={baseURL}
      />
    );
    expect(screen.getByText("Ask ChatGPT")).toBeInTheDocument();
  });

  it("Send Button exists", () => {
    const userName = "Test User";
    const documentName = "document2";

    render(
      <ChatGPTChat
        documentName={documentName}
        userName={userName}
        baseURL={baseURL}
      />
    );
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("Ask ChatGPT a question... in placeholder", () => {
    const documentName = "document3";
    const userName = "Test User";

    render(
      <ChatGPTChat
        documentName={documentName}
        userName={userName}
        baseURL={baseURL}
      />
    );
    expect(
      screen.getByPlaceholderText("Ask ChatGPT a question...")
    ).toBeInTheDocument();
  });

  it("user can type in the message box", () => {
    const userName = "Test User";
    const documentName = "document4";

    render(
      <ChatGPTChat
        documentName={documentName}
        userName={userName}
        baseURL={baseURL}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Ask ChatGPT a question..."), {
      target: { value: "Hello, world!" },
    });
    expect(
      screen.getByPlaceholderText("Ask ChatGPT a question...")
    ).toHaveValue("Hello, world!");
  });

  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      const urlString = typeof url === "string" ? url : url.toString();

      if (
        urlString.includes("/chatgpt/") &&
        options &&
        options.method === "POST"
      ) {
        // Simulate a successful send action
        return Promise.resolve(new Response(null, { status: 200 }));
      } else if (urlString.includes("/chatgpt/")) {
        // Simulate fetching messages, including the new 'WW2' message
        const mockResponse = JSON.stringify([
          { user: "Test User", message: "What is orca" },
        ]);
        return Promise.resolve(
          new Response(mockResponse, {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return Promise.reject(new Error("not found"));
    });
  });
});
