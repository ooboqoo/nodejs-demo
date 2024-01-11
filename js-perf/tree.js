import { fileURLToPath } from 'node:url'
const root = Symbol('root')

class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}

export class BinarySearchTree {
  constructor() {
    this[root] = null
  }

  // 插入节点
  insert(key) {
    const newNode = new Node(key)
    if (this[root] === null) {
      this[root] = newNode
    } else {
      insertNode(this[root], newNode)
    }
    return this

    function insertNode(node, newNode) {
      if (newNode.key < node.key) {
        if (node.left === null) {
          node.left = newNode
        } else {
          insertNode(node.left, newNode)
        }
      } else {
        if (node.right === null) {
          node.right = newNode
        } else {
          insertNode(node.right, newNode)
        }
      }
    }
  }

  // 中序遍历
  inOrderTraverse(callback) {
    inOrderTraverseNode(this[root], callback)

    function inOrderTraverseNode(node, callback) {
      if (node === null) {
        return
      }
      inOrderTraverseNode(node.left, callback)
      callback(node.key)
      inOrderTraverseNode(node.right, callback)
    }
  }

  // 先序遍历
  preOrderTraverse(callback) {
    preOrderTraverseNode(this[root], callback)

    function preOrderTraverseNode(node, callback) {
      if (node === null) {
        return
      }
      callback(node.key)
      preOrderTraverseNode(node.left, callback)
      preOrderTraverseNode(node.right, callback)
    }
  }

  // 后序遍历
  postOrderTraverse(callback) {
    postOrderTraverseNode(this[root], callback)

    function postOrderTraverseNode(node, callback) {
      if (node === null) {
        return
      }
      postOrderTraverseNode(node.left, callback)
      postOrderTraverseNode(node.right, callback)
      callback(node.key)
    }
  }

  // 查找最小值
  min() {
    if (!this[root]) {
      return null
    }
    let node = this[root]
    while (node && node.left !== null) {
      node = node.left
    }
    return node.key
  }

  // 查找最大值
  max() {
    if (!this[root]) {
      return null
    }
    let node = this[root]
    while (node && node.right !== null) {
      node = node.right
    }
    return node.key
  }

  // 搜索特定值
  search(key) {
    return searchNode(this[root], key)

    function searchNode(node, key) {
      if (node === null) {
        return false
      }
      if (key < node.key) {
        return searchNode(node.left, key)
      } else if (key > node.key) {
        return searchNode(node.right, key)
      } else {
        return true
      }
    }
  }

  // 删除特定值
  delete(key) {
    this[root] = deleteNode(this[root], key)

    function deleteNode(node, key) {
      if (node === null) {
        return null
      }
      if (key < node.key) {
        node.left = deleteNode(node.left, key)
        return node
      } else if (key > node.key) {
        node.right = deleteNode(node.right, key)
        return node
      }

      // key === node.key && 节点为外节点
      if (node.left === null && node.right === null) {
        node = null
        return node
      }
      // key === node.key && 节点只有一个子节点
      if (node.left === null) {
        node = node.right
        return node
      }
      if (node.right === null) {
        node = node.left
        return node
      }
      // key === node.key && 节点有两个子节点
      const aux = findMinNode(node.right)
      node.key = aux.key
      node.right = deleteNode(node.right, aux.key)
      return node
    }

    function findMinNode(node) {
      while (node.left !== null) {
        node = node.left
      }
      return node
    }
  }
}

// 对基本功能进行测试
function runTest() {
  const tree = new BinarySearchTree()
  let result = []
  for (const i of [11, 7, 5, 3, 6, 9, 8, 10, 15, 13, 12, 14, 20, 18, 25]) {
    tree.insert(i)
  }
  tree.inOrderTraverse((key) => result.push(key))
  console.log('inOrderTraverse', result)
  result = []
  tree.preOrderTraverse((key) => result.push(key))
  console.log('preOrderTraverse', result)
  result = []
  tree.postOrderTraverse((key) => result.push(key))
  console.log('postOrderTraverse', result)
  result = []
  console.log('min ', tree.min())
  console.log('max ', tree.max())
  console.log('search ', tree.search(1) ? 'Key 1 found.' : 'Key 1 not found.')
  console.log('search ', tree.search(8) ? 'Key 8 found.' : 'Key 8 not found.')
  tree.delete(14)
  tree.inOrderTraverse((key) => result.push(key))
  console.log('delete 14 & inOrderTraverse', result)
  result = []
  tree.delete(1)
  tree.inOrderTraverse((key) => result.push(key))
  console.log('delete 1 & inOrderTraverse', result)
  result = []
}

// Run test if this file is executed directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url)
  if (process.argv[1] === modulePath) {
    runTest()
  }
}
