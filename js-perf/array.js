const {runTest} = require('./utils')

runTest('递增赋值', getArray1)    // 8.383 ms
runTest('递增赋值new', getArray)  // 3.604 ms，知道长度的话，先 new Array(length) 新建再赋值，递增、递减赋值基本没差别
runTest('递减赋值', getArray3)    // 5.307 ms
runTest('递减赋值new', getArray4) // 3.886 ms
runTest('push赋值', getArray5)    // 7.260 ms

runTest('增项 - push', push)       //  11.379 ms
runTest('增项 - unshift', unshift) // 326.857 ms，性能跟 push 比完全不是一个数量级
runTest('增项 - fakeUnshift1', fakeUnshift1) // 4424.571 ms，虽然 unshift 慢，但比循环移值快多了
runTest('增项 - fakeUnshift2', fakeUnshift2) // 3981.036 ms，虽然 unshift 慢，比 concat 性能还是能高出 10 倍
runTest('减项 - pop', pop)         //  9.188 ms
runTest('减项 - shift', shift)     // 150.808 ms

runTest('concat', concat) // 148.846 ms, 合并长度为 1k 的数组，concat 执行效率仅是 push 的 0.7%，数组越大效率越低

// 生成数组 - 递增
function getArray1 (length = 1000) {
  let array = []
  for (let i = 0; i < length; i++) {
    array[i] = i
  }
  return array
}

// 生成数组 - 递增2
function getArray (length = 1000) {
  let array = new Array(length)
  for (let i = 0; i < length; i++) {
    array[i] = i
  }
  return array
}

// 生成数组 - 递减
function getArray3 (length = 1000) {
  let array = []
  for (let i = length; i--;) {
    array[i] = i
  }
  return array
}

// 生成数组 - 递减2
function getArray4 (length = 1000) {
  let array = new Array(length)
  for (let i = length; i--;) {
    array[i] = i
  }
  return array
}

// 生成数组 - push
function getArray5 (length = 1000) {
  let array = []
  for (let i = 0; i < length; i++) {
    array.push(i)
  }
  return array
}

// 新增项 - push 操作
function push (times = 1000) {
  let arr = getArray()
  while (times--) { arr.push(times) }
}

// 增项 - unshift 操作
function unshift (times = 1000) {
  let arr = getArray()
  while (times--) { arr.unshift(times) }
}

// 增项 - 模仿 unshift 操作
function fakeUnshift1 (times = 1000) {
  let arr = getArray()
  while (times--) {
    for (let i = arr.length; i--;) {
      arr[i + 1] = arr[i]
    }
    arr[0] = 1
  }
}

// 增项 - 模仿 unshift 操作2
function fakeUnshift2 (times = 1000) {
  let arr = getArray()
  while (times--) {
    arr = [times].concat(arr)
  }
}

// 减项 - pop 操作
function pop (times = 1000) {
  let arr = getArray(2000)
  while (times--) { arr.pop() }
}

// 减项 - shift 操作
function shift (times = 1000) {
  let arr = getArray(2000)
  while (times--) { arr.shift() }
}

// concat 操作
function concat (times = 10) {
  let arr = getArray(500)
  while (times--) { arr.concat([1, 5]) }
}
