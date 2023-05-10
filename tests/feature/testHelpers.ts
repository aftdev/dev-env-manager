import { resolve } from 'path'
import type { AwilixContainer } from 'awilix'
import Enquirer from 'enquirer'
import sinon, { SinonSandbox } from 'sinon'
import createContainer from '../../src/container.js'

// Init path before any files can change current path.
const testPath = resolve('./tests/feature/files')

export default async function createTestContainer(
  projectFolder: string,
): Promise<AwilixContainer> {
  const folderPath = resolve(testPath, projectFolder)

  return await createContainer(folderPath)
}

/**
 * Stub the output from the cli service in the given container.
 */
export function stubCliOutput(container: AwilixContainer) {
  const cli = container.resolve('cli')

  const fake = sinon.fake()

  cli.configureOutput({
    writeOut: fake,
    writeErr: fake,
    outputError: fake,
  })

  return fake
}

export function stubOutputFormatter(
  container: AwilixContainer,
  sandbox: SinonSandbox,
) {
  const outputFormatter = container.resolve('outputFormatter')

  return sandbox.stub(outputFormatter, 'output').returnsThis()
}

let currentEnquirerPromptStub: (
  args: Record<string, { name: string; initial: string; type: string }>,
) => void

/**
 * Stub the enquirer answers.
 */
export function stubEnquirer(
  container: AwilixContainer,
  answers: Record<string, unknown> = {},
) {
  const enquirer = container.resolve('enquirer') as Enquirer
  // @ts-expect-error: using enquirer hidden property.
  enquirer.options.show = false

  if (currentEnquirerPromptStub) {
    enquirer.off('prompt', currentEnquirerPromptStub)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentEnquirerPromptStub = (prompt: any) => {
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
