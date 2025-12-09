/**
 * Test Setup
 * Global test configuration and mocks
 */

import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

