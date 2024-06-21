module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: [
      'default',
      [
        'jest-junit',
        {
          outputDirectory: 'coverage',
          outputName: 'junit.xml',
        },
      ],
    ],
  };
  