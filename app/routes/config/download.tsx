import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'

import { z } from 'zod'
import MODELS from '~/assets/language-models.json'
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
  downloadService.startDownload(model)
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
