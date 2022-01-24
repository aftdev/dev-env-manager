import { resolve } from 'path'
import sinon from 'sinon'
import createContainer from '../../src/container.js'

// Init path before any files can change current path.
const testPath = resolve('./tests/feature/files')

/**
 * @returns {AwilixContainer}
 */
export default async function createTestContainer(projectFolder) {
  const folderPath = resolve(testPath, projectFolder)

  return await createContainer(folderPath)
}

/**
 * Mock the output from the cli service in the given container.
 *
 * @param {AwilixContainer} container
 * @returns {SinonFake}
 */
export function mockCliOutput(container) {
  const cli = container.resolve('cli')

  const fake = sinon.fake()

  cli.configureOutput({
    writeOut: fake,
    writeErr: fake,
    outputError: fake,
  })

  return fake
}
