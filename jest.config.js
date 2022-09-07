module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest']
  },
  testRegex: '((\\.|/)(test|spec))\\.[jt]s$',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
