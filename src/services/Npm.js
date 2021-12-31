import { RESOLVER, Lifetime } from 'awilix'
import AbstractFilebasedService from './AbstractFilebasedService.js'

/**
 * Npm goodies.
 */
export default class Npm extends AbstractFilebasedService {
  static FILE = 'package.json'
  static COMMAND = 'npm'
}

// DI info.
Npm[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
