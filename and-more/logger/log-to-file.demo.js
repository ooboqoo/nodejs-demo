const fs = require('fs')
const path = require('path')

const { Logger } = require('./logger')

const logFolder = '.'
const defaultLogFile = new Date().toISOString().replace(/[^0-9]/g, '') + '.txt'

function createFileTransport (filename = defaultLogFile) {
  const filepath = path.resolve(logFolder, filename)
  return {
    write (str) {
      fs.appendFile(filepath, str, 'utf8', _err => { })
    }
  }
}

const log = new Logger({
  logDest: createFileTransport('log.txt'),
  errDest: createFileTransport('error.txt')
})

log.info('some info')
log.info('moduleA', 'moduleA info')
log.error('moduleB', 'something error in moduleB')
