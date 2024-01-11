# Node.js Demo

## How to test non-exported functions

All non-exported functions are exposed under an exported `__test__` object.

```js
// index.js
const privateFunction = () => {
  return 'private'
}
export const __test__ = {
  privateFunction,
}
```

```js
// index.test.js
import { __test__ } from './index.js'
const { privateFunction } = __test__
expect(privateFunction()).toBe('private')
```

## References

https://github.com/sindresorhus/awesome-nodejs
