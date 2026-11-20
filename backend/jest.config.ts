
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

// Lee los alias definidos en tsconfig.json.
const { config: tsconfig } = ts.readConfigFile(
  './tsconfig.json',
  ts.sys.readFile,
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',

  // Incluye las pruebas unitarias y las pruebas de integración E2E.
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleNameMapper: pathsToModuleNameMapper(paths, {
    prefix: '<rootDir>/',
  }),

  // Mide el código fuente del backend.
  collectCoverageFrom: [
    'src/**/*.ts',

    // Excluye archivos de arranque y configuración de módulos.
    '!src/main.ts',
    '!src/app.module.ts',
    '!src/**/*.module.ts',
  ],

  coverageDirectory: './coverage',
  testEnvironment: 'node',

    // Exige una cobertura mínima del 80 % en todas las métricas.
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
