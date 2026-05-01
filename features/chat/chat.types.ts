export interface ContactUser {
    id: number;
    username: string;
    avatar: string;
    new?: boolean;
}

export interface ChatWindow {
    isOpen: boolean;
    user: ContactUser | null;
    conversationId?: number;
}

export interface Conversation {
    id: number,
    type: 'PRIVATE' | 'GROUP',
    updated_at: string,
    self_participation: {
        last_read_message_id: number
    },
    lastMessage: {
        content: string
    },
    other_participants: {
        user_id: number,
        user: {
            id: number,
            username: string,
            avatar: string
        } 
    }[]
}

export interface Message {
  id: number,
  origin: 'other' | 'self' | 'system',
  content: string,
  date: string,
  sender?: {
    id: number,
    username: string,
    avatar: string
  }
}

export interface MessageResponse {
  id: number;
  conversationId?: number;
  created_at: string
}