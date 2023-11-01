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

    getMessages(documentName: string, page: number, pageSize: number) {
        const messages = this.chatMessages.get(documentName) || [];
        // Sort messages by timestamp in descending order
        messages.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        // Calculate starting index for the requested page
        const start = page * pageSize;
        return messages.slice(start, start + pageSize);
    }

}
