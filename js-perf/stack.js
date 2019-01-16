class Stack {
  constructor () {
    this._items = Array.prototype.slice.call(arguments)
  }

  get size () { return this._items.length }
  set size (number) { this._items.length = number }

  push (element) { return this._items.push(element) }
  pop () { return this._items.pop() }
  peek () { return this._items[this._items.length - 1] }
  isEmpty () { return this._items.length === 0 }
  clear () { this._items.length = 0 }
  print () { console.log(this._items) }
}

// 普通队列
class Queue {
  constructor () {
    this._items = Array.prototype.slice.call(arguments)
  }

  get size () { return this._items.length }
  set size (number) { this._items.length = number }

  enqueue (element) { return this._items.push(element) }
  dequeue () { return this._items.shift() }
  front () { return this._items[0] }
  isEmpty () { return this._items.length === 0 }
  clear () { this._items.length = 0 }
  print () { console.log(this._items) }
}

// 优先队列
class PriorityQueue {
  constructor () {
    this._items = Array.prototype.slice.call(arguments)
  }

  enqueue (element, priority) {
    let queueElement = new QueueElement(element, priority)
    if (!this._items.length) { return this._items.push(queueElement) }
    for (let i = this._items.length; i--;) {
      if (queueElement.priority < this._items[i].priority) {
        return this._items.push(queueElement)
      }
    }
    return this._items.unshift(queueElement)
  }

  // 其他方法略
}

class QueueElement {
  constructor (element, priority) {
    this.element = element
    this.priority = priority
  }
}

// 循环队列 - 击鼓传花
function hotPotato (nameList, num) {
  const queue = new Queue(...nameList)
  while (queue.size > 1) {
    for (let i = num; i--;) {
      queue.enqueue(queue.dequeue())
    }
    console.log(queue.dequeue() + ' 被淘汰。')
  }
  return queue.dequeue()
}

let names = ['John', 'Jack', 'Camila', 'Carl']
let winner = hotPotato(names, 7)
console.log('胜利者 ', winner)

module.exports = {
  Stack,
  PriorityQueue
}
