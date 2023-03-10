module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'vue/no-v-html': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    semi: ['error', 'never'],
    'max-len': 'off',
    'linebreak-style': 'off',
    'quotes': [2, 'single', { 'avoidEscape': true }],
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }],
    'arrow-parens': ['error', 'as-needed'],
    'vue/multi-word-component-names': 'off', 
  },
}
