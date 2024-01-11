import { timeConsumingOperation } from './utils.js'
timeConsumingOperation()
process.send({ time: new Date().getTime() })
