import cluster from 'node:cluster'
import http from 'node:http'
import { availableParallelism } from 'node:os'
import process from 'node:process'

const numCPUs = availableParallelism()

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end(`[${process.pid}] hello world`)
      // Exit after handling one request, just for testing
      process.exit()
    })
    .listen(3000)

  console.log(`Worker ${process.pid} started`)
}
