const http = require('http')

const url = 'http://127.0.0.1:3000'

http.get(url + '/todos', (res) => {
  const { statusCode } = res
  const contentType = res.headers['content-type']

  let error
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`)
  }
  if (error) {
    console.error(error.message)
    res.resume()  // consume response data to free up memory
    return
  }
  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => { rawData += chunk })
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData)
      console.log(parsedData)
    } catch (e) {
      console.error(e.message)
    }
  })
}).on('error', (err) => {
  console.error(err)
})

const postData = JSON.stringify({
  title: 'new todo item'
})

const postOptions = {
  method: 'POST',
  hostname: '127.0.0.1',
  port: 3000,
  path: '/todos',
  headers: {
    'Content-Type': 'application/json'
  }
}

const req = http.request(postOptions, (res) => {
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`)
  })
  res.on('end', () => {
    console.log('No more data in response.')
  })
})
req.on('error', (err) => {
  console.error(err)
})
req.write(postData)
req.end()
