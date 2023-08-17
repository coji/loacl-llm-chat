import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { SendHorizontalIcon } from 'lucide-react'
import { useEffect } from 'react'
import { setTimeout } from 'timers/promises'
import { z } from 'zod'
import { ChatHistory, ChatHistoryItem, ChatHistoryItemMessage } from '~/components'
import { Button, HStack, Input, Stack } from '~/components/ui'

const schema = z.object({
  input: z.string().max(3000),
})

const chatSessions: string[] = []
const chatHistories: { id: number; message: string; role: 'user' | 'assistant' }[] = []

export const loader = async ({ request }: LoaderArgs) => {
  await setTimeout(1000)
  return json({ chatSessions, chatHistories })
}

export const action = async ({ request }: ActionArgs) => {
  const submission = await parse(await request.formData(), { schema })
  if (!submission.value) {
    return json(submission)
  }
  chatHistories.push({
    id: chatHistories.length,
    message: submission.value.input,
    role: 'user',
  })
  chatHistories.push({
    id: chatHistories.length,
    message: 'Hello, World!',
    role: 'assistant',
  })
  return json(submission.value)
}

export default function IndexPage() {
  const navigation = useNavigation()
  const { chatHistories } = useLoaderData<typeof loader>()
  const [form, { input }] = useForm({
    id: 'chat',
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parse(formData, { schema }),
  })

  useEffect(() => {
    if (navigation.state === 'submitting' && form.ref.current) {
      // 送信時にフォームをリセットして、input に再フォーカス
      form.ref.current.reset()
      if (input.id) document.getElementById(input?.id)?.focus()
    } else if (navigation.state === 'idle') {
      // 最新のログにスクロール
      const latest = document.getElementById('latest')
      latest?.scrollIntoView(true)
    }
  }, [form.ref, navigation.state, input.id])

  return (
    <div className="flex flex-1 flex-col gap-2">
      <ChatHistory>
        {chatHistories.map((item) => (
          <ChatHistoryItem key={item.id} role={item.role}>
            <ChatHistoryItemMessage role={item.role}>{item.message}</ChatHistoryItemMessage>
          </ChatHistoryItem>
        ))}
        <div id="latest" />
      </ChatHistory>

      <Form method="POST" {...form.props} autoComplete="off" replace>
        <Stack>
          <HStack>
            <Input placeholder="Input your message here." autoFocus {...conform.input(input)}></Input>
            <Button disabled={!!input.error || navigation.state !== 'idle'} variant="default">
              <SendHorizontalIcon className="mr-2 h-4 w-4" /> {navigation.state !== 'idle' ? 'Send...' : 'Send'}
            </Button>
          </HStack>
        </Stack>
      </Form>
    </div>
  )
}
