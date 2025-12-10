/**
 * Machine Learning Basics: Tasks
 * 
 * Educational tasks focused on understanding machine learning concepts.
 * Each task includes comprehensive meta information for better learning outcomes.
 */

import {
  createTask,
  textSubmission,
  success,
  failure,
} from '@builders/task/index.js';
import type { TaskSubmission } from '@core/task/types.js';

/**
 * Custom TaskSolver for Supervised Learning
 * 
 * Validates understanding through comprehensive analysis of:
 * - Core concept recognition
 * - Labeled data understanding
 * - Training process comprehension
 * - Real-world example quality
 */
function solveSupervisedLearning(input: TaskSubmission) {
  // Validate input type
  if (input.type !== 'text') {
    return failure('invalid_submission', 'Please submit your answer as text.');
  }

  const text = input.text.trim();
  const lowerText = text.toLowerCase();
  
  // Minimum length check
  if (text.length < 50) {
    return failure(
      'too_short',
      `Your explanation is too brief. Please write at least 50 characters to fully explain supervised learning. Current: ${text.length} characters.`
    );
  }

  // Word count check for meaningful response
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 10) {
    return failure(
      'insufficient_detail',
      `Your answer needs more detail. Please write at least 10 words to demonstrate understanding. Current: ${wordCount} words.`
    );
  }

  // Core concept checks with variations
  const hasSupervised = 
    lowerText.includes('supervised') || 
    lowerText.includes('supervision') ||
    lowerText.includes('supervised learning');

  const hasLabeled = 
    lowerText.includes('labeled') || 
    lowerText.includes('label') ||
    lowerText.includes('labelled') ||
    lowerText.includes('tagged') ||
    lowerText.includes('annotated');

  const hasTraining = 
    lowerText.includes('training') || 
    lowerText.includes('train') ||
    lowerText.includes('learn') ||
    lowerText.includes('teaching') ||
    lowerText.includes('learns');

  const hasExample = 
    lowerText.includes('example') || 
    lowerText.includes('instance') ||
    lowerText.includes('case') ||
    lowerText.includes('such as') ||
    lowerText.includes('like') ||
    lowerText.includes('e.g.') ||
    lowerText.includes('for example');

  // Check for specific supervised learning examples
  const hasConcreteExample = 
    lowerText.includes('spam') ||
    lowerText.includes('email') ||
    lowerText.includes('image') ||
    lowerText.includes('classification') ||
    lowerText.includes('price') ||
    lowerText.includes('prediction') ||
    lowerText.includes('cat') ||
    lowerText.includes('dog') ||
    lowerText.includes('house');

  // Scoring system
  let score = 0;
  let missing: string[] = [];

  if (hasSupervised) {
    score += 25;
  } else {
    missing.push('supervised learning');
  }

  if (hasLabeled) {
    score += 25;
  } else {
    missing.push('labeled data');
  }

  if (hasTraining) {
    score += 25;
  } else {
    missing.push('training process');
  }

  if (hasExample) {
    score += 15;
    if (hasConcreteExample) {
      score += 10; // Bonus for concrete examples
    }
  } else {
    missing.push('a real-world example');
  }

  // Determine result based on score
  if (score >= 90) {
    return success(
      'excellent_understanding',
      'Outstanding! You\'ve demonstrated a comprehensive understanding of supervised learning, including labeled data, training processes, and real-world applications.',
      100
    );
  }

  if (score >= 70) {
    return success(
      'good_understanding',
      'Good work! You understand the key concepts. Consider adding more detail about how labeled data is used during training, or provide a more specific example.',
      85
    );
  }

  if (score >= 50) {
    return success(
      'basic_understanding',
      'You\'re on the right track! Your answer shows some understanding, but try to include: ' + missing.join(', ') + '. Think about how machines learn from examples where we already know the correct answer.',
      70
    );
  }

  // Provide specific guidance
  const guidance = missing.length > 0 
    ? `Your answer should include: ${missing.join(', ')}. ` 
    : '';
  
  return failure(
    'needs_improvement',
    guidance + 'Think about supervised learning as teaching a machine using examples where we know the correct answer (labels). For instance, showing a model thousands of emails labeled as "spam" or "not spam" so it can learn to identify spam.'
  );
}

/**
 * Supervised Learning Task
 * 
 * This task helps students understand the core concept of supervised learning
 * by identifying key characteristics and use cases.
 */
export const supervisedLearningTask = createTask({
  id: 'supervised-learning',
  name: 'Understanding Supervised Learning',
  description: 'Explain what supervised learning is and provide an example. Your answer should demonstrate understanding of labeled data and training processes.',
  submission: textSubmission(),
  validate: solveSupervisedLearning,
  overview: {
    requirements: 'Write a clear explanation of supervised learning (at least 50 words)',
    goals: [
      'Define supervised learning',
      'Explain the role of labeled data',
      'Describe the training process',
      'Provide a real-world example',
    ],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have an important task that will help you understand supervised learning.'],
    ready: ['Are you ready to explain supervised learning?'],
    complete: ['Well done! You\'ve grasped the fundamentals of supervised learning.'],
  },
  meta: {
    hints: [
      'Supervised learning uses labeled data - data where we know the correct answer',
      'Think about how a teacher supervises a student by providing correct answers',
      'Common examples include email spam detection, image classification, and predicting house prices',
      'The model learns patterns from the labeled examples during training',
    ],
    examples: [
      'Supervised learning is when a machine learns from labeled data. For example, training a model to recognize cats in photos by showing it thousands of images labeled as "cat" or "not cat".',
      'In supervised learning, we provide the algorithm with input-output pairs. Like teaching a model to predict house prices by showing it many houses with their actual prices.',
    ],
  },
});

/**
 * Custom TaskSolver for Neural Networks
 * 
 * Validates understanding through analysis of:
 * - Neural network definition
 * - Neuron/node concept
 * - Layer structure
 * - Connection/communication between neurons
 * - Quality of analogy used
 */
function solveNeuralNetworks(input: TaskSubmission) {
  // Validate input type
  if (input.type !== 'text') {
    return failure('invalid_submission', 'Please submit your answer as text.');
  }

  const text = input.text.trim();
  const lowerText = text.toLowerCase();
  
  // Minimum length check
  if (text.length < 60) {
    return failure(
      'too_short',
      `Your explanation is too brief. Please write at least 60 characters to fully explain neural networks. Current: ${text.length} characters.`
    );
  }

  // Word count check
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 12) {
    return failure(
      'insufficient_detail',
      `Your answer needs more detail. Please write at least 12 words to demonstrate understanding. Current: ${wordCount} words.`
    );
  }

  // Core concept checks with variations
  const hasNeural = 
    lowerText.includes('neural') || 
    lowerText.includes('neuron');

  const hasNetwork = 
    lowerText.includes('network') || 
    lowerText.includes('networks');

  const hasNeuron = 
    lowerText.includes('neuron') || 
    lowerText.includes('neurons') ||
    lowerText.includes('node') ||
    lowerText.includes('nodes') ||
    lowerText.includes('unit') ||
    lowerText.includes('units');

  const hasLayer = 
    lowerText.includes('layer') || 
    lowerText.includes('layers') ||
    lowerText.includes('level') ||
    lowerText.includes('levels');

  // Check for connection/communication concepts
  const hasConnection = 
    lowerText.includes('connect') || 
    lowerText.includes('connection') ||
    lowerText.includes('link') ||
    lowerText.includes('pass') ||
    lowerText.includes('transfer') ||
    lowerText.includes('communicate') ||
    lowerText.includes('signal');

  // Check for analogy indicators
  const hasAnalogy = 
    lowerText.includes('like') ||
    lowerText.includes('similar to') ||
    lowerText.includes('analogy') ||
    lowerText.includes('compare') ||
    lowerText.includes('resemble') ||
    lowerText.includes('brain') ||
    lowerText.includes('team') ||
    lowerText.includes('assembly') ||
    lowerText.includes('chain') ||
    lowerText.includes('pipeline');

  // Check for specific layer types
  const hasLayerTypes = 
    lowerText.includes('input') ||
    lowerText.includes('output') ||
    lowerText.includes('hidden');

  // Scoring system
  let score = 0;
  let missing: string[] = [];

  if (hasNeural && hasNetwork) {
    score += 20;
  } else {
    missing.push('neural networks');
  }

  if (hasNeuron) {
    score += 20;
  } else {
    missing.push('neurons or nodes');
  }

  if (hasLayer) {
    score += 20;
    if (hasLayerTypes) {
      score += 10; // Bonus for specific layer types
    }
  } else {
    missing.push('layers');
  }

  if (hasConnection) {
    score += 15;
  } else {
    missing.push('how neurons connect');
  }

  if (hasAnalogy) {
    score += 15;
  } else {
    missing.push('an analogy');
  }

  // Determine result based on score
  if (score >= 90) {
    return success(
      'excellent_understanding',
      'Outstanding! You\'ve demonstrated a comprehensive understanding of neural networks, including their structure, how neurons work together in layers, and you\'ve used a helpful analogy to explain the concept.',
      100
    );
  }

  if (score >= 70) {
    return success(
      'good_understanding',
      'Good work! You understand the key concepts of neural networks. Consider adding more detail about how neurons connect and communicate, or strengthen your analogy.',
      85
    );
  }

  if (score >= 50) {
    return success(
      'basic_understanding',
      'You\'re on the right track! Your answer shows some understanding, but try to include: ' + missing.join(', ') + '. Think about how neurons are organized in layers and how information flows through them.',
      70
    );
  }

  // Provide specific guidance
  const guidance = missing.length > 0 
    ? `Your answer should include: ${missing.join(', ')}. ` 
    : '';
  
  return failure(
    'needs_improvement',
    guidance + 'Think about neural networks as interconnected neurons organized in layers (input, hidden, output). Each neuron processes information and passes it to neurons in the next layer. Try using an analogy like comparing it to how brain neurons work together, or how a team processes information step by step.'
  );
}

/**
 * Neural Networks Task
 * 
 * This task explores the concept of neural networks and their basic structure.
 */
export const neuralNetworksTask = createTask({
  id: 'neural-networks',
  name: 'Exploring Neural Networks',
  description: 'Describe what a neural network is and explain how neurons work together. Include at least one analogy to help explain the concept.',
  submission: textSubmission(),
  validate: solveNeuralNetworks,
  overview: {
    requirements: 'Explain neural networks with an analogy (at least 60 words)',
    goals: [
      'Define neural networks',
      'Explain the role of neurons/nodes',
      'Describe layer structure',
      'Provide a helpful analogy',
    ],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['Ready to learn about neural networks? This is a fascinating topic!'],
    ready: ['Are you prepared to explain neural networks?'],
    complete: ['Excellent! Neural networks are powerful tools in modern AI.'],
  },
  meta: {
    hints: [
      'Neural networks are inspired by how the human brain works',
      'Neurons (or nodes) are connected in layers: input, hidden, and output',
      'Each connection has a weight that determines its importance',
      'Think of it like a team where each person (neuron) processes information and passes it along',
      'Common analogies: brain, team, assembly line, or decision tree',
    ],
    examples: [
      'A neural network is like a team of workers. Each worker (neuron) in a layer processes information and passes it to workers in the next layer. The input layer receives data, hidden layers process it, and the output layer produces the final result.',
      'Neural networks mimic the brain\'s structure. Just as brain neurons connect to process thoughts, artificial neurons (nodes) connect in layers to process data and make predictions.',
    ],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [supervisedLearningTask, neuralNetworksTask];
