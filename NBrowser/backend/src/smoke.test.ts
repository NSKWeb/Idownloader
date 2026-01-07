import { createApp } from './app.js'

test('createApp returns an express app', () => {
  const app = createApp()
  expect(typeof app).toBe('function')
})
