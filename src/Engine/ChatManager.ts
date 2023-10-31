export class ChatManager {
    private chatMessages: Map<string, Array<{ user: string; message: string; timestamp: string }>>;

    constructor() {
        this.chatMessages = new Map();
    }

    addMessage(documentName: string, user: string, message: string): void {
        const timestamp = new Date().toISOString();
        const chatMessage = { user, message, timestamp };

        // Ensure there is an array to push to
        if (!this.chatMessages.has(documentName)) {
            this.chatMessages.set(documentName, []);
        }

        this.chatMessages.get(documentName)?.push(chatMessage);
    }

    getMessages(documentName: string): Array<{ user: string; message: string; timestamp: string }> {
        return this.chatMessages.get(documentName) || [];
    }
}
