const Logger = require('./logger')

const logger = new Logger()
const childLogger = logger.child('ChildModule')

logger.info('some info')
logger.info('moduleA', 'moduleA info')
logger.error('moduleB', 'something error in moduleB')
childLogger.info('child module info')
