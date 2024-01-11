/*!
 * https://github.com/visionmedia/node-progress/blob/master/lib/node-progress.js
 */

import { stdout } from 'node:process'
import { Readline } from 'node:readline/promises'

/**
 * @typedef {object} ProgressBarOptions
 * @property {number} [curr] - Current completed index
 * @property {number} total - Total number of ticks to complete
 * @property {boolean} [clear] - If the progress bar should be cleared upon termination or not
 * @property {string} [completeSign] - Completion character defaulting to ">"
 * @property {string} [incompleteSign] - Incomplete character defaulting to "-"
 * @property {NodeJS.WriteStream} [stream] - The output stream defaulting to stdout
 */

export class ProgressBar {
  /** @type {number} */
  #curr
  /** @type {NodeJS.WriteStream} */
  #stream
  /** @type {Readline} */
  #readline
  /** @type {string} */
  #completeSign
  /** @type {string} */
  #incompleteSign

  /** @type {number} */
  total = 0
  /** @type {boolean} */
  clear = false

  /**
   * @param {number|ProgressBarOptions} [options] - Total number of ticks to complete
   */
  constructor(options = 100) {
    if (typeof options === 'number') {
      options = { total: options }
    }

    this.#stream = options.stream || stdout
    this.#readline = new Readline(this.#stream, { autoCommit: false })
    this.#completeSign = options.completeSign || '>'
    this.#incompleteSign = options.incompleteSign || '-'
    this.#curr = options.curr || 0
    this.total = options.total
    this.clear = options.clear || false
  }

  /**
   * Render the progress bar
   */
  #render() {
    const arr = new Array(this.total + 2)
    arr[0] = ['/', '-', '\\', '|'][this.#curr % 4]
    arr[1] = ' '
    arr.fill(this.#completeSign, 2, this.#curr + 3)
    arr.fill(this.#incompleteSign, this.#curr + 3)
    return arr.join('') + ` ${this.#curr}%`
  }

  /**
   * Start(show) the progress bar
   * @param {number} [percentage] - Current progress value (between 0 and 100)
   */
  start(percentage) {
    if (percentage) {
      this.#curr = percentage
    }
    this.#stream.write(this.#render())
  }

  /**
   * Update the progress bar of current percentage
   * @param {number} percentage - Current progress value (between 0 and 100)
   */
  async update(percentage) {
    this.#curr = percentage
    this.#readline.cursorTo(0)
    this.#readline.clearLine(0).commit()
    this.#stream.write(this.#render())
    this.#readline.cursorTo(0).commit()
  }

  /**
   * Terminate the progress bar
   * @param {boolean} [clear] - Clear the progress bar
   */
  stop(clear) {
    if (clear ?? this.clear) {
      this.#readline.cursorTo(0)
      this.#readline.clearLine(0).commit()
    } else {
      this.#stream.write('\n')
    }
  }
}

export default ProgressBar
