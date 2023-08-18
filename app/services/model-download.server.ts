import Downloader from 'nodejs-file-downloader'

export const createDownloadService = () => {
  let downloader: InstanceType<typeof Downloader> | null = null
  let filePath: string | null = null
  let progress = ''
  let remainSize: number | null = null

  const startDownload = async ({
    url,
    directory = './llm/models',
    fileName,
  }: {
    url: string
    directory?: string
    fileName: string
  }) => {
    downloader = new Downloader({
      url,
      directory,
      fileName,
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
