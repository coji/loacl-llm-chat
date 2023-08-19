import { basename } from 'path'
import type { LanguageModel } from '~/interfaces/model'
import { cmd } from '../cmd.server'

export const gptNeoxCommand = async ({
  model,
  temp = 0.5,
  prompt,
}: {
  model: LanguageModel
  temp?: number
  prompt: string
}) => {
  const result = await cmd('./gpt-neox', `-m models/${basename(model.url)} --temp ${temp} -p ${prompt}`, './llm')
  if (result === null) {
    console.log('cmd failed')
    throw new Error('gpt-neox failed')
  }
  return result.replaceAll('<0x0A>', '\n').replaceAll('</s>', '')
}
