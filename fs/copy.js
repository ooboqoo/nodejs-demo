const fs = require('fs')
const promisify = require('util').promisify

const readFile = promisify(fs.readFile)
const witeFile = promisify(fs.writeFile)

async function copyBuffer (src, dest) {
  const buffer = await readFile(src)
  return witeFile(dest, buffer)
}

function copyStream (src, dest) {
  return fs.createReadStream(src).pipe(fs.createWriteStream(dest))
}

function testBuffer () {
  const start = Date.now()
  copyBuffer(process.argv[2], 'b-' + process.argv[3]).then(
    data => {
      console.log(`copyBuffer finished, time elapse: ${Date.now() - start} ms`)
    },
    err => {
      console.error('Error in copyBuffer. ', err) // 这里能捕捉到整个 copyBuffer 范围的错误
    }
  )
}

function testStream () {
  const start = Date.now()
  copyStream(process.argv[2], 's-' + process.argv[3])
    .on('finish', () => {
      console.log(`copyStream finished, time elapse: ${Date.now() - start} ms`)
    })
    .on('error', err => {
      console.error('Error in copyStream', err) // 这里只能捕捉到可写流的错误，可读流的错误要单独捕捉
    })
}

testBuffer()
testStream()

/*
测试拷贝 5G 的文件
  * copyBuffer 报错，文件尺寸不能超过最大可能 Buffer 尺寸 0x7fffffff btyes  // 也就是最大限制 2G
  * copyStream 耗时 36580 ms

测试拷贝 1G 的文件
  * copyBuffer 10003 ms
  * copyStream 1362 ms

其他说明
  * 拷贝文件时，遇重名文件会直接覆盖
*/
