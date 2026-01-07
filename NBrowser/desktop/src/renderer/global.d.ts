export {}

declare global {
  interface Window {
    nika: {
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
      }
      app: {
        ping: () => Promise<string>
      }
    }
  }
}
