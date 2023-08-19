import type MODELS from '~/assets/language-models.json'

export type LanguageModel = (typeof MODELS)[number]
