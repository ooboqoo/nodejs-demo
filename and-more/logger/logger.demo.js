const { Logger } = require('./logger')

const log = new Logger()

log.info('some info')
log.info('moduleA', 'moduleA info')
log.error('moduleB', 'something error in moduleB')
