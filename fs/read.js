const fs = require('fs')
const {promisify} = require('util')

const read = promisify(fs.readFile)

async function readFile (name) {
  const data = await read(name, {encoding: 'utf8'})
  return data
}

readFile('./nodejs/temp.js')
  .then(data => console.log(data))
