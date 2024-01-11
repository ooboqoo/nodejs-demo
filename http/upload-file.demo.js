/**
 * Verify functionality by uploading a file to the Qiniu Cloud
 *
 * ```bash
 * $ node upload-file.demo.js d:\123.txt
 * ```
 */

import { uploadFile } from './upload-file.js'
import ProgressBar from '../readline/progress-bar.js'

const filePath = process.argv[2]
const fileName = process.argv[3]

const url = 'http://upload.qiniup.com'
// Token needs to be regenerated for each test: http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken
const token =
  'o_AcWBA7TXcQbtGDH0jW-3GPwFFkO--Bvr2Kc3Mb:5JXBROUhBmmf4hSuqUcWbdFz6hk=:eyJzY29wZSI6ImRlbW8iLCJkZWFkbGluZSI6MTU0NjEyMDU0NX0='

const bar = new ProgressBar()
bar.start()

uploadFile(url, filePath, fileName, { token }, (percentage) => {
  bar.update(percentage)
  if (percentage === 100) {
    bar.stop()
  }
})
  .then((data) => {
    if (data.error) {
      throw data
    }
    console.log('[upload success]', data)
  })
  .catch((err) => {
    console.error('[upload fail]', err)
  })
