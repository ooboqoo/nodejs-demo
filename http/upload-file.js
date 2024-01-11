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

import http from 'node:http'
import { statSync, createReadStream } from 'node:fs'
import { URL } from 'node:url'

const boundary = 'boundary' + ((Math.random() * 1e6) | 0)

/**
 * Convert form data to body
 * @param {Record<string, string|number>} data
 */
function dataToBody(data) {
  return Object.keys(data)
    .map(
      (field) =>
        `\n--${boundary}\nContent-Disposition: form-data; name="${field}"\n\n${data[field]}\n`
    )
    .join('')
}

/**
 * Upload a file to a remote HTTP server using Stream
 * @param {string} url      Server address
 * @param {string} filePath The full path of the file to be uploaded
 * @param {string} fileName The file name provided to the server
 * @param {Record<string, string|number>} [data]   Additional form items
 * @param {(v: number) => void} [onProgress] Function to handle upload progress
 */
export function uploadFile(url, filePath, fileName, data, onProgress) {
  if (!fileName) {
    fileName = String((Math.random() * 1e6) | 0)
  }
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
    method: 'POST',
    protocol: _url.protocol,
    hostname: _url.hostname,
    port: _url.port,
    path: _url.pathname + _url.search,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
    },
  }

  let body = ''
  const tail = '\n--' + boundary + '--'
  if (data) {
    body += dataToBody(data)
  }
  body += `
--${boundary}
Content-Disposition: form-data; name="file"; filename=${fileName}
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary

`
  let stat
  try {
    stat = statSync(filePath)
  } catch (error) {
    return Promise.reject(error)
  }
  options.headers['Content-Length'] = Buffer.byteLength(body) + stat.size + tail.length

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = []
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        let data = chunks.join('')
        try {
          data = JSON.parse(data)
        } catch (error) {}
        resolve(data)
      })
    })
    req.on('error', (err) => {
      reject(err)
    })

    let uploaded = 0
    const stream = createReadStream(filePath)
    stream.on('data', (/** @type {Buffer} */ chunk) => {
      uploaded += chunk.byteLength
      if (onProgress) {
        onProgress(((uploaded / stat.size) * 100) | 0)
      }
    })

    req.write(body)
    stream.pipe(req, { end: false })
    stream.on('end', () => {
      req.end(tail)
    })
  })
}

export default uploadFile

export const __test__ = { dataToBody, boundary }
