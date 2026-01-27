import api from '@/lib/api'

export interface ChatMessage {
  id: number
  conversationId: number
  senderId: number
  content: string
  attachments?: any
  status: string
  createdAt: string
  sender: {
    id: number
    name: string
    role: string
  }
}

export interface Conversation {
  id: number
  type: string
  participantId: number
  participant: {
    name: string
    profileImg?: string
  }
  messages: ChatMessage[]
  updatedAt: string
}

export const chatService = {
  listConversations: async () => {
    const response = await api.get<Conversation[]>('/chat/conversations')
    return response.data
  },

  getMessages: async (conversationId: number) => {
    const response = await api.get<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  sendMessage: async (data: { conversationId: number; content: string; attachments?: any[] }) => {
    const response = await api.post<ChatMessage>('/chat/messages', data)
    return response.data
  },

  startConversation: async (type: string) => {
    const response = await api.post<Conversation>('/chat/start', { type })
    return response.data
  }
}
