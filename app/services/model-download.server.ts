import Downloader from 'nodejs-file-downloader'
import { basename } from 'path'
import type { LanguageModel } from '~/interfaces/model'

export const createDownloadService = () => {
  let downloader: InstanceType<typeof Downloader> | null = null
  let filePath: string | null = null
  let progress = ''
  let remainSize: number | null = null

  const startDownload = async (model: LanguageModel) => {
    downloader = new Downloader({
      url: model.url,
      directory: './llm/models',
      fileName: basename(model.url),
      onProgress: (percentage, chunk, remainingSize) => {
        progress = percentage
        remainSize = remainingSize
        console.log('progress', progress)
      },
    })

    progress = ''
    const report = await downloader.download()
    filePath = report.filePath
    return filePath
  }

  const cancelDownload = () => {
    if (!downloader) return
    downloader.cancel()
    filePath = null
    progress = ''
    remainSize = null
  }

  return { startDownload, cancelDownload, progress, filePath, remainSize }
}
