/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ['./jest.setup.js'],
  testPathIgnorePatterns: ['jest.setup.js', 'jest.config.js']
};
