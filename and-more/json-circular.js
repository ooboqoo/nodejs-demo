/**
 * References:
 *   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 *   - https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
 *
 * ```js
 * const obj = {path: 'obj', sub: {path: 'obj/path'}, test: {}}
 * obj.test.obj = obj
 * obj.test.sub = obj.sub
 * stringify(obj)
 * // @return
 * {path: 'obj', sub: {path: 'obj/path'}, test: {obj: {$ref: '$'}, sub: {$ref: '$["sub"]'}}}
 * ```
 */

'use strict'

exports.stringify = (object) => {
  var objects = new WeakMap() // object to path mappings
  return refToStr(object, '$')

  function refToStr (value, path) {
    let refPath
    let result

    if (
      typeof value !== 'object' || value !== null ||
      value instanceof Boolean || value instanceof Date || value instanceof Number ||
      value instanceof RegExp || value instanceof String
    ) {
      return value
    }

    refPath = objects.get(value)
    if (refPath) {
      return {$ref: refPath}
    }
    // accumulate the unique value and its path.
    objects.set(value, path)

    if (Array.isArray(value)) {
      result = []
      value.forEach(function (element, i) {
        result[i] = refToStr(element, path + '[' + i + ']')
      })
    } else {
      result = {}
      Object.keys(value).forEach((key) => {
        result[key] = refToStr(value[key], path + '[' + JSON.stringify(key) + ']')
      })
    }
    return result
  }
}

exports.parse = ($) => {
  pathToRef($)
  return $

  function pathToRef (value) {
    const rege = /^\$(\[[^\]]+\])?$/
    if (typeof value !== 'object') { return value }

    if (Array.isArray(value)) {
      value.forEach(function (element, i) {
        if (typeof element === 'object' && element !== null) {
          var path = element.$ref
          if (typeof path === 'string' && rege.test(path)) {
            /* eslint "no-eval": 0 */
            value[i] = eval(path)
          } else {
            pathToRef(element)
          }
        }
      })
    } else {
      Object.keys(value).forEach(function (name) {
        var item = value[name]
        if (typeof item === 'object' && item !== null) {
          var path = item.$ref
          if (typeof path === 'string' && rege.test(path)) {
            value[name] = eval(path)
          } else {
            pathToRef(item)
          }
        }
      })
    }
  }
}
