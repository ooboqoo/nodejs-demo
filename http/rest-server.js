const http = require('http')

const HOSTNAME = '127.0.0.1'
const PORT = 3000

let id = 0
const todos = [
  {id: ++id, title: 'first todo item'}
]

const server = http.createServer((req, res) => {
  console.log(req.url)
  res.statusCode = 200

  // 提供跨域访问支持
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.end()
    return
  }

  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'POST') {
    if (req.url.match(/\/todos/i)) {
      let rawData = ''
      req.on('data', (chunk) => { rawData += chunk })
      req.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          parsedData.id = ++id
          todos.push(parsedData)
          res.end(JSON.stringify(parsedData))
        } catch (error) {
          console.error(error)
        }
      })
    } else {
      res.statusCode = 404
      res.end('Page Not Find.')
    }
  } else if (req.method === 'GET') {
    if (req.url.match(/\/todos\/?$/)) {
      res.end(JSON.stringify(todos))
    } else if (req.url.match(/\/todos\/\d+/i)) {
      const id = +req.url.match(/\/todos\/(\d+)/i)[1]
      let todo
      for (let it of todos) {
        if (it.id === id) {
          todo = it
          break
        }
      }
      if (todo) {
        res.end(JSON.stringify(todo))
      } else {
        res.statusCode = 204
        res.end('No Content')
      }
    } else {
      res.statusCode = 404
      res.end('Page Not Find.')
    }
  }
})

server.on('error', (err) => {
  console.log('Failed to start server: \n', err)
})

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
