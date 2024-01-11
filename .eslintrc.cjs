const config = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'lines-between-class-members': 'off',
  },
}

module.exports = config
