import CommandExecuter from '../services/CommandExecuter.js'

/**
 * @returns {CommandExecuter}
 */
export default function (configuration, outputFormatter) {
  const executables = configuration.executables

  return new CommandExecuter(executables, outputFormatter)
}
