import http from 'node:http'
import { timeConsumingOperation } from './utils.js'

http
  .createServer((req, res) => {
    if (req.url === '/block') {
      timeConsumingOperation()
      res.end('/block done')
    } else {
      res.end('hello v1')
    }
  })
  .listen(3000)
