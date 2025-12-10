/**
 * Machine Learning Basics: Objects
 * 
 * Informative objects that provide additional learning resources
 * and context about machine learning concepts.
 */

import {
  createObject,
  showSignViewer,
  showNoteViewer,
  position,
} from '@builders/index.js';

/**
 * ML Overview Board
 * 
 * Provides a comprehensive introduction to machine learning concepts.
 */
export const mlOverviewBoard = createObject({
  id: 'ml-overview-board',
  name: 'ML Overview Board',
  position: position(65, 35),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'What is Machine Learning?',
    content: `Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

Key Concepts:
• Supervised Learning: Learning from labeled examples
• Unsupervised Learning: Finding patterns in unlabeled data
• Neural Networks: Computing systems inspired by biological brains
• Training: The process of teaching a model using data
• Prediction: Using a trained model to make new predictions

Machine learning powers many technologies we use daily, from search engines to recommendation systems, image recognition, and natural language processing.`,
  }),
});

/**
 * Supervised Learning Guide
 * 
 * Detailed information about supervised learning.
 */
export const supervisedLearningGuide = createObject({
  id: 'supervised-learning-guide',
  name: 'Supervised Learning Guide',
  position: position(20, 60),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Supervised Learning Explained',
    content: `Supervised learning is a type of machine learning where the algorithm learns from labeled training data.

How it works:
1. You provide the algorithm with input-output pairs (labeled data)
2. The algorithm learns the mapping between inputs and outputs
3. Once trained, it can predict outputs for new, unseen inputs

Real-world examples:
• Email spam detection (input: email, output: spam or not spam)
• Image classification (input: image, output: what object is in the image)
• House price prediction (input: house features, output: price)
• Medical diagnosis (input: symptoms, output: diagnosis)

The "supervised" part comes from the fact that during training, we provide the correct answers (labels) to guide the learning process, much like a teacher supervising a student.`,
  }),
});

/**
 * Neural Networks Info
 * 
 * Information about neural networks and their structure.
 */
export const neuralNetworksInfo = createObject({
  id: 'neural-networks-info',
  name: 'Neural Networks Info',
  position: position(80, 55),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Understanding Neural Networks',
    content: `Neural networks are computing systems inspired by biological neural networks in the brain.

Structure:
• Input Layer: Receives the initial data
• Hidden Layers: Process the data through multiple layers
• Output Layer: Produces the final result

Key components:
• Neurons (Nodes): Basic processing units that receive inputs, apply weights, and produce outputs
• Weights: Numerical values that determine the strength of connections
• Activation Functions: Functions that determine whether a neuron "fires"
• Bias: Additional parameter that helps fine-tune outputs

How they learn:
Neural networks learn by adjusting weights and biases through a process called backpropagation. They compare their predictions to the correct answers and gradually improve their accuracy.

Applications:
• Image and speech recognition
• Natural language processing
• Autonomous vehicles
• Game playing (like AlphaGo)
• Medical image analysis

The power of neural networks comes from their ability to learn complex patterns in data through multiple layers of abstraction.`,
  }),
});

/**
 * All objects for this module
 */
export const objects = [mlOverviewBoard, supervisedLearningGuide, neuralNetworksInfo];
