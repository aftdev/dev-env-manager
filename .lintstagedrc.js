/**
 * Lint-Staged Configuration.
 *
 * @see https://github.com/okonet/lint-staged#configuration
 */

import { ESLint } from 'eslint'

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    }),
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles.join(' ')
}

export default {
  '*.{js,mjs,cjs,ts,md,json,yaml,yml}': 'prettier --write',
  '*.{ts,js,mjs,cjs}': async (files) => {
    // https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore
    const filesToLint = await removeIgnoredFiles(files)
    return [`eslint --cache --fix --max-warnings 0 ${filesToLint}`]
  },
}
