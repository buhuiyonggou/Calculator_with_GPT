import { ChatManager } from '../../Engine/ChatManager'

describe('ChatManager', () => {
  test('should add a message', () => {
    const chatManager = new ChatManager();
    const documentName = 'document1';
    const user = 'user1';
    const messageText = 'Hello, how are you?';

    chatManager.addMessage(documentName, user, messageText);

    const messages = chatManager.getMessages(documentName, 0, 10);

    expect(messages.length).toBe(1);

    const message = messages[0];

    expect(message.user).toBe(user);
    expect(message.message).toBe(messageText);
    expect(message.timestamp).toBeDefined();
    expect(new Date(message.timestamp)).toBeInstanceOf(Date);
  });

  test('should have correct message content', () => {
    const chatManager = new ChatManager();
    const documentName = 'document2';
    const user = 'user1';
    const messageText = 'How are you doing?';

    chatManager.addMessage(documentName, user, messageText);

    const messages = chatManager.getMessages(documentName, 0, 10);

    expect(messages.length).toBe(1);

    const message = messages[0];

    expect(message.user).toBe(user);
    expect(message.message).toBe(messageText);
    expect(message.timestamp).toBeDefined();
    expect(new Date(message.timestamp)).toBeInstanceOf(Date);
  });

  test('should get messages', () => {
    const chatManager = new ChatManager();
    const documentName = 'document3';

    chatManager.addMessage(documentName, 'user1', 'Message 1');
    chatManager.addMessage(documentName, 'user2', 'Message 2');
    chatManager.addMessage(documentName, 'user3', 'Message 3');

    const messages = chatManager.getMessages(documentName, 0, 2);

    expect(messages.length).toBe(2);

    const firstMessage = messages[0];
    const secondMessage = messages[1];

    expect(firstMessage.timestamp).toBeDefined();
    expect(new Date(firstMessage.timestamp)).toBeInstanceOf(Date);

    expect(secondMessage.timestamp).toBeDefined();
    expect(new Date(secondMessage.timestamp)).toBeInstanceOf(Date);
  });

  test('should add a message and retrieve it using getMessages', () => {
    const chatManager = new ChatManager();
    const documentName = 'document6';
    const user = 'user1';
    const messageText = 'Test message';

    // Ensure documentName array doesn't exist before adding the message
    expect(chatManager['chatMessages'].has(documentName)).toBe(false);

    chatManager.addMessage(documentName, user, messageText);

    // Check if the documentName array was created after adding the message
    expect(chatManager['chatMessages'].has(documentName)).toBe(true);

    // Verify that the message was added to the documentName array
    const messagesAfterAdd = chatManager['chatMessages'].get(documentName);
    expect(messagesAfterAdd?.length).toBe(1);
    expect(messagesAfterAdd?.[0].user).toBe(user);
    expect(messagesAfterAdd?.[0].message).toBe(messageText);

    // Verify that getMessages retrieves the added message
    const messages = chatManager.getMessages(documentName, 0, 10);
    expect(messages.length).toBe(1);
    const retrievedMessage = messages[0];
    expect(retrievedMessage.user).toBe(user);
    expect(retrievedMessage.message).toBe(messageText);
    expect(retrievedMessage.timestamp).toBeDefined();
    expect(new Date(retrievedMessage.timestamp)).toBeInstanceOf(Date);
  });

  test('should return messages for the specified documentName', () => {
    const chatManager = new ChatManager();
    const documentName = 'document8';
    const user = 'user1';
    const messageText = 'Test message';

    chatManager.addMessage(documentName, user, messageText);

    const messages = chatManager.getMessages(documentName, 0, 10);

    expect(messages.length).toBe(1);
    const retrievedMessage = messages[0];

    expect(retrievedMessage.user).toBe(user);
    expect(retrievedMessage.message).toBe(messageText);
    expect(retrievedMessage.timestamp).toBeDefined();
    expect(new Date(retrievedMessage.timestamp)).toBeInstanceOf(Date);
  });

  test('should return an empty array for a documentName with no messages', () => {
    const chatManager = new ChatManager();
    const documentName = 'document9';

    const messages = chatManager.getMessages(documentName, 0, 10);

    expect(messages.length).toBe(0);
  });

  test('should add a message to the array for the specified documentName', () => {
    const chatManager = new ChatManager();
    const documentName = 'document11';
    const user = 'user1';
    const messageText = 'Test message';

    // Ensure documentName array doesn't exist before adding the message
    expect(chatManager['chatMessages'].has(documentName)).toBe(false);

    chatManager.addMessage(documentName, user, messageText);

    // Directly access the array associated with documentName
    const messagesAfterAdd = chatManager['chatMessages'].get(documentName);

    // Check if the documentName array was created after adding the message
    expect(messagesAfterAdd).toBeDefined();
    expect(messagesAfterAdd?.length).toBe(1);

    // Verify that the message was added to the documentName array
    const addedMessage = messagesAfterAdd?.[0];
    expect(addedMessage).toBeDefined();
    expect(addedMessage?.user).toBe(user);
    expect(addedMessage?.message).toBe(messageText);
    expect(addedMessage?.timestamp).toBeDefined();
    expect(new Date(addedMessage?.timestamp ?? '')).toBeInstanceOf(Date);
  });

});
