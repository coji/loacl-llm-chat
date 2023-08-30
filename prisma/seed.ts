import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  // noop
  console.log(`Database has been seeded. 🌱`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
