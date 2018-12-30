const net = require('net')

const PIPE_NAME = 'mypipe'
const PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME

const log = console.log

const server = net.createServer(function (socket) {
  log('Server: on connection')

  socket.on('data', function (buffer) {
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
      log('Server: on data:', item.toString())
      socket.write(item.toString())
    })
  })

  socket.on('end', function () {
    log('Server: on end')
  })
})

server.on('close', function () {
  log('Server: on close')
})

server.listen(PIPE_PATH, function () {
  log('Server: on listening')
})
