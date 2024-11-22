import { createConsola } from 'consola'

export default function () {
  return createConsola({
    formatOptions: {
      date: true, // Default to true but will hide date everywhere (from defaults)
    },
  }).withDefaults({
    // @ts-expect-error: Consola uses toLocaleTimeString to format date object
    date: { toLocaleTimeString: () => '', getTime: () => undefined },
  })
}
