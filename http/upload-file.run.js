/**
 * 使用七牛云验证文件上传功能
 *
 * ```bash
 * $ node upload-to-qiniu.js d:\123.txt
 * ```
 */

const { uploadFile } = require('./upload-file')
const ProgressBar = require('../readline/progress-bar')

const filePath = process.argv[2]
const fileName = process.argv[3]

const url = 'http://upload.qiniup.com'
// token 每次测试都要重新生成 http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken
const token = 'o_AcWBA7TXcQbtGDH0jW-3GPwFFkO--Bvr2Kc3Mb:5JXBROUhBmmf4hSuqUcWbdFz6hk=:eyJzY29wZSI6ImRlbW8iLCJkZWFkbGluZSI6MTU0NjEyMDU0NX0='

const bar = new ProgressBar(100)
bar.start()

uploadFile(
  url,
  filePath,
  fileName,
  {token},
  (percentage) => {
    bar.update(percentage)
    if (percentage === 100) {
      bar.stop()
    }
  }
).then(data => {
  if (data.error) { throw data }
  console.log('[upload sucess] ', data)
}).catch(error => {
  console.error('[upload fail] ', error)
})
