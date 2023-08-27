module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  extends: ["@nuxtjs/eslint-config-typescript"],
  plugins: [],
  rules: {
    semi: ["error", "never"],
    quotes: ["error", "double"],
    indent: ["error", 2],
    "vue/multi-word-component-names": "off"
  }
}
