import { createConnection } from 'node:net'

const pipeName = 'mypipe'
const pipePath = '\\\\.\\pipe\\' + pipeName

const log = (...args) => {
  console.log('[Client]', ...args)
}

const client = createConnection(pipePath, () => {
  log('on connection')
})

client.on('data', (buffer) => {
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
      log('on data:', item)
    })
})

client.on('end', () => {
  log('on end')
})

// Send message to server
;(function send() {
  const next = Math.round(Math.random() * 5)
  if (next < 5) {
    client.write(JSON.stringify({ message: `next message in ${next}s` }))
    setTimeout(send, next * 1000)
  } else {
    client.write(JSON.stringify({ message: 'bye' }))
    client.end()
  }
})()
