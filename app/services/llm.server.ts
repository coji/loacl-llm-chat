import { match } from 'ts-pattern'
import type { LanguageModel } from '~/interfaces/model'
import { gptNeoxCommand } from './runtime/gpt-neox.server'

export const llmCommand = async ({ model, prompt }: { model: LanguageModel; prompt: string }) => {
  return match(model.runtime)
    .with('gpt-neox', async () => {
      return gptNeoxCommand({ model, prompt })
    })
    .otherwise(() => {
      throw new Error('Unsupported runtime')
    })
}
