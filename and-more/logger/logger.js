/**
 * Logger
 *
 * Example:
 *
 * ```js
 * const { log } = require('./logger')
 * log.info('test logger')
 * log.info('moduleA', 'log with moduleName')
 * const childLogger = log.child('moduleB')
 * childLogger.info('test child logger')
 * ```
 * It outputs:
 * 2018-12-31 14:17:30.024 INFO []: test logger
 * 2018-12-31 14:17:30.029 INFO [moduleA]: log with moduleName
 * 2018-12-31 14:17:30.029 INFO [moduleB]: test child logger
 */

'use strict'

const LOG_LEVEL = {
  NONE: 6,
  FATAL: 5,
  ERROR: 4,
  WARN: 3,
  INFO: 2,
  DEBUG: 1,
  TRACE: 0,
  ALL: 0
}

const consoleStream = {
  write (str) {
    console.log(str)
  }
}

const getDateString = function (serverTimeOffset = 0) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  const now = new Date(Date.now() - timezoneOffset + serverTimeOffset)
  return now.toISOString().replace(/[TZ]/g, ' ')
}

const stringify = (data, replacer, space) => {
  try {
    return JSON.stringify(data, replacer, space)
  } catch (error) {
    return '[logger-internal-error] failed to serialize the data!'
  }
}

class Logger {
  /**
   * @param {object} options
   * @param {string} [options.module]              module name
   * @param {number} [options.level]               log level
   * @param {{write}|{write}[]} [options.logDest]  where to log info, method `write` is needed
   * @param {{write}|{write}[]} [options.errDest]  where to log error, method `write` is needed
   */
  constructor (options = {}) {
    this.module = ''
    this.level = LOG_LEVEL.INFO
    this.logDest = consoleStream
    this.errDest = consoleStream
    this.config(options)
  }

  /**
   * @param {object} param
   * @param {string} param.level
   * @param {string} param.title
   * @param {string|Object} param.content
   * @param {Error}  [param.err]
   */
  _log ({level, title, content, err}) {
    let str = `${level} [${this.module}] ${title}: `

    if (err) {
      if (content) {
        if (typeof err === 'object' && err.stack) {
          if (err.message) {
            content = content + ', ' + err.message
          }
          str += stringify({message: content, stack: err.stack})
        } else {
          str += stringify({message: content, stack: 'Error: ' + (err.message || err)})
        }
      } else {
        str += stringify({message: err.message, stack: err.stack})
      }
    } else {
      str += stringify(content)
    }
    this._write(level, str)
  }

  _write (level, str) {
    const log = getDateString() + str
    const dest = ['WARN', 'ERROR', 'FATAL'].includes(level) ? this.errDest : this.logDest

    if (Array.isArray(dest)) {
      for (let d of dest) {
        d.write(log)
      }
    } else {
      dest.write(log)
    }
  }

  /**
   * @return {{title: string, content: string, err: any}}
   */
  _normalize (title, content, err) {
    // two arguments, deal with err
    if (err === undefined && content !== undefined) {
      if (content.stack) {
        err = content
        content = title
        title = ''
      }
    }
    // one argument
    if (err === undefined && content === undefined) {
      if (title.stack) {
        err = title
        title = ''
        content = ''
      } else {
        content = title
        title = ''
      }
    }
    return {title, content, err}
  }

  config (options) {
    Object.assign(this, options)
  }

  setLevel (level) {
    this.level = level
  }

  /**
   * @param {string} moduleName
   *
   * @example
   * const childLog = log.useModule('RPC')
   * childLog.info('any title', 'any text')
   * // output: 2019-04-30 16:43:31.501 INFO [RPC] any title: "any text"
   */
  useModule (moduleName) {
    return {
      __proto__: this,
      module: moduleName
    }
  }

  /**
   * @param {number} level  log level
   *
   * @example
   * const log = log.useTempLevel(LOG_LEVEL.ERROR)
   * log.info('this log will be discarded.')
   */
  useTempLevel (level) {
    return {
      __proto__: this,
      level
    }
  }

  debug (title, content) {
    if (this.level <= LOG_LEVEL.DEBUG) {
      const args = this._normalize(title, content)
      this._log({level: 'DEBUG', title: args.title, content: args.content})
    }
  }

  info (title, content) {
    if (this.level <= LOG_LEVEL.INFO) {
      const args = this._normalize(title, content)
      this._log({level: 'INFO', title: args.title, content: args.content})
    }
  }

  log (title, content) {
    this.info(title, content)
  }

  warn (title, content) {
    if (this.level <= LOG_LEVEL.WARN) {
      const args = this._normalize(title, content)
      this._log({level: 'WARN', title: args.title, content: args.content})
    }
  }

  error (title, content, err) {
    if (this.level <= LOG_LEVEL.ERROR) {
      const args = this._normalize(title, content, err)
      this._log({level: 'ERROR', title: args.title, content: args.content, err: args.err})
    }
  }

  fatal (title, content, err) {
    if (this.level <= LOG_LEVEL.FATAL) {
      const args = this._normalize(title, content, err)
      this._log({level: 'FATAL', title: args.title, content: args.content, err: args.err})
    }
  }
}

exports.LOG_LEVEL = LOG_LEVEL
exports.Logger = Logger
exports.log = new Logger()
