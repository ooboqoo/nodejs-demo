const fs = require('fs')
const path = require('path')

const { Logger, LOG_LEVEL } = require('./logger')

const logFolder = '.'
const defaultLogFile = new Date().toISOString().replace(/[^0-9]/g, '') + '.txt'

function createFileTransport (filename = defaultLogFile) {
  const filepath = path.resolve(logFolder, filename)
  return {
    write (str) {
      fs.appendFile(filepath, str + '\n', 'utf8', _err => { })
    }
  }
}

const log = new Logger({
  logDest: createFileTransport('log.txt'),
  errDest: createFileTransport('error.txt')
})
const logA = log.useModule('ModuleA').useTempLevel(LOG_LEVEL.ALL)

log.info('some info of main logger')

logA.debug('some debug info')
logA.info('title', 'some info')
logA.warn('warn title', 'some warning message')
logA.error('error title', 'some error info', new ReferenceError('x is not defined'))
