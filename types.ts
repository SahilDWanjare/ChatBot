export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export enum Sender {
  USER = 'USER',
  MODEL = 'MODEL',
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string; // Text content or Base64 image string
  timestamp: number;
  isError?: boolean;
}

export enum AppMode {
  CHAT = 'CHAT',
  GENERATE_IMAGE = 'GENERATE_IMAGE',
}

export enum BotState {
  IDLE = 'IDLE',
  GREETING = 'GREETING',
  THINKING = 'THINKING',
  RESULT = 'RESULT',
}