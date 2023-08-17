import { prisma } from '~/services/database.server'

export const addChatMessage = async (chatSessionId: string, role: 'user' | 'assistant', message: string) => {
  await prisma.chatHistory.create({
    data: { chatSessionId, role, message },
  })
}
