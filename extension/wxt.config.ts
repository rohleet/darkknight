import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest : {
    name: "PhishGuard",
    modules: ['@wxt-dev/module-react'],
  },
});
