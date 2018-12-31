const rewire = require('rewire')

const Logger = rewire('./logger')

const stringify = Logger.__get__('stringify')

describe('stringify', () => {
  test('stringify can handle circular references', () => {
    const a = {}
    a.self = a
    expect(stringify(a)).toBe('[logger-internal-error] failed to serialize the data!')
  })

  test('stringify can handle common JSON', () => {
    expect(stringify(['a', 1, undefined])).toBe('["a",1,null]')
  })
})
