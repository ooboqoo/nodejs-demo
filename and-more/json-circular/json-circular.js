/**
 * References:
 *   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 *   - https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
 *
 * @example
 *
 * ```js
 * const obj = {path: 'obj', sub: {path: 'obj/path'}, test: {}}
 * obj.test.obj = obj
 * obj.test.sub = obj.sub
 * stringify(obj)
 * // returns:
 * {path: 'obj', sub: {path: 'obj/path'}, test: {obj: {$ref: '$'}, sub: {$ref: '$["sub"]'}}}
 * ```
 */

/** A JSON.stringify alternative that handles circular reference safely */
export function stringify(object, replacer) {
  /**
   * Object to path mappings
   * @type {WeakMap<object, string>}
   */
  const objects = new WeakMap()
  return JSON.stringify(refToStr(object, '$'), replacer)

  function refToStr(value, path) {
    let result

    if (
      typeof value !== 'object' ||
      value === null ||
      value instanceof Boolean ||
      value instanceof Date ||
      value instanceof Number ||
      value instanceof RegExp ||
      value instanceof String
    ) {
      return value
    }

    const refPath = objects.get(value)
    if (refPath) {
      return { $ref: refPath }
    }
    // Accumulate the unique value and its path.
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

export function parse($) {
  $ = JSON.parse($)
  pathToRef($)
  return $

  function pathToRef(value) {
    const rege = /^\$(\[[^\]]+\])?$/
    if (typeof value !== 'object') {
      return value
    }

    if (Array.isArray(value)) {
      value.forEach(function (element, i) {
        if (typeof element === 'object' && element !== null) {
          const path = element.$ref
          if (typeof path === 'string' && rege.test(path)) {
            // eslint-disable-next-line no-eval
            value[i] = eval(path)
          } else {
            pathToRef(element)
          }
        }
      })
    } else {
      Object.keys(value).forEach(function (name) {
        const item = value[name]
        if (typeof item === 'object' && item !== null) {
          const path = item.$ref
          if (typeof path === 'string' && rege.test(path)) {
            // eslint-disable-next-line no-eval
            value[name] = eval(path)
          } else {
            pathToRef(item)
          }
        }
      })
    }
  }
}
