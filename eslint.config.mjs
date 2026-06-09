import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import ts from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['flat/recommended'],
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]
