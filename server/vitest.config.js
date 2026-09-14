import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    api: {
      host: '127.0.0.1',
      port: 51204
    }
  },
  server: {
    host: '127.0.0.1'
  }
});
