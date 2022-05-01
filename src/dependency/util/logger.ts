import debug from 'debug'
import { name as applicationName } from '../../../package.json'

export default (logName: string) => debug(`${applicationName}:${logName}`)
