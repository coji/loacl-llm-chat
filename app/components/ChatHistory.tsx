import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import nl2br from 'react-nl2br'
import { cn } from '~/utils/cn'

const ChatHistory = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative flex-1 overflow-auto pr-8', className)} {...props}>
        <div className="absolute inset-0 flex flex-1 flex-col gap-1">{children}</div>
      </div>
    )
  },
)
ChatHistory.displayName = 'ChatHistory'

const chatHistoryItemVariants = cva('flex flex-col break-all', {
  variants: {
    role: {
      system: 'mx-auto',
      user: 'ml-20 md:ml-40',
      assistant: 'mr-20 md:mr-40',
    },
  },
  defaultVariants: {
    role: 'system',
  },
})
const ChatHistoryItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof chatHistoryItemVariants>
>(({ className, role, ...props }, ref) => (
  <div ref={ref} className={cn(chatHistoryItemVariants({ role }), className)} {...props} />
))
ChatHistoryItem.displayName = 'ChatHistoryItemContainer'

const chatHistoryItemMessageVariants = cva('px-2 py-1 text-foreground rounded', {
  variants: {
    role: {
      system: 'mx-auto',
      user: 'ml-auto bg-background ',
      assistant: 'mr-auto bg-secondary',
    },
  },
  defaultVariants: {
    role: 'system',
  },
})
const ChatHistoryItemMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof chatHistoryItemMessageVariants>
>(({ className, role, children, ...props }, ref) => (
  <div ref={ref} className={cn(chatHistoryItemMessageVariants({ role }), className)} {...props}>
    {nl2br(children)}
  </div>
))
ChatHistoryItemMessage.displayName = 'ChatHistoryItemMessage'

export { ChatHistory, ChatHistoryItem, ChatHistoryItemMessage }
