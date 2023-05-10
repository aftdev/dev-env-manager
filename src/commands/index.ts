import type { RegisteredServices } from '#src/services/index.js'

export type DevCommandInitializer = (args: RegisteredServices) => void
