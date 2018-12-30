const ProgressBar = require('./progress-bar')

let progress = 0
const total = 100
const bar = new ProgressBar(total)
function tick () {
  setTimeout(() => {
    bar.update(progress++)
    if (progress === total) {
      bar.update(total)
      bar.stop()
    } else {
      tick()
    }
  }, Math.random() * 250 | 0)
}

bar.start()
tick()
