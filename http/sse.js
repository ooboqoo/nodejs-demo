import { createServer } from 'node:http'

const hostname = '127.0.0.1'
const port = 3000

/**
 * Keep a map of attached clients
 * @type {Map<number, import("http").ServerResponse>}
 */
const clients = new Map()
let clientIDSeed = 0
let waiting = true

const clientHTML = `
<!DOCTYPE html>
<html>
  <body>
  <script>
    let source = new EventSource('/events/')
    source.onmessage = function(e) {
      document.body.innerHTML += e.data + '<br>'
    }
  </script>
  </body>
</html>`

const generateRandomNumber = (width = 6) => {
  const max = Math.pow(10, width)
  const min = Math.pow(10, width - 1)
  return Math.floor(Math.random() * (max - 1 - min)) + min
}

const server = createServer((req, res) => {
  console.log(req.method, req.url)
  res.statusCode = 200

  if (req.url === '/') {
    res.end(clientHTML)
  } else if (req.url === '/events/') {
    req.socket.setTimeout(600_000) // 32-bit signed integer
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.write('\n')
    ;(function (clientID) {
      clients.set(clientID, res)
      waiting = false
      req.on('close', function () {
        clients.delete(clientID)
      })
    })(++clientIDSeed)
  } else {
    res.statusCode = 404
    res.end('Page Not Find.')
  }
})

server.on('error', (err) => {
  console.log('Failed to start server: \n', err)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
  console.log('Waiting for connections...')
})

setInterval(function () {
  if (clients.size === 0) {
    if (!waiting) {
      console.log('Waiting for connections...')
      waiting = true
    }
    return
  }
  const msg = generateRandomNumber()
  console.log('clients: ' + Array.from(clients.keys()) + ' <- ' + msg)
  for (const c of clients.values()) {
    c.write('data: ' + msg + '\n\n')
  }
}, 2000)
