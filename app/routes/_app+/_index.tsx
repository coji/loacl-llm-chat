import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { SendHorizontalIcon } from 'lucide-react'
import React from 'react'
import { z } from 'zod'
import MODELS from '~/assets/language-models.json'
import { ChatHistory, ChatHistoryItem, ChatHistoryItemMessage } from '~/components'
import { Button, HStack, Stack, Textarea } from '~/components/ui'
import { llmCommand } from '~/services/llm.server'

const schema = z.object({
  input: z.string().max(3000),
})

const chatSessions: string[] = []
const chatHistories: { id: number; message: string; role: 'user' | 'assistant' }[] = []

export const loader = async ({ request }: LoaderArgs) => {
  return json({ chatSessions, chatHistories })
}

export const action = async ({ request }: ActionArgs) => {
  const submission = await parse(await request.formData(), { schema })
  if (!submission.value) {
    return json(submission)
  }

  const { input } = submission.value
  chatHistories.push({
    id: chatHistories.length,
    message: input,
    role: 'user',
  })

  const assistantMessage = await llmCommand({ model: MODELS[0], prompt: input })
  console.log(assistantMessage)
  chatHistories.push({
    id: chatHistories.length,
    message: assistantMessage,
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

  const submit = useSubmit()
  const isSending = navigation.state !== 'idle'

  React.useEffect(() => {
    if (navigation.state === 'submitting') {
      // 送信時にフォームをリセットして、input に再フォーカス
      form.ref.current?.reset()
      document.getElementById(input.id!)?.focus()
    }
    // 最新のログにスクロール
    const latest = document.getElementById('latest')
    latest?.scrollIntoView(true)
  }, [form.ref, navigation.state, input.id])

  return (
    <div className="flex flex-1 flex-col gap-2">
      <ChatHistory>
        {chatHistories.map((item) => (
          <ChatHistoryItem key={item.id} role={item.role}>
            <ChatHistoryItemMessage role={item.role}>{item.message}</ChatHistoryItemMessage>
          </ChatHistoryItem>
        ))}
        {isSending && (
          <>
            <ChatHistoryItem role="user">
              <ChatHistoryItemMessage role="user">
                {navigation.formData?.get('input')?.toString() ?? 'sending'}
              </ChatHistoryItemMessage>
            </ChatHistoryItem>
            <ChatHistoryItem role="assistant">
              <ChatHistoryItemMessage role="assistant" className="text-foreground/50">
                Loading...
              </ChatHistoryItemMessage>
            </ChatHistoryItem>
          </>
        )}
        <div id="latest" />
      </ChatHistory>

      <Form method="POST" {...form.props} autoComplete="off" replace>
        <Stack>
          <HStack>
            <Textarea
              className="min-h-4"
              placeholder="Input your message here."
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter' && event.metaKey) {
                  event.preventDefault()
                  submit(form.ref.current)
                }
              }}
              {...conform.textarea(input)}
            ></Textarea>
            <Button disabled={!!input.error || navigation.state !== 'idle'} variant="default">
              {isSending ? (
                <>Sending...</>
              ) : (
                <>
                  <SendHorizontalIcon className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </HStack>
        </Stack>
      </Form>
    </div>
  )
}
