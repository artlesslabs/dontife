module.exports = {
  root: true,

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 'latest',
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },

  extends: [
    'eslint:recommended', 'plugin:vue/vue3-recommended'],

  plugins: [
    'vue',
  ],

  globals: {
    ga: 'readonly',
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  rules: {
    semi: ["error", "always"],
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
    "object-curly-spacing":["error","always"],
    "vue/object-curly-spacing":["error","always"],
    "comma-spacing":["error"],
    "vue/comma-spacing":["error"],
    "space-in-parens":["error", "always"],
    "vue/space-in-parens":["error", "always"],
    "block-spacing": "error",
    "vue/block-spacing": "error",
    "key-spacing": ["error", { "afterColon": true }],
    "vue/key-spacing": ["error", { "afterColon": true }],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "array-bracket-spacing": ["error", "always"],
    "vue/array-bracket-spacing": ["error", "always"],
    "func-call-spacing": ["error", "never"],
    "vue/func-call-spacing": ["error", "never"],
    "no-multi-spaces":["error"],
    "vue/no-multi-spaces":["error"],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "never"
    }],
    "vue/block-tag-newline":['error', {
      "singleline": "always",
      "multiline": "always",
      "maxEmptyLines": 1,
    }],
    "vue/new-line-between-multi-line-property": ["error", {
      "minLineOfMultilineProperty": 2
    }],
    "vue/padding-line-between-blocks": ["error", "always"],
    "prefer-promise-reject-errors": "off",
    "vue/component-name-in-template-casing": "error",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  }
}
