import { Link } from '@remix-run/react'
import { Heading } from '~/components/ui'

export const AppHeader = () => {
  return (
    <header className="flex items-center bg-background px-2 py-1">
      <Heading>
        <Link to="/">Japanese LM Chat</Link>
      </Heading>
    </header>
  )
}
