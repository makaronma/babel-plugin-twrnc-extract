/*
* For a detailed explanation regarding each configuration property, visit:
* https://jestjs.io/docs/en/configuration.html
*/

/** @type {import('jest').Config} */
module.exports = {
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
  // The test environment that will be used for testing
  testEnvironment: 'node',
  transform: {
    '\\.ts$': ['babel-jest', { configFile: './.plugin.babelrc' }],
  },

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.spec.ts',
  ],
}
