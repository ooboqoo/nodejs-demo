const http = require('http')

const HOSTNAME = '127.0.0.1'
const PORT = 3000

var clientId = 0
var clients = {} // Keep a map of attached clients

const template = `
<!DOCTYPE html>
<html>
  <body>
  <script>
    var source = new EventSource('/events/')
    source.onmessage = function(e) {
      document.body.innerHTML += e.data + '<br>'
    }
  </script>
  </body>
</html>`

const server = http.createServer((req, res) => {
  console.log(req.url)
  res.statusCode = 200

  if (req.url === '/') {
    res.end(template)
  } else if (req.url === '/events/') {
    req.socket.setTimeout(Number.MAX_VALUE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream', // <- Important headers
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    res.write('\n');
    (function (clientId) {
      clients[clientId] = res
      req.on('close', function () {
        delete clients[clientId]
      })
    })(++clientId)
  } else {
    res.statusCode = 404
    res.end('Page Not Find.')
  }
})

server.on('error', (err) => {
  console.log('Failed to start server: \n', err)
})

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})

setInterval(function () {
  const msg = Math.random()
  console.log('Clients: ' + Object.keys(clients) + ' <- ' + msg)
  for (let clientId in clients) {
    clients[clientId].write('data: ' + msg + '\n\n')
  }
}, 2000)
