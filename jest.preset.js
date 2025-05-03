const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coveragePathIgnorePatterns: ['index.ts', 'index.js', 'index.jsx', 'axios.ts', 'png'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
