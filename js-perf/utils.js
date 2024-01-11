/**
 * Run a test
 * @param {string} title
 * @param {Function} fn
 * @param {number} times
 */
export function runTest(title, fn, times = 1000) {
  console.time(title)
  while (times--) {
    fn()
  }
  console.timeEnd(title)
}

/**
 * Generate a random array
 * @param {number} length
 */
export function generateRandomArray(length = 1000) {
  return Array.from({ length }, () => Math.floor(Math.random() * 1000))
}

/**
 * Generate a serial array
 * @param {number} length
 */
export function generateSerialArray(length = 1000) {
  return Array.from({ length }, (_, i) => i)
}
