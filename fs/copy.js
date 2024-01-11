import { readFile, writeFile } from 'node:fs/promises'
import { createReadStream, createWriteStream } from 'node:fs'

async function copyBuffer(src, dest) {
  const buffer = await readFile(src)
  return writeFile(dest, buffer)
}

function copyStream(src, dest) {
  return createReadStream(src).pipe(createWriteStream(dest))
}

function testBuffer() {
  const start = Date.now()
  copyBuffer(process.argv[2], 'b-' + process.argv[3]).then(
    () => {
      console.log(`copyBuffer finished, time elapse: ${Date.now() - start} ms`)
    },
    (err) => {
      console.error('Error in copyBuffer. ', err) // will catch all errors within the scope of copyBuffer
    }
  )
}

function testStream() {
  const start = Date.now()
  copyStream(process.argv[2], 's-' + process.argv[3])
    .on('finish', () => {
      console.log(`copyStream finished, time elapse: ${Date.now() - start} ms`)
    })
    .on('error', (err) => {
      console.error('Error in copyStream', err) // can only catch errors in the writeStream, not the readStream
    })
}

testBuffer()
testStream()

/*
Test copying a 5GB file
  * copyBuffer reports an error, the file size cannot exceed the maximum possible Buffer size 0x7fffffff bytes  // That is, the maximum limit is 2G
  * copyStream takes 36580 ms

Test copying a 1GB file
  * copyBuffer takes 10003 ms
  * copyStream takes 1362 ms

Other notes
  * When copying files, if a file with the same name is encountered, it will be directly overwritten
*/
