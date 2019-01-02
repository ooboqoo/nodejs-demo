/*!
 * https://github.com/visionmedia/node-progress/blob/master/lib/node-progress.js
 */

const readline = require('readline')

let i = 0

/**
 * Render the progress bar
 */
function render (bar) {
  const arr = new Array(bar.total + 2).fill(bar.incomplete)
  arr[0] = ['/', '-', '\\', '|'][i++ % 4]
  arr[1] = ' '
  arr.fill(bar.complete, 2, bar.curr + 3)
  return arr.join('') + ` ${bar.curr}%`
}

module.exports = class ProgressBar {
  /**
   * Options:
   *   - `total` total number of ticks to complete
   *   - total number of ticks to complete
   *   - `clear` will clear the progress bar upon termination
   *
   * @param {object|number} options or total
   */
  constructor (options = {}) {
    if (typeof options === 'number') {
      options = {total: options}
    }

    this.stream = options.stream || process.stdout
    this.curr = options.curr || 0
    this.total = options.total
    this.width = options.width || this.total
    this.clear = options.clear || false
    this.complete = options.complete || '>'
    this.incomplete = options.incomplete || '-'
  }

  /**
   * Start(show) the progress bar.
   * @param {number} [percentage] current progress value (between 0 and 100)
   */
  start (percentage) {
    if (percentage) {
      this.curr = percentage
    }
    this.stream.write(render(this))
  }

  /**
   * Update the progress bar of current percentage.
   * @param {number} percentage current progress value (between 0 and 100)
   */
  update (percentage) {
    this.curr = percentage
    readline.clearLine(this.stream, 0)
    readline.cursorTo(this.stream, 0)
    this.stream.write(render(this))
    readline.cursorTo(this.stream, 0)
  }

  /**
   * Terminate the progress bar.
   * @param {boolean} [clear] clear the progress bar
   */
  stop (clear) {
    if (typeof clear !== 'undefined') {
      this.clear = clear
    }
    if (this.clear) {
      readline.clearLine(this.stream, 0)
      readline.cursorTo(this.stream, 0)
    } else {
      this.stream.write('\n')
    }
  }
}
