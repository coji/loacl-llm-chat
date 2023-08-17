import { type LinksFunction, type V2_MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { createHead } from 'remix-island'
import globalStyles from './styles/globals.css'

export const meta: V2_MetaFunction = () => [{ title: 'Japanese LM Chat' }]

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: globalStyles }]

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <Meta />
    <Links />
  </>
))

export default function App() {
  return (
    <>
      <Head />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
