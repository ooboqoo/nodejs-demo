import { createServer } from 'node:http'

const hostname = '127.0.0.1'
const port = 3000

let seed = 0
const todos = [{ id: ++seed, title: 'first todo item' }]

const server = createServer((req, res) => {
  console.log(req.method, req.url)
  res.statusCode = 200

  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.end()
    return
  }

  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    if (req.url.match(/\/todos\/?$/)) {
      res.end(JSON.stringify(todos))
    } else if (req.url.match(/\/todos\/\d+/i)) {
      const id = +req.url.match(/\/todos\/(\d+)/i)[1]
      let todo
      for (const item of todos) {
        if (item.id === id) {
          todo = item
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

  if (req.method === 'POST') {
    if (req.url.match(/\/todos/i)) {
      let rawData = ''
      req.on('data', (chunk) => {
        rawData += chunk
      })
      req.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          const item = Object.assign({ id: ++seed }, parsedData)
          todos.push(item)
          res.end(JSON.stringify(item))
        } catch (error) {
          console.error(error)
        }
      })
    } else {
      res.statusCode = 404
      res.end('Page Not Find.')
    }
  }
})

server.on('error', (err) => {
  console.log('Failed to start server: \n', err)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
