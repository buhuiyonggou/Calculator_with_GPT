export class ChatGPTManager {
    private chatGPTMessages: Map<string, Array<{ user: string; message: string; timestamp: string }>>;

    constructor() {
        this.chatGPTMessages = new Map();
    }

    addMessages(documentName: string, messages: Array<{ user: string; message: string; timestamp: string }>): void {
        if (!this.chatGPTMessages.has(documentName)) {
            this.chatGPTMessages.set(documentName, []);
        }

        const existingMessages = this.chatGPTMessages.get(documentName) || [];
        this.chatGPTMessages.set(documentName, [...existingMessages, ...messages]);
    }

    getMessages(documentName: string): Array<{ user: string; message: string; timestamp: string }> {
        return this.chatGPTMessages.get(documentName) || [];
    }
}
