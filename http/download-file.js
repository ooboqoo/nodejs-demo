/*!
 * 文件下载模块，支持分片下载和断点续传
 */

// https://segmentfault.com/a/1190000016704648
// https://www.cnblogs.com/zhaopei/p/download.html

const path = require('path')
const fs = require('fs')
const http = require('http')

/**
 * 下载单个分片
 */
function downloadChunk (url, fd, start, onProgress) {
  const dest = fs.createWriteStream('', {fd, start})
  const req = http.get(url, res => {
    res.pipe(dest)
    res.on('data', chunk => {
      
    })
  })
  // 断点续传
  req.on('error', err => {

  })
}

function slice () {

}

/**
 * 下载单个文件，支持分片下载和断点续传
 * @param {string}   url           下载地址
 * @param {string}   filePath      本地保存用完整路径，含文件名
 * @param {boolean}  [thread]      分片数量
 * @param {Function} [onProgress]  处理下载进度的函数
 */
exports.downloadFile = (url, filePath, thread, onProgress) => {
  if (typeof thread === 'function') {
    onProgress = thread
    thread = undefined
  }
  if (!thread) {
    downloadChunk(url, filePath, 0, '', onProgress)
  } else {

  }
  const dest = fs.createWriteStream(filePath)

}