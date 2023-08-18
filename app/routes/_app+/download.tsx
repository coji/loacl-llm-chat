import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { basename } from 'path'

import { z } from 'zod'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '~/components/ui'
import { createDownloadService } from '~/services/model-download.server'

const MODELS = [
  {
    id: '1',
    vendor: 'LINE Corp',
    name: 'Japanese Large LM 3.6B GGML Q4',
    description: 'line-corp-japanese-large-lm-3.6b-ggml-q4_0.bin',
    url: 'https://huggingface.co/mmnga/line-corp-japanese-large-lm-3.6b-ggml/resolve/main/line-corp-japanese-large-lm-3.6b-ggml-q4_0.bin',
    size: '2.09GB',
  },
  {
    id: '2',
    vendor: 'LINE Corp',
    name: 'Japanese Large LM 3.6B GGML Q8',
    description: 'line-corp-japanese-large-lm-3.6b-ggml-q8_0.bin',
    url: 'https://huggingface.co/mmnga/line-corp-japanese-large-lm-3.6b-ggml/resolve/main/line-corp-japanese-large-lm-3.6b-ggml-q8_0.bin',
    size: '3.95GB',
  },
  {
    id: '3',
    vendor: 'LINE Corp',
    name: 'Japanese Large LM 3.6B Instruction SFT GGML Q8',
    description: 'line-corp-japanese-large-lm-3.6b-instruction-sft-ggml-q8_0',
    url: 'https://huggingface.co/mmnga/line-corp-japanese-large-lm-3.6b-instruction-sft-ggml/resolve/main/line-corp-japanese-large-lm-3.6b-instruction-sft-ggml-q8_0.bin',
    size: '3.95GB',
  },
]

const schema = z.object({
  modelId: z.string(),
})

export const action = async ({ request }: ActionArgs) => {
  const submission = await parse(await request.formData(), { schema })
  if (!submission.value) {
    throw new Error('Invalid submission')
  }
  const { modelId } = submission.value
  const model = MODELS.find((model) => model.id === modelId)
  if (!model) {
    throw new Error('Invalid model')
  }

  const downloadService = createDownloadService()
  downloadService.startDownload({
    url: model.url,
    fileName: basename(model.url),
  })
  return null
}

export default function DownloadPage() {
  const [form, { modelId }] = useForm({
    onValidate: ({ formData }) => {
      return parse(formData, { schema })
    },
  })
  return (
    <Form method="POST" {...form.props}>
      <Card>
        <CardHeader>
          <CardTitle>Download Language Model</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack>
            <fieldset>
              <Label>Model</Label>
              <Select name={modelId.name}>
                <SelectTrigger>
                  <SelectValue defaultValue={modelId.defaultValue}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} - {model.size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </fieldset>
          </Stack>
        </CardContent>

        <CardFooter>
          <Button>Download</Button>
        </CardFooter>
      </Card>
    </Form>
  )
}
