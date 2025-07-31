export default {
  displayName: 'cash-or-installments-calculator-root-backend',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../../coverage/apps/url-shortener/backend/root-backend',
};
