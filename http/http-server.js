import { createServer } from 'node:http'

const hostname = '127.0.0.1'
const port = 3000

const server = createServer((req, res) => {
  res.statusCode = 200

  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.end()
    return
  }

  console.log('\n%s %s', req.method, req.url)

  for (const key in req.headers) {
    console.log(key + ': ' + req.headers[key])
  }

  req.on('data', (chunk) => {
    console.log('\n', chunk.toString())
  })

  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello Node.js')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
