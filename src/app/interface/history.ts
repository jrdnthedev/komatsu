export interface HistoryMessage {
  message_id: number;
  prompt: string;
  response: string;
  role: 'user' | 'llm';
}
