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
 * Stub the output from the cli service in the given container.
 *
 * @param {AwilixContainer} container
 * @returns {SinonFake}
 */
export function stubCliOutput(container) {
  const cli = container.resolve('cli')

  const fake = sinon.fake()

  cli.configureOutput({
    writeOut: fake,
    writeErr: fake,
    outputError: fake,
  })

  return fake
}

export function stubOutputFormatter(container, sandbox) {
  const outputFormatter = container.resolve('outputFormatter')

  return sandbox.stub(outputFormatter, 'output')
}

let currentEnquirerPromptStub = () => {}

/**.
 * Stub the enquirer answers
 *
 * @param {AwilixContainer} container
 * @param {Object} answers
 */
export function stubEnquirer(container, answers = {}) {
  const enquirer = container.resolve('enquirer')
  enquirer.options.show = false

  enquirer.off('prompt', currentEnquirerPromptStub)
  currentEnquirerPromptStub = (prompt) => {
    const promptAnswer = prompt.name in answers ? answers[prompt.name] : null
    switch (prompt.type.toLowerCase()) {
      case 'select':
      case 'confirm':
        prompt.initial = promptAnswer
        break
      default:
        prompt.value = promptAnswer
        break
    }

    prompt.submit()
  }

  enquirer.on('prompt', currentEnquirerPromptStub)

  return enquirer
}
