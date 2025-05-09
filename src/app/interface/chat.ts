export interface ChatMessage {
  role: 'user' | 'llm';
  content: string;
  createdAt: Date;
}
