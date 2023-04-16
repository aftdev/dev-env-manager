import Npm from './Npm.js'

/**
 * Yarn Service.
 */
export default class Yarn extends Npm {
  protected override command = 'yarn'
}
