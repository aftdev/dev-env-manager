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
  '*.{js,json,md,mjs,yaml,yml}': 'prettier --write',
  '*.{js,mjs}': async (files) => {
    // https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore
    const filesToLint = await removeIgnoredFiles(files)
    return [`eslint --cache --fix --max-warnings 0 ${filesToLint}`]
  },
}
