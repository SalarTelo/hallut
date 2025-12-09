/**
 * Example 1: Basic Objects
 * 
 * A single simple object - a welcome sign.
 * No unlock requirements, just information.
 */

import {
  createObject,
  showSignViewer,
  pos,
} from '@builders/index.js';

/**
 * Welcome Sign
 * 
 * A simple sign that displays information when clicked.
 * This demonstrates the most basic object interaction.
 */
export const welcomeSign = createObject({
  id: 'welcome-sign',
  name: 'Welcome Sign',
  position: pos(70, 30),
  avatar: 'note',
  interaction: showSignViewer({
    content: 'Welcome to the Basic Example Module! This is the simplest possible module. Click on the Guide NPC to get a task.',
    title: 'Welcome Sign',
  }),
});

/**
 * All objects for this module
 */
export const objects = [welcomeSign];

