import { expect, test, describe } from 'vitest'
import { __test__ } from './upload-file.js'
const { dataToBody, boundary } = __test__

describe('dataToBody', () => {
  test('should return the correct body for a single field', () => {
    const data = { field1: 'value1' }
    const expectedBody = `
--${boundary}
Content-Disposition: form-data; name="field1"

value1
`
    expect(dataToBody(data)).toBe(expectedBody)
  })

  test('should return the correct body for multiple fields', () => {
    const data = {
      field1: 'value1',
      field2: 'value2',
      field3: 'value3',
    }
    const expectedBody = `
--${boundary}
Content-Disposition: form-data; name="field1"

value1

--${boundary}
Content-Disposition: form-data; name="field2"

value2

--${boundary}
Content-Disposition: form-data; name="field3"

value3
`
    expect(dataToBody(data)).toBe(expectedBody)
  })
})
