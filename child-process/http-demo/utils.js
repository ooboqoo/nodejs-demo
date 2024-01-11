import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function dirname() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export function timeConsumingOperation() {
  const end = Date.now() + 10000
  while (Date.now() < end) {
    // do nothing
  }
}
