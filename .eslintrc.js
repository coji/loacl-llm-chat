/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['jest-dom', 'testing-library', '@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: { '@typescript-eslint/no-floating-promises': 'error' },
    },
  ],
  settings: {
    jest: { version: 28 },
  },
  ignorePatterns: ['node_modules', 'build', 'public/build'],
}
