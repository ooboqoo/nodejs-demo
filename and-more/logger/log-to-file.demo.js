import { appendFile } from 'node:fs'
import path from 'node:path'

import { Logger, LOG_LEVEL } from './logger.js'

const logFolder = '.'
const defaultLogFile = new Date().toISOString().replace(/[^0-9]/g, '') + '.txt'

function createFileTransport(filename = defaultLogFile) {
  const filepath = path.resolve(logFolder, filename)
  return {
    write(str) {
      appendFile(filepath, str + '\n', 'utf8', (_err) => {})
    },
  }
}

const log = new Logger({
  logDest: createFileTransport('log.txt'),
  errDest: createFileTransport('error.txt'),
})
const logA = log.useModule('ModuleA').useLevel(LOG_LEVEL.ALL)

log.info('some info of main logger')

logA.debug('some debug info')
logA.info('title', 'some info')
logA.warn('warn title', 'some warning message')
logA.error('error title', 'some error info', new ReferenceError('x is not defined'))
