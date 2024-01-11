import { createInterface } from 'node:readline'
import ProgressBar from './progress-bar.js'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
})
const total =
  Number(
    await new Promise((resolve) => {
      readline.question('input the total number [0, 100]: ', (answer) => {
        readline.close()
        resolve(answer)
      })
      readline.write('100')
    })
  ) || 100

const bar = new ProgressBar(total)
let progress = 0

bar.start()
;(function tick() {
  setTimeout(() => {
    bar.update(progress++)
    if (progress === total) {
      bar.update(total)
      bar.stop()
    } else {
      tick()
    }
  }, (Math.random() * 250) | 0)
})()
