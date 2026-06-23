import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: "file:./dev.db",
  },
  migrations: {
    url: "file:./dev.db",
  },
})
