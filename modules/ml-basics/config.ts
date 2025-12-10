/**
 * Machine Learning Basics Module Configuration
 * 
 * An educational module introducing fundamental machine learning concepts
 * with interactive tasks and engaging content.
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@builders/module/index.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'ml-basics',
      'Machine Learning Basics',
      '1.0.0',
      'Learn the fundamentals of machine learning through hands-on tasks and interactive exploration. Discover key concepts like supervised learning, neural networks, and model training.'
    ),
    background: colorBackground('#1a202c'),
    welcome: createWelcome('System', [
      'Welcome to Machine Learning Basics!',
      'In this module, you\'ll explore the fundamentals of machine learning.',
      'Talk to Professor Chen to get started with your first task.',
      'Click on the information boards to learn more about ML concepts.',
    ]),
    worldmap: {
      position: { x: 45, y: 25 },
      icon: {
        shape: 'circle',
        size: 64,
      },
    },
  });
}
