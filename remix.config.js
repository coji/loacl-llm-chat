// eslint-disable-next-line @typescript-eslint/no-var-requires
const { flatRoutes } = require('remix-flat-routes')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  /*
  If live reload causes page to re-render without changes (live reload is too fast),
  increase the dev server broadcast delay.

  If live reload seems slow, try to decrease the dev server broadcast delay.
  */
  devServerBroadcastDelay: 300,
  ignoredRouteFiles: ['**/*'],
  routes: (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
  server: './server.ts',
  serverConditions: ['deno', 'worker'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['module', 'main'],
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  watchPaths: ['tailwind.config.js'],
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    v2_headers: true,
    v2_dev: true,
  },
  tailwind: true,
  postcss: true,
}
