import http from 'node:http'
import { fork } from 'node:child_process'
import { dirname } from './utils.js'

http
  .createServer((req, res) => {
    if (req.url === '/block') {
      const childProcess = fork('v2_nonblocking_worker.js', { cwd: dirname() })
      childProcess.on('message', (/** @type {{time: number}} */ msg) =>
        res.end('/block ' + msg.time)
      )
      childProcess.on('error', (err) => res.end('/block ' + err))
    } else {
      res.end('hello v2')
    }
  })
  .listen(3000)
