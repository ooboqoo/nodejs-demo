import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { Logger, LOG_LEVEL, __test__ } from './logger.js'
const { stringify } = __test__

const logOutput = []
const errOutput = []

const log = new Logger({
  logDest: {
    write(log) {
      logOutput.push(log)
    },
  },
  errDest: {
    write(log) {
      errOutput.push(log)
    },
  },
})

describe('stringify', () => {
  test('can handle circular references', () => {
    const a = {}
    a.self = a
    expect(stringify(a)).toBe('[logger-internal-error] failed to serialize the data!')
  })

  test('can handle common JSON', () => {
    expect(stringify(['a', 1, undefined])).toBe('["a",1,null]')
  })

  test('will transform string', () => {
    expect(stringify('string')).toBe('"string"')
  })
})

describe('log._write()', () => {
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  test('only write info to logOutput', () => {
    log._write('TRACE', 'log')
    log._write('DEBUG', 'log')
    log._write('INFO', 'log')
    expect(logOutput.length).toBe(3)
    expect(errOutput.length).toBe(0)
  })
  test('only write error to errOutput', () => {
    log._write('WARN', 'log')
    log._write('ERROR', 'log')
    log._write('FATAL', 'log')
    expect(logOutput.length).toBe(0)
    expect(errOutput.length).toBe(3)
  })
  test('generate date string as expected', () => {
    log._write('INFO', 'log')
    expect(logOutput[0].length).toBe(27)
    expect(logOutput[0].substring(0, 24)).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} /)
  })
})

describe('log._log()', () => {
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  const $log = {
    __proto__: log,
    _write(level, str) {
      logOutput.push(str)
    },
  }
  test('can generate log without err as expected', () => {
    $log._log({ level: 'INFO', title: '', content: 'my message' })
    expect(logOutput[0]).toBe('INFO  [] : "my message"')
  })
  test('can generate log with err as expected', () => {
    $log._log({ level: 'ERROR', title: '', content: 'my message', err: new Error('error message') })
    expect(logOutput[0].substring(0, 87)).toBe(
      'ERROR [] : {"message":"my message, error message","stack":"Error: error message\\n    at'
    )
  })
  test('can log module name as expected', () => {
    const mLog = {
      __proto__: $log,
      module: 'RPC',
    }
    mLog._log({ level: 'INFO', title: '', content: 'my message' })
    expect(logOutput[0]).toBe('INFO  [RPC] : "my message"')
  })
})

describe('log._normalize()', () => {
  test('can normalize params with err', () => {
    const err = new Error('my error')
    expect(log._normalize(err)).toEqual({ title: '', content: '', err })
    expect(log._normalize('my content', err)).toEqual({ title: '', content: 'my content', err })
    expect(log._normalize('my title', 'my content', err)).toEqual({
      title: 'my title',
      content: 'my content',
      err,
    })
  })

  test('can normalize params with fake Error object', () => {
    const fakeErr1 = { code: 400, message: 'err' }
    expect(log._normalize(fakeErr1)).toEqual({ title: '', content: fakeErr1 })
    expect(log._normalize('my title', 'my content', fakeErr1)).toEqual({
      title: 'my title',
      content: 'my content',
      err: fakeErr1,
    })

    const fakeErr2 = { message: 'fake error', __stack: 'any string' }
    expect(log._normalize(fakeErr2)).toEqual({
      title: '',
      content: '',
      err: { message: 'fake error', stack: 'any string' },
    })
  })

  test('can normalize params without err', () => {
    expect(log._normalize('my content')).toEqual({ title: '', content: 'my content' })
    expect(log._normalize({ message: 'my content' })).toEqual({
      title: '',
      content: { message: 'my content' },
    })
  })
})

describe('log.level', () => {
  const level = log.level
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  afterEach(() => {
    log.setLevel(level)
  })
  test('will filter the logs', () => {
    log.setLevel(LOG_LEVEL.DEBUG)
    log.debug('my message')
    expect(logOutput.length).toBe(1)
    log.setLevel(LOG_LEVEL.INFO)
    log.debug('my message')
    expect(logOutput.length).toBe(1)
    log.info('my message')
    expect(logOutput.length).toBe(2)
  })
})

describe('log.setLevel()', () => {
  const level = log.level
  afterEach(() => {
    log.setLevel(level)
  })
  test('can change the log.level', () => {
    log.setLevel(LOG_LEVEL.INFO)
    expect(log.level).toBe(LOG_LEVEL.INFO)
    log.setLevel(LOG_LEVEL.FATAL)
    expect(log.level).toBe(LOG_LEVEL.FATAL)
  })
})

describe('log.useLevel()', () => {
  const level = log.level
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  afterEach(() => {
    log.setLevel(level)
  })
  test('can temporarily change the log level', () => {
    const childLog = log.useLevel(LOG_LEVEL.ERROR)
    childLog.warn('my warn message')
    expect(errOutput.length).toBe(0)
    childLog.error('my error message')
    expect(errOutput[0].substring(24)).toBe('ERROR [] : "my error message"')
  })
  test('not affect log.level', () => {
    const childLog = log.useLevel(LOG_LEVEL.WARN)
    expect(log.level).toBe(LOG_LEVEL.INFO)
    expect(childLog.level).toBe(LOG_LEVEL.WARN)
  })
})

describe('log.useModule()', () => {
  test('can set module name as expected', () => {
    const mLog = log.useModule('RPC')
    const mmLog = mLog.useModule('Video')
    expect(log.module).toBe('')
    expect(mLog.module).toBe('RPC')
    expect(mmLog.module).toBe('RPC Video')
  })
})

describe('log.info()', () => {
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  test('can log the date string as expected', () => {
    log.info('some info')
    expect(logOutput.length).toBe(1)
    expect(logOutput[0].substring(0, 24)).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} /)
    expect(logOutput[0].substring(24)).toBe('INFO  [] : "some info"')
  })
  test('can log the message content as expected', () => {
    log.info({ message: 'my content' })
    expect(logOutput.length).toBe(1)
    expect(logOutput[0].substring(24)).toBe('INFO  [] : {"message":"my content"}')
  })
})

describe('log.error()', () => {
  beforeEach(() => {
    logOutput.length = 0
    errOutput.length = 0
  })
  test('can log Error object as expected', () => {
    const err = new ReferenceError('x is not defined')
    log.error(err)
    expect(logOutput.length).toBe(0)
    expect(errOutput.length).toBe(1)
    expect(errOutput[0].substring(24, 114)).toBe(
      'ERROR [] : {"message":"x is not defined","stack":"ReferenceError: x is not defined\\n    at'
    )
    log.error('my title', 'my content', err)
    expect(errOutput[1].substring(24, 109)).toBe(
      'ERROR [] my title: {"message":"my content, x is not defined","stack":"ReferenceError:'
    )
  })
  test('can log fake Error object as expected', () => {
    log.error({ message: 'my error message' })
    expect(logOutput.length).toBe(0)
    expect(errOutput.length).toBe(1)
    expect(errOutput[0].substring(24)).toBe('ERROR [] : {"message":"my error message"}')
  })
  test('can log error string as expected', () => {
    log.error('my error message')
    log.error('my title', 'my error message')
    log.error('my title', 'my content', 'my error message') // NOT SUPPORT! 'my content' will be discarded
    expect(logOutput.length).toBe(0)
    expect(errOutput.length).toBe(3)
    expect(errOutput[0].substring(24)).toBe('ERROR [] : "my error message"')
    expect(errOutput[1].substring(24)).toBe('ERROR [] my title: "my error message"')
    expect(errOutput[2].substring(24)).toBe(
      'ERROR [] my title: {"message":"my content","stack":"Error: my error message"}'
    )
  })
})
