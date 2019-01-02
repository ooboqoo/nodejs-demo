const http = require('http')

const hostname = '0.0.0.0'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200

  // 提供跨域访问支持
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.end()
    return
  }

  for (let key in req.headers) {
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
