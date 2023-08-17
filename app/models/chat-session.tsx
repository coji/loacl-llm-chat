import { prisma } from '~/services/database.server'

export const newChatSession = async () => {
  return await prisma.chatSession.create({
    data: { title: 'New Chat Session' },
  })
}
