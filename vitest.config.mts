import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    chaiConfig: { truncateThreshold: 10_000 },
  },
})
