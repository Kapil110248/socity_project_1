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

  sendMessage: async (data: { conversationId: number; content: string; attachments?: { url: string; type?: string; name?: string }[] }) => {
    const response = await api.post<ChatMessage>('/chat/messages', data)
    return response.data
  },

  uploadAttachment: async (file: File): Promise<{ url: string; type: string; name: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<{ url: string; type: string; name: string }>('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  startConversation: async (type: string) => {
    const response = await api.post<Conversation>('/chat/start', { type })
    return response.data
  },

  /** Start direct 1:1 chat with another user; optional listingItem from marketplace so product appears in chat for both */
  startDirectConversation: async (
    targetUserId: number,
    listingItem?: { itemId: number; itemTitle: string; itemPrice?: string; itemImage?: string }
  ) => {
    const body: { targetUserId: number; listingItem?: typeof listingItem } = { targetUserId }
    if (listingItem?.itemTitle) body.listingItem = listingItem
    const response = await api.post('/chat/start', body)
    return response.data
  }
}
