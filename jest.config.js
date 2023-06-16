/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'test/server',
  testRegex: ['.*\\.ts'],
  moduleNameMapper: {
    "tokeniser-rs": "<rootDir>/../../tokeniser-rs/pkg_node"
  }
};
