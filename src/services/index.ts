import { asClass } from 'awilix'
import CommandExecuter from '#services/CommandExecuter'
import OutputFormatter from '#services/OutputFormatter'

const services = {
  outputFormatter: asClass(OutputFormatter).classic(),
  commandExecuter: asClass(CommandExecuter).classic(),
}

export default services
