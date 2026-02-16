import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    base: "/sl-quiz-app/",
    host: "sl-quiz.local",
    port: 5137
  }
})
