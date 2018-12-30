const {Transform} = require('stream')

process.stdin
  .pipe(new Transform({
    transform (chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase())
      callback(null, chunk.toString().toLowerCase())
    }
  }))
  .on('data', data => console.log(data))
  .pipe(process.stdout)
