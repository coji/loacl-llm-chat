import { match } from 'ts-pattern'
import type { LanguageModel } from '~/interfaces/model'
import { createPrompt } from './prompt-file.server'
import { gptNeoxCommand } from './runtime/gpt-neox.server'

export const llmCommand = async ({ model, prompt }: { model: LanguageModel; prompt: string }) => {
  const command = match(model.runtime)
    .with('gpt-neox', () => {
      return gptNeoxCommand
    })
    .otherwise(() => {
      throw new Error(`Runtime ${model.runtime} not supported`)
    })

  const promptFile = await createPrompt(prompt)
  const result = await command({ model, promptFilepath: promptFile.filename })
  await promptFile.cleanup()

  return result
}
