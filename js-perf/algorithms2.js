// 最少硬币找零问题 - 动态规划
const makeChange = (function () {
  const cache = {}
  const coins = [1, 3, 4]
  coins.forEach(function (item) {
    cache[item] = [item]
  })

  return function makeChange(amount) {
    if (!amount) {
      return []
    }
    if (cache[amount]) {
      return cache[amount]
    }
    let min = []
    // 拿掉一个硬币后，对比剩下金额的最优解 arr，得出优解方案 arr.push(coins[i])
    for (let i = coins.length, newAmount, newMin; i--; ) {
      newAmount = amount - coins[i]
      if (newAmount < 0) {
        continue
      }
      newMin = makeChange(newAmount)
      if (!min.length || newMin.length < min.length - 1) {
        min = [coins[i]].concat(newMin)
        console.log('new Min ' + min + ' for ' + amount)
      }
    }
    cache[amount] = min
    return min
  }
})()

// 最少硬币找零问题 - 贪心算法
function minCoinChange(amount, coins = [1, 3, 4]) {
  const change = []
  let total = 0
  for (let i = coins.length; i--; ) {
    while (total + coins[i] <= amount) {
      change.push(coins[i])
      total += coins[i]
    }
  }
  return change
}

// 正常市面上的币值 1, 2, 5, 10, 20, 50, 100 贪心算法得到的也永远是最优解
for (let i = 20; i--; ) {
  console.log('动态规划', makeChange(i)) // [3, 3]
  console.log('贪心算法', minCoinChange(i)) // [4, 1, 1]
}
