import fs from 'fs/promises'
import { nanoid } from 'nanoid'

export const createPrompt = async (prompt: string) => {
  const filename = `./prompts/${nanoid()}.txt`

  await fs.writeFile(filename, prompt, { encoding: 'utf-8' })
  const cleanup = async () => {
    await fs.unlink(filename)
  }

  return { filename, cleanup }
}
