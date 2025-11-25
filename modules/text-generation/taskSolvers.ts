/**
 * Task solve functions for text-generation module
 */

import type { TaskSolveResult } from '../../src/types/module.types.js';
import type { TaskSubmission } from '../../src/types/task.types.js';

export function task1_solve(input: TaskSubmission): TaskSolveResult {
  // Extract text from submission
  if (input.type !== 'text') {
    return {
      solved: false,
      reason: 'Fel typ av inlämning',
      details: 'Denna uppgift kräver textinlämning.',
    };
  }
  
  const answer = input.text;
  const trimmedAnswer = answer.trim();
  
  // Check minimum length (reasonable story length)
  const wordCount = trimmedAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 100) {
    return {
      solved: false,
      reason: 'Berättelsen är för kort',
      details: `Du har ${wordCount} ord. En berättelse behöver vara längre för att återskapa en saga.`,
    };
  }
  
  // Check for story structure elements (beginning, middle, end)
  // Look for indicators of story progression
  const hasBeginning = /början|start|en gång|det var en gång|för länge sedan|började|började med/i.test(trimmedAnswer) ||
                       /beginning|start|once upon|once|long ago|started|began/i.test(trimmedAnswer);
  const hasMiddle = /sedan|därefter|men|emellertid|under tiden|medan|samtidigt/i.test(trimmedAnswer) ||
                     /then|after|but|however|meanwhile|while|during/i.test(trimmedAnswer);
  const hasEnd = /slut|till slut|slutligen|så|därför|resultatet|avslutades/i.test(trimmedAnswer) ||
                 /end|finally|in the end|so|therefore|result|concluded/i.test(trimmedAnswer);
  
  if (!hasBeginning || !hasMiddle || !hasEnd) {
    return {
      solved: false,
      reason: 'Berättelsen saknar struktur',
      details: 'En komplett berättelse behöver ha en tydlig början, mitt och slut.',
    };
  }
  
  // Check for multiple sentences (story should have narrative flow)
  const hasMultipleSentences = (trimmedAnswer.match(/[.!?]+/g) || []).length >= 3;
  if (!hasMultipleSentences) {
    return {
      solved: false,
      reason: 'Berättelsen behöver fler meningar',
      details: 'En bra berättelse består av flera meningar som bygger upp handlingen.',
    };
  }
  
  return {
    solved: true,
    reason: 'Utmärkt arbete!',
    details: `Du har skapat en berättelse med ${wordCount} ord som har en tydlig struktur.`,
    score: Math.min(100, Math.floor((wordCount / 200) * 100)),
  };
}

export function task2_solve(input: TaskSubmission): TaskSolveResult {
  // Extract text from submission
  if (input.type !== 'text') {
    return {
      solved: false,
      reason: 'Fel typ av inlämning',
      details: 'Denna uppgift kräver textinlämning.',
    };
  }
  
  const answer = input.text;
  const trimmedAnswer = answer.trim();
  
  // Check minimum length (reasonable suggestion)
  const wordCount = trimmedAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 50) {
    return {
      solved: false,
      reason: 'Förslaget är för kort',
      details: `Du har ${wordCount} ord. Ett förslag på en måltid behöver vara mer detaljerat.`,
    };
  }
  
  // Check for food-related content (ingredients, cooking methods, dishes)
  const hasFood = /mat|rätt|måltid|middag|maträtt|ingrediens|recept/i.test(trimmedAnswer) ||
                  /food|dish|meal|dinner|ingredient|recipe|cook/i.test(trimmedAnswer);
  
  if (!hasFood) {
    return {
      solved: false,
      reason: 'Förslaget handlar inte om mat',
      details: 'Du behöver föreslå en måltid som kan laga med ingredienser från kylskåpet.',
    };
  }
  
  // Check for ingredients or food items (things that could be in a fridge)
  const hasIngredients = /kött|fisk|kyckling|ägg|ost|grönsak|frukt|mjölk|smör|yoghurt|bröd/i.test(trimmedAnswer) ||
                         /meat|fish|chicken|egg|cheese|vegetable|fruit|milk|butter|yogurt|bread/i.test(trimmedAnswer);
  
  if (!hasIngredients) {
    return {
      solved: false,
      reason: 'Förslaget nämner inte ingredienser',
      details: 'Du behöver nämna specifika ingredienser som finns i kylskåpet.',
    };
  }
  
  // Check for cooking method or dish description
  const hasCookingMethod = /laga|koka|steka|baka|grilla|servera|göra|tillaga/i.test(trimmedAnswer) ||
                           /cook|boil|fry|bake|grill|serve|make|prepare/i.test(trimmedAnswer);
  
  if (!hasCookingMethod) {
    return {
      solved: false,
      reason: 'Förslaget saknar beskrivning av hur maten lagas',
      details: 'Beskriv hur måltiden kan laga med ingredienserna.',
    };
  }
  
  return {
    solved: true,
    reason: 'Utmärkt förslag!',
    details: `Du har gett ett bra förslag på en romantisk middag med ${wordCount} ord.`,
    score: Math.min(100, Math.floor((wordCount / 150) * 100)),
  };
}

export function task3_solve(input: TaskSubmission): TaskSolveResult {
  // Extract text from submission
  if (input.type !== 'text') {
    return {
      solved: false,
      reason: 'Fel typ av inlämning',
      details: 'Denna uppgift kräver textinlämning.',
    };
  }
  
  const answer = input.text;
  const trimmedAnswer = answer.trim();
  
  // This is a reflection, not a strict task - check for thoughtful content
  const wordCount = trimmedAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 50) {
    return {
      solved: false,
      reason: 'Reflektionen är för kort',
      details: `Du har ${wordCount} ord. En reflektion behöver vara mer utförlig.`,
    };
  }
  
  // Check for AI-related content
  const hasAI = /AI|artificiell intelligens|textgenerering|text-generering|språkmodell|chatbot/i.test(trimmedAnswer) ||
                 /AI|artificial intelligence|text generation|text-generating|language model|chatbot/i.test(trimmedAnswer);
  
  if (!hasAI) {
    return {
      solved: false,
      reason: 'Reflektionen handlar inte om AI',
      details: 'Reflektionen bör handla om textgenererande AI och dess användning.',
    };
  }
  
  // Check for thoughtful content (pros/cons, usage, thoughts, opinions)
  const hasThoughts = /fördel|nackdel|användning|använda|tänker|tycker|menar|reflektera/i.test(trimmedAnswer) ||
                      /advantage|disadvantage|pro|con|use|usage|think|believe|mean|reflect/i.test(trimmedAnswer);
  
  if (!hasThoughts) {
    return {
      solved: false,
      reason: 'Reflektionen saknar tankar och åsikter',
      details: 'En reflektion bör innehålla dina tankar och åsikter om ämnet.',
    };
  }
  
  // Check for multiple sentences (reflection should have some depth)
  const hasMultipleSentences = (trimmedAnswer.match(/[.!?]+/g) || []).length >= 2;
  if (!hasMultipleSentences) {
    return {
      solved: false,
      reason: 'Reflektionen behöver fler meningar',
      details: 'En reflektion består av flera meningar som utvecklar dina tankar.',
    };
  }
  
  return {
    solved: true,
    reason: 'Tack för din reflektion!',
    details: `Du har gett en reflektion med ${wordCount} ord om textgenererande AI.`,
    score: Math.min(100, Math.floor((wordCount / 200) * 100)),
  };
}

