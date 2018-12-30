/*
POST / HTTP/1.1
Host:           <UpHost>
Content-Type:   multipart/form-data; boundary=<frontier>
Content-Length: <multipartContentLength>
--<frontier>
Content-Disposition:       form-data; name="key"
<resource_key>
--<frontier>
Content-Disposition:       form-data; name="token"
<upload_token>
--<frontier>
Content-Disposition:       form-data; name="file"; filename="<fileName>"
Content-Type:              application/octet-stream
Content-Transfer-Encoding: binary
<fileBinaryData>
--<frontier>--
*/

const http = require('http')
const fs = require('fs')
const { URL } = require('url')

const boundary = 'boundary' + (Math.random() * 1e6 | 0)

function dataToBody (data) {
  let body = ''
  Object.keys(data).forEach(field => {
    body += '--' + boundary + '\r\n'
    body += 'Content-Disposition: form-data; name="' + field + '";\r\n\r\n'
    body += data[field] + '\r\n'
  })
  return body
}

/**
 * 采用 Stream 方式上传文件到远端 Http 服务器
 * @param {string} url      服务器地址
 * @param {string} filePath 待上传的文件的完整路径，含文件名
 * @param {string} fileName 提供给服务器的文件名
 * @param {Object} [data]   附加表单项
 * @param {Function} [onProgress] 处理上传进度的函数
 */
exports.uploadFile = (url, filePath, fileName, data, onProgress) => {
  if (!fileName) { fileName = String(Math.random() * 1e6 | 0) }
  if (onProgress && typeof onProgress !== 'function') {
    return Promise.reject(new Error('onProgress is not a function'))
  }

  let _url
  try {
    _url = new URL(url)
  } catch (error) {
    return Promise.reject(error)
  }
  const options = {
    protocol: _url.protocol,
    hostname: _url.hostname,
    port: _url.port,
    path: _url.pathname + _url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary
    }
  }

  let stat
  let body = ''
  let tail = '\r\n--' + boundary + '--'
  if (data) { body += dataToBody(data) }
  body +=
    '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name="file"; filename=' + fileName + '\r\n' +
    'Content-Type: application/octet-stream\r\n' +
    'Content-Transfer-Encoding: binary\r\n\r\n'
  try {
    stat = fs.statSync(filePath)
  } catch (error) {
    return Promise.reject(error)
  }
  options.headers['Content-Length'] = Buffer.byteLength(body) + stat.size + tail.length

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = []
      res.setEncoding('utf8')
      res.on('data', (chunk) => { chunks.push(chunk) })
      res.on('end', () => {
        let data = chunks.join('')
        try {
          data = JSON.parse(data)
        } catch (error) { }
        resolve(data)
      })
    })
    req.on('error', (err) => { reject(err) })

    let uploaded = 0
    const stream = fs.createReadStream(filePath)
    stream.on('data', chunk => {
      uploaded += chunk.byteLength
      if (onProgress) {
        onProgress(uploaded / stat.size * 100 | 0)
      }
    })

    req.write(body)
    stream.pipe(req, {end: false})
    stream.on('end', () => {
      req.end(tail)
    })
  })
}
