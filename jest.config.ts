import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  projects: ['<rootDir>/packages/backend/jest.config.ts', '<rootDir>/packages/frontend/jest.config.ts'],
};

// noinspection JSUnusedGlobalSymbols
export default config;
