import { createConsola } from 'consola'

export default function () {
  return createConsola({
    stdout: process.stdout,
    stderr: process.stderr,
    formatOptions: {
      date: false,
    },
  })
}
