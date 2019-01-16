const {runTest, getRandomArray} = require('./utils')

let arr = getRandomArray()

runTest('直接读arr.length', () => { // 2.1 ms
  for (let i = 0; i < arr.length; i++) { }
})

runTest('缓存arr.length', () => { // 1.9 ms, 基本没啥影响，极细微的优化
  for (let i = 0, length = arr.length; i < length; i++) { }
})
