import { expect, test, describe } from 'vitest'
import { stringify, parse } from './json-circular.js'

describe('stringify', () => {
  test('can handle circular references', () => {
    const a = {}
    a.self = a
    expect(stringify(a)).toBe('{"self":{"$ref":"$"}}')
  })
  test('can handle common JSON', () => {
    expect(stringify({ foo: 'foo', bar: 123, arr: [1] })).toBe('{"foo":"foo","bar":123,"arr":[1]}')
  })
})

describe('parse', () => {
  test('can handle circular references', () => {
    const a = {}
    a.self = a
    expect(parse('{"self":{"$ref":"$"}}')).toEqual(a)
  })
  test('can handle common JSON', () => {
    expect(parse('{"foo":"foo","bar":123,"arr":[1]}')).toEqual({ foo: 'foo', bar: 123, arr: [1] })
  })
})
