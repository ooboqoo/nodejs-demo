import { log, Logger, LOG_LEVEL } from './logger.js'

log.setLevel(LOG_LEVEL.ALL)
log.trace('my TRACE message')
log.debug('my DEBUG message')
log.info('my INFO message')
log.info('my title', 'my INFO message')
log.info({ message: 'my object message' })
log.warn('my WARN message')
log.error('my ERROR message')
log.error('my title', 'my ERROR message')
log.error('my title', { message: 'my ERROR message' })
log.error('my title', new Error('my error message'))
log.fatal(new Error('my error message'))

// log.useModule
const cLog = log.useModule('ModuleA')
cLog.info('test child logger')

// log.useLevel
const mLog = log.useLevel(LOG_LEVEL.WARN)
mLog.info('this INFO message will be discarded')
mLog.warn('and this WARN message will be recorded ')

// log.useLevel + log.useModule
const mcLog = cLog.useLevel(LOG_LEVEL.DEBUG)
mcLog.debug('this is a DEBUG message')

// Create new logger instance
const myLog = new Logger({
  errDest: {
    write(str) {
      console.log('fake error.txt', str)
    },
  },
})
myLog.info('this will lost because "logDest" is not provided (though you can see this in console)')
myLog.warn('some WARN message')
myLog.error(new Error('my error message'))
