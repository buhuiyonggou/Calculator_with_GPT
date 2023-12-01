import request from "supertest";
import { app } from "../../Server/DocumentServer";
import { ChatManager } from "../../Engine/ChatManager";

describe("Chat Feature Backend Tests", () => {
  let chatManager: ChatManager;

  beforeEach(() => {
    chatManager = new ChatManager();
  });

  it("GET /chat/:documentName should return paged messages", async () => {
    const documentName = "exampleDocument";
    const response = await request(app).get(`/chat/${documentName}`);

    expect(response.status).toBe(200);
    // Add more specific assertions for the response content if needed
  });

  it("POST /chat/:documentName should add a message", async () => {
    const documentName = "exampleDocument";
    const newMessage = {
      user: "JohnDoe",
      message: "Hello, world!",
    };

    const response = await request(app)
      .post(`/chat/${documentName}`)
      .send(newMessage);

    expect(response.status).toBe(200);
    // Assert further details like response body or message addition confirmation
  });

  // Test for Message Addition Logic
  test("Should correctly add messages to the storage structure", async () => {
    // Make the POST request
    await request(app).post("/chat/document1"); // Modify the documentName

    // Wait for the request to complete and then retrieve messages
    chatManager.addMessage(
      "document1",
      "user1",
      "Test message for storage structure"
    );
    const messages = chatManager.getMessages("document1", 0, 10); // Adjust parameters based on your implementation

    // Assert that the message was added
    expect(messages.length).toBe(1);
    expect(messages[0].user).toBe("user1");
    expect(messages[0].message).toBe("Test message for storage structure");
  });

  // Test for Message Order Logic
  test("Should fetch messages ordered by timestamp with delay", async () => {
    const documentName = "document2";
    const user = "user1";

    chatManager.addMessage(documentName, user, "Message 1");

    // Introduce a delay before adding the second message
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay time as needed

    chatManager.addMessage(documentName, user, "Message 2");

    const messages = chatManager.getMessages(documentName, 0, 10);

    expect(messages.length).toBe(2);

    const timestamp1 = new Date(messages[0].timestamp).getTime();
    const timestamp2 = new Date(messages[1].timestamp).getTime();

    expect(timestamp1).toBeGreaterThan(timestamp2);
  });

  // Test for Default Message Retrieval Logic
  test("Should fetch corresponding messages for each document", () => {
    const document1 = "document3";
    const document2 = "document4";

    chatManager.addMessage(document1, "user1", "Message in Document 3");
    chatManager.addMessage(document2, "user1", "Message in Document 4");

    const messagesDoc1 = chatManager.getMessages(document1, 0, 10);
    const messagesDoc2 = chatManager.getMessages(document2, 0, 10);

    expect(messagesDoc1.length).toBe(1);
    expect(messagesDoc1[0].message).toBe("Message in Document 3");

    expect(messagesDoc2.length).toBe(1);
    expect(messagesDoc2[0].message).toBe("Message in Document 4");
  });

  // Test for More Messages Retrieval Logic
  test("Should return chat history in categories based on pages", () => {
    const documentName = "document5";

    // Add 25 messages
    for (let i = 0; i < 25; i++) {
      chatManager.addMessage(documentName, "user1", `Message ${i}`);
    }

    const page1 = chatManager.getMessages(documentName, 0, 10);
    const page2 = chatManager.getMessages(documentName, 1, 10);

    expect(page1.length).toBe(10);
    expect(page2.length).toBe(10);
  });
});
