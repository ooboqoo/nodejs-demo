/**
 * References:
 *   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 *   - https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
 */

'use strict'

exports.stringify = (object, replacer) => {
  var objects = new WeakMap() // object to path mappings
  return derez(object, '$')
  function derez (value, path) {
    // The derez function recurses through the object, producing the deep copy.

    var oldPath // The path of an earlier occurance of value
    var nu // The new object or array

    // If a replacer function was provided, then call it to get a replacement value.

    if (replacer !== undefined) {
      value = replacer(value)
    }

    // typeof null === "object", so go on if this value is really an object but not
    // one of the weird builtin objects.

    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date) &&
      !(value instanceof Number) &&
      !(value instanceof RegExp) &&
      !(value instanceof String)
    ) {
      // If the value is an object or array, look to see if we have already
      // encountered it. If so, return a {"$ref":PATH} object. This uses an
      // ES6 WeakMap.

      oldPath = objects.get(value)
      if (oldPath !== undefined) {
        return {
          $ref: oldPath
        }
      }

      // Otherwise, accumulate the unique value and its path.

      objects.set(value, path)

      // If it is an array, replicate the array.

      if (Array.isArray(value)) {
        nu = []
        value.forEach(function (element, i) {
          nu[i] = derez(element, path + '[' + i + ']')
        })
      } else {
        // If it is an object, replicate the object.

        nu = {}
        Object.keys(value).forEach(function (name) {
          nu[name] = derez(
            value[name],
            path + '[' + JSON.stringify(name) + ']'
          )
        })
      }
      return nu
    }
    return value
  }
}

exports.parse = ($) => {
  var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/

  function rez (value) {
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach(function (element, i) {
          if (typeof element === 'object' && element !== null) {
            var path = element.$ref
            if (typeof path === 'string' && px.test(path)) {
              value[i] = eval(path)
            } else {
              rez(element)
            }
          }
        })
      } else {
        Object.keys(value).forEach(function (name) {
          var item = value[name]
          if (typeof item === 'object' && item !== null) {
            var path = item.$ref
            if (typeof path === 'string' && px.test(path)) {
              value[name] = eval(path)
            } else {
              rez(item)
            }
          }
        })
      }
    }
  }
  rez($)
  return $
}
