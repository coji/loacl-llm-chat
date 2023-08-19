import { basename } from 'path'
import type { LanguageModel } from '~/interfaces/model'
import { cmd } from './cmd.server'

export const gptNeoxCommand = async ({
  model,
  temp = 0.9,
  repeat_penalty = 1.9,
  promptFilepath,
}: {
  model: LanguageModel
  temp?: number
  repeat_penalty?: number
  promptFilepath: string
}) => {
  const result = await cmd(
    './gpt-neox',
    `-m models/${basename(model.url)} --temp ${temp} --repeat-penalty ${repeat_penalty} -f ../${promptFilepath}`,
    './llm',
  )
  if (result === null) {
    console.log('cmd failed')
    throw new Error('gpt-neox failed')
  }
  return result.replaceAll('<0x0A>', '\n').replaceAll('</s>', '')
}
