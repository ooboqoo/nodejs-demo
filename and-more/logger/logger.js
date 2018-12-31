/**
 * Logger
 *
 * References:
 *   - https://github.com/guigrpa/storyboard
 *
 * Example:
 *
 * ```js
 * const Logger = require('./logger')
 * const logger = new Logger()
 * logger.info('test logger')
 * logger.info('moduleA', 'log with moduleName')
 * const childLogger = logger.child('moduleB')
 * childLogger.info('test child logger')
 * ```
 * It outputs:
 * 2018-12-31 14:17:30.024  []  INFO  "test logger"
 * 2018-12-31 14:17:30.029  [moduleA]  INFO  "log with moduleName"
 * 2018-12-31 14:17:30.029  [moduleB]  INFO  "test child logger"
 */

'use strict'

const now = function () {
  const now = new Date(Date.now() + 28800000) // GMT+0800
  return now.toISOString().replace('T', ' ').replace('Z', '')
}
const stringify = (data, replacer, space) => {
  try {
    return JSON.stringify(data, replacer, space)
  } catch (error) {
    return '[logger-internal-error] failed to serialize the data!'
  }
}
const wirteLogToStreams = (log, streams) => {
  if (Array.isArray(streams)) {
    for (let stream of streams) {
      stream.wirte(log)
    }
  } else {
    streams.write(log)
  }
}

const consoleStream = {
  write (log) {
    console.log(log)
  }
}

module.exports = class Logger {
  /**
   * Options:
   * - mode  'development' or 'production'
   * - infoStream  where to log info, method `write` is needed
   * - errorStream  where to log error, method `write` is needed
   */
  constructor (options) {
    this.mode = 'development' // or 'production'
    this.infoStream = consoleStream
    this.errorStream = consoleStream
    this.config(options)
  }

  config (options) {
    Object.assign(this, options)
  }

  child (moduleName) {
    return new Proxy(this, {
      get (target, key, receiver) {
        return (...args) => {
          target[key](moduleName, ...args)
        }
      }
    })
  }

  trace (moduleName, data) {
    if (this.mode === 'production') { return }
    console.trace('[' + moduleName + '] ', data)
  }

  debug (moduleName, data) {
    if (this.mode === 'production') { return }
    console.debug('[' + moduleName + '] ', data)
  }

  info (moduleName, data) {
    this._write('INFO', moduleName, data)
  }

  warn (moduleName, data) {
    this._write('WARN', moduleName, data)
  }

  error (moduleName, data) {
    this._write('ERROR', moduleName, data)
  }

  fatal (moduleName, data) {
    this._write('FATAL', moduleName, data)
  }

  _write (level, moduleName, data) {
    if (typeof data === 'undefined') {
      data = moduleName
      moduleName = ''
    }
    const log = `${now()}  [${moduleName}]  ${level}  ` + stringify(data)
    wirteLogToStreams(log, level === 'INFO' ? this.infoStream : this.errorStream)
  }
}
