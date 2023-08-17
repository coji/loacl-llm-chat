import { Outlet } from '@remix-run/react'
import { AppFooter, AppHeader } from '~/components'

export default function IndexPage() {
  return (
    <div className="flex h-screen flex-col bg-slate-200">
      <AppHeader />
      <main className="container mx-auto flex flex-1 flex-col py-2">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
