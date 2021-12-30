import { RESOLVER, Lifetime } from 'awilix'
import AbstractFilebasedService from './AbstractFilebasedService.js'

/**
 * PHP Composer goodies.
 */
export default class Composer extends AbstractFilebasedService {
  static FILE = 'composer.json'
  static COMMAND = 'composer'
}

// DI info
Composer[RESOLVER] = {
  lifetime: Lifetime.SCOPED,
}
