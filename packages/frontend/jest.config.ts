import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // TypeScript 用プリセット
  preset: 'ts-jest',
  // テスト環境: jest@v27 以降のデフォルトは 'node'
  testEnvironment: 'jsdom',
  // 拡張子 'ts' or 'tsx' のファイル（正規表現）を `ts-jest` に処理させる
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 'ts-jest': { tsconfig: './tsconfig.json' } }],
  },
  moduleNameMapper: {
    // SVG と CSS のモックを指定
    '^.+\\.(css|svg)$': '<rootDir>/__mocks__/assetMock.ts',
    // tsconfig で指定済みの paths を解釈できるようにする
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
