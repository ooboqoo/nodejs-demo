import { fork } from 'node:child_process'

const childProcess = fork('fork_child.js')
childProcess.on('message', (data) => console.log('[main receive]', data))
childProcess.send('message from main')
