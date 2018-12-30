const net = require('net')

const PIPE_NAME = 'mypipe'
const PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME

const log = console.log

const client = net.connect(PIPE_PATH, function () {
  log('Client: on connection')
})

client.on('data', function (buffer) {
  const data = buffer.toString()
  // 校验消息并处理消息粘连
  if (data[0] !== '{' || data[data.length - 1] !== '}') { return }
  data.split('}{').map((item, index, arr) => {
    if (arr.length === 1) { return item }
    switch (true) {
      case index === 0: item += '}'; break
      case index === arr.length - 1: item = '{' + item; break
      default: item = '{' + item + '}'
    }
    return item
  }).forEach(item => {
    log('Client: on data:', item.toString(), '\n', item)
  })
})

client.on('end', function () {
  log('Client: on end')
})

;(function send () {
  const next = Math.round(Math.random() * 5)
  client.write(JSON.stringify({message: `next message in ${next}s`}))
  client.write(JSON.stringify({message: `next message in ${'' + next + next}s`}))
  if (next < 5) {
    setTimeout(send, next * 1000)
  } else {
    client.end()
  }
})()
