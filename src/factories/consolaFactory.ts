import { createConsola } from 'consola'

export default function () {
  return createConsola({
    stdout: process.stdout,
    stderr: process.stderr,
    formatOptions: {
      date: true, // Default to true but will hide date every where (from defaults)
    },
  }).withDefaults({
    // @ts-expect-error: Consola uses toLocaleTimeString to format date object
    date: { toLocaleTimeString: () => '', getTime: () => undefined },
  })
}
