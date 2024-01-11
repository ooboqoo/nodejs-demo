import { createServer } from 'node:net'

const pipeName = 'mypipe'
const pipePath = '\\\\.\\pipe\\' + pipeName

const log = (...args) => {
  console.log('[Server]', ...args)
}

const server = createServer((socket) => {
  log('on connection')

  socket.on('data', (buffer) => {
    const data = buffer.toString()
    // Validate message and handle message concatenation
    if (data[0] !== '{' || data.at(-1) !== '}') {
      return
    }
    data
      .split('}{')
      .map((item, index, arr) => {
        if (arr.length === 1) {
          return item
        }
        switch (true) {
          case index === 0:
            item += '}'
            break
          case index === arr.length - 1:
            item = '{' + item
            break
          default:
            item = '{' + item + '}'
        }
        return item
      })
      .forEach((item) => {
        log('on data:', item.toString())
        socket.write(item.toString())
      })
  })

  socket.on('end', () => {
    log('on end')
  })
})

server.on('close', () => {
  log('on close')
})

server.listen(pipePath, () => {
  log('on listening')
})
