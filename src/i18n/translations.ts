export type Locale = 'sv' | 'en';

export interface Translations {
  // App
  app: {
    title: string;
    subtitle: string;
  };
  
  // Module Engine
    module: {
      loading: string;
      error: string;
      complete: string;
      completeMessage: string;
      returnToSelection: string;
      exit: string;
      backToModules: string;
    };
  
  // Dialogue
  dialogue: {
    continue: string;
    continueHint: string;
    submit: string;
    placeholder: string;
  };
  
  // Task Acceptance
  task: {
    requirements: string;
    whatToDo: string;
    minimumLength: string;
    requiredKeywords: string;
    bonusChallenges: string;
    back: string;
    accept: string;
  };
  
  // Story Submission
  story: {
    submitTitle: string;
    submitButton: string;
    evaluating: string;
    pasteStory: string;
    success: string;
    failure: string;
    failureMessage: string;
    error: string;
  };
  
  // AI Chat
  aiChat: {
    title: string;
    placeholder: string;
    send: string;
    copy: string;
    copied: string;
  };
  
  // Common
  common: {
    characters: string;
    error: string;
    loading: string;
    close: string;
    back: string;
  };
  
  // Guard Agent
  guard: {
    name: string;
    role: string;
    response: string;
  };
  
  // Lab Assistant
  labAssistant: {
    name: string;
    role: string;
    reflectionQuestion: string;
    placeholder: string;
    evaluating: string;
    submit: string;
    success: string;
    tooShort: string;
    password: string;
    passwordHint: string;
    continue: string;
  };
  
  // Criteria Display
  criteria: {
    title: string;
    task: string;
    minimumLength: string;
    requiredKeywords: string;
  };
  
  // Answer Submission
  answer: {
    placeholder: string;
    evaluating: string;
    submit: string;
    error: string;
  };
  
  // AI Chat
  aiChatSystem: {
    welcome: string;
    system: string;
    assistant: string;
    typing: string;
    placeholder: string;
  };
  
  // Story Submission
  storySubmission: {
    description: string;
    guardResponse: string;
  };
  
  // Module Selection
  moduleSelection: {
    noModules: string;
  };
  
  // Errors
  errors: {
    unknownComponent: string;
    worldMapMissing: string;
    evaluateStory: string;
    evaluateAnswer: string;
  };
  
  // Interactables
  interactables: {
    newTask: string;
    requirementPrefix: string;
    requirementTask1: string;
    requirementTask2: string;
    requirementLocked: string;
    guardDescription: string;
    aiCompanionDescription: string;
    fridgeDescription: string;
  };
  
  // Task Details
  taskDetails: {
    beginTask: string;
    cancel: string;
  };
  
  // UI Labels
  ui: {
    copyMessage: string;
    availableTypes: string;
  };

  // Fridge Modal
  fridge: {
    title: string;
    description: string;
    imageAlt: string;
    noImage: string;
  };

  // Module Content
  modules: {
    intro: {
      name: string;
      description: string;
      welcome: {
        lines: string[];
      };
    };
    textGenerationCastle: {
      welcome: {
        lines: string[];
      };
      name: string;
      description: string;
      interactables: {
        castleGuard: string;
        aiCompanion: string;
        fridge: string;
      };
      task1: {
        description: string;
        guardIntro: {
          lines: string[];
          question: string;
          choices: string[];
        };
        guardDialogue: string;
        readyCheck: {
          lines: string[];
          question: string;
          choices: string[];
        };
        reflection: string;
      };
      task2: {
        description: string;
        guardIntro: {
          lines: string[];
          question: string;
          choices: string[];
        };
        guardDialogue: string;
        reflection: string;
      };
    };
    imageRecognition: {
      name: string;
      description: string;
      welcome: {
        lines: string[];
      };
    };
    soundMusicGeneration: {
      name: string;
      description: string;
      welcome: {
        lines: string[];
      };
    };
    videoGeneration: {
      name: string;
      description: string;
      welcome: {
        lines: string[];
      };
    };
    codeGenerationLab: {
      name: string;
      description: string;
      welcome: {
        lines: string[];
      };
      interactables?: {
        castleGuard?: string;
        aiCompanion?: string;
      };
    };
  };
};

export const translations: Record<Locale, Translations> = {
  sv: {
    app: {
      title: 'AI Lab',
      subtitle: 'Välj en modul för att börja din läranderesa',
    },
    module: {
      loading: 'Laddar modul...',
      error: 'Fel vid laddning av modul',
      complete: 'Modul Klar!',
      completeMessage: 'Bra jobbat med att slutföra alla uppgifter!',
      returnToSelection: 'Tillbaka till Modulval',
      exit: 'Avsluta',
      backToModules: 'Tillbaka till moduler',
    },
    dialogue: {
      continue: 'Tryck Enter för att fortsätta',
      continueHint: 'Tryck Enter för att fortsätta',
      submit: 'Skicka',
      placeholder: 'Skriv ditt svar...',
    },
    task: {
      requirements: '📋 Uppgiftskrav',
      whatToDo: '📝 Vad Du Behöver Göra:',
      minimumLength: '📏 Minsta Längd',
      requiredKeywords: '🔑 Obligatoriska Nyckelord',
      bonusChallenges: '⚡ Bonusutmaningar (Valfritt)',
      back: '← Tillbaka',
      accept: 'Ja, jag hjälper gärna! →',
    },
    story: {
      submitTitle: 'Skicka In Din Berättelse',
      submitButton: 'Skicka Berättelse',
      evaluating: 'Utvärderar...',
      pasteStory: 'Klistra in din berättelse här...',
      success: '🎉 Utmärkt arbete! Din berättelse har accepterats. Uppgift klar!',
      failure: 'Berättelsen behöver förbättras',
      failureMessage: 'Vakten tycker att din berättelse behöver några förbättringar. Gå tillbaka till AI-kompanjonen för att revidera den, försök sedan igen!',
      error: 'Fel',
    },
    aiChat: {
      title: 'AI Kompanjon',
      placeholder: 'Skriv ditt meddelande...',
      send: '📤',
      copy: 'Kopiera',
      copied: 'Kopierad!',
    },
    common: {
      characters: 'tecken',
      error: 'Fel',
      loading: 'Laddar...',
      close: 'Stäng',
      back: 'Tillbaka',
    },
    guard: {
      name: 'Slottvakt',
      role: 'Uppgiftsutvärderare',
      response: 'Vaktens Svar:',
    },
    labAssistant: {
      name: 'Labassistent',
      role: 'Reflektion & Utvärdering',
      reflectionQuestion: 'Reflektionsfråga:',
      placeholder: 'Skriv din reflektion här...',
      evaluating: 'Utvärderar...',
      submit: 'Skicka Reflektion',
      success: 'Utmärkt reflektion! Du har visat god förståelse. Här är ditt lösenord för att låsa upp nästa uppgift.',
      tooShort: 'Ditt svar är lite kort. Kan du utveckla dina tankar mer? Försök skriva minst 20 tecken.',
      password: 'Ditt Lösenord:',
      passwordHint: 'Använd detta lösenord för att låsa upp nästa uppgift på kartan',
      continue: 'Fortsätt →',
    },
    criteria: {
      title: 'Uppgiftskriterier',
      task: 'Uppgift:',
      minimumLength: 'Minsta Längd:',
      requiredKeywords: 'Obligatoriska Nyckelord:',
    },
    answer: {
      placeholder: 'Skriv ditt svar här...',
      evaluating: 'Utvärderar...',
      submit: 'Skicka Svar',
      error: 'Fel',
    },
    aiChatSystem: {
      welcome: 'Välkommen till AI-chatten! Använd detta för att hjälpa dig slutföra dina uppgifter.',
      system: 'SYSTEM',
      assistant: 'AI-assistent',
      typing: 'AI skriver',
      placeholder: 'Skriv ditt meddelande här...',
    },
    storySubmission: {
      description: 'Klistra in din färdiga berättelse nedan. Vakten kommer att utvärdera den och låta dig veta om den uppfyller kraven.',
      guardResponse: 'Vaktens Svar:',
    },
    moduleSelection: {
      noModules: 'Inga moduler tillgängliga. Kom tillbaka senare!',
    },
    errors: {
      unknownComponent: 'Okänd komponenttyp:',
      worldMapMissing: 'Fel: WorldMap-konfiguration saknas',
      evaluateStory: 'Misslyckades med att utvärdera berättelse',
      evaluateAnswer: 'Misslyckades med att utvärdera svar',
    },
    interactables: {
      newTask: 'Ny uppgift tillgänglig',
      requirementPrefix: 'Krav: ',
      requirementTask1: 'Slutför uppgift 1',
      requirementTask2: 'Slutför uppgift 2',
      requirementLocked: 'Låst',
      guardDescription: 'Prata med vakten för att starta uppgifter och lämna in dina svar',
      aiCompanionDescription: 'Chatta med AI:n för att få hjälp med dina uppgifter',
      fridgeDescription: 'Titta på innehållet i kylskåpet för att planera middagen',
    },
    taskDetails: {
      beginTask: 'Börja Uppgift →',
      cancel: 'Avbryt',
    },
    ui: {
      copyMessage: 'Kopiera meddelande',
      availableTypes: 'Tillgängliga typer:',
    },
    fridge: {
      title: 'Vaktens Kylskåp',
      description: 'Här är vad som finns i vakten kylskåp. Använd denna information för att planera den romantiska middagen!',
      imageAlt: 'Bild på innehållet i vakten kylskåp',
      noImage: 'Ingen bild tillgänglig',
    },
    modules: {
      intro: {
        name: 'Introduktion',
        description: 'Kom igång med AI Lab och lär dig grunderna',
        welcome: {
          lines: [
            'Välkommen till AI Lab!',
            'Detta är där du kommer att lära dig om artificiell intelligens genom praktiska aktiviteter.',
            'Låt oss börja med grunderna.',
          ],
        },
      },
      textGenerationCastle: {
        welcome: {
          lines: [
            'Välkommen till Textgenereringsslottet!',
            'I denna modul kommer du att lära dig hur AI kan hjälpa till att generera text och berättelser.',
            'Du kommer att träffa en vänlig slottvakt som behöver din hjälp med olika uppgifter.',
            'Använd AI-kompanjonen för att få hjälp när du behöver det!',
          ],
        },
        name: 'Textgenereringsslottet',
        description: 'Lär dig textgenerering med en vänlig slottvakt. Slutför uppgifter med AI och få feedback!',
        interactables: {
          castleGuard: 'Slottvakt',
          aiCompanion: 'AI Kompanjon',
          fridge: 'Kylskåp',
        },
        task1: {
          description: 'Skapa en komplett berättelse baserad på vaktens minnen. Berättelsen ska ha en tydlig början, mitt och slut, och innehålla element av äventyr och magi.',
          guardIntro: {
            lines: [
              'Hej där! Jag är slottvakten, och jag behöver din hjälp.',
              'Du förstår, jag minns att min mamma brukade berätta en underbar godnattsaga för mig när jag var liten.',
              'Men jag kan bara minnas bitar och delar - början, några fragment i mitten, och hur den slutade.',
              'Jag skulle älska att berätta en liknande berättelse för min egen son, men jag behöver hjälp att fylla i luckorna.',
            ],
            question: 'Kan du hjälpa mig skapa en komplett berättelse?',
            choices: [
              'Ja, jag hjälper gärna!',
              'Jag ska göra mitt bästa!',
              'Självklart! Låt oss skapa något fantastiskt!',
            ],
          },
          guardDialogue: 'Jag minns att berättelsen började med en ung hjälte som upptäckte en dold dörr i ett gammalt träd. I mitten fanns det en magisk varelse som hjälpte dem, och den slutade med att hjälten återvände hem visare. Kan du hjälpa mig skapa en komplett berättelse med dessa element?',
          readyCheck: {
            lines: [
              'Har du slutfört att skriva din berättelse med AI-kompanjonen?',
            ],
            question: 'Är din berättelse redo att skickas in?',
            choices: [
              'Ja, jag är redo!',
              'Inte än, jag behöver mer tid med AI:n',
            ],
          },
          reflection: 'Vad lärde du dig av att skapa denna berättelse? Hur hjälpte användningen av AI dig i processen?',
        },
        task2: {
          description: 'Planera en romantisk middagsmeny med ingredienser från vaktens kylskåp, med hänsyn till både preferenser och allergier.',
          guardIntro: {
            lines: [
              'Tack för att du hjälpte till med berättelsen! Nu har jag en ny utmaning för dig.',
              'Jag har en bild av vad som finns i mitt kylskåp, och jag behöver hjälp med att planera en romantisk middag för min fru.',
              'Vi har båda våra preferenser och några allergier jag behöver ta hänsyn till.',
              'Kan du hjälpa mig lista ut vad jag ska laga?',
            ],
            question: 'Är du redo för denna utmaning?',
            choices: [
              'Ja, låt oss planera den perfekta middagen!',
              'Jag är redo att hjälpa!',
              'Absolut!',
            ],
          },
          guardDialogue: 'Här är vad jag har i mitt kylskåp: [kylskåpsbild]. Min fru älskar italiensk mat och är allergisk mot nötter. Jag föredrar lättare måltider. Kan du hjälpa mig skapa en romantisk middagsplan?',
          reflection: 'Hur hjälpte AI dig att planera middagen? Vilka överväganden gjorde du för preferenser och allergier?',
        },
      },
      imageRecognition: {
        name: 'Bildigenkänning',
        description: 'Utforska hur AI kan identifiera och förstå bilder',
        welcome: {
          lines: [
            'Välkommen till Bildigenkänningsmodulen!',
            'Här kommer du att utforska hur AI kan identifiera och förstå bilder.',
            'Du kommer att lära dig om bildklassificering, objektigenkänning och mycket mer.',
            'Låt oss börja!',
          ],
        },
      },
      soundMusicGeneration: {
        name: 'Ljud & Musikgenerering',
        description: 'Skapa musik och ljud med AI',
        welcome: {
          lines: [
            'Välkommen till Ljud & Musikgenereringsmodulen!',
            'I denna modul kommer du att lära dig hur AI kan skapa musik och ljud.',
            'Du kommer att experimentera med olika AI-verktyg för att generera melodier, rytmer och ljudeffekter.',
            'Låt oss börja din musikaliska resa!',
          ],
        },
      },
      videoGeneration: {
        name: 'Videogenerering',
        description: 'Generera och redigera videor med AI-hjälp',
        welcome: {
          lines: [
            'Välkommen till Videogenereringsmodulen!',
            'Här kommer du att lära dig hur AI kan hjälpa till att generera och redigera videor.',
            'Du kommer att utforska olika tekniker för att skapa videor med AI-assistans.',
            'Låt oss börja skapa något fantastiskt!',
          ],
        },
      },
      codeGenerationLab: {
        name: 'Kodgenereringslab',
        description: 'Lär dig att generera, felsöka och refaktorisera kod med AI-hjälp. Bemästra konsten med AI-drivet programmering!',
        welcome: {
          lines: [
            'Välkommen till Kodgenereringslabben!',
            'Här kommer du att lära dig hur AI kan hjälpa dig att skriva, felsöka och förbättra kod.',
            'Du kommer att arbeta med en kodningsmentor som guidar dig genom praktiska programmeringsutmaningar.',
            'Låt oss börja med att utforska labben!',
          ],
        },
        interactables: {
          castleGuard: 'Kodningsmentor',
          aiCompanion: 'AI-kodassistent',
        },
      },
    },
  },
  en: {
    app: {
      title: 'AI Lab',
      subtitle: 'Choose a module to begin your learning journey',
    },
    module: {
      loading: 'Loading module...',
      error: 'Error loading module',
      complete: 'Module Complete!',
      completeMessage: 'Great job completing all the tasks!',
      returnToSelection: 'Return to Module Selection',
      exit: 'Exit',
      backToModules: 'Back to Modules',
    },
    dialogue: {
      continue: 'Press Enter to continue',
      continueHint: 'Press Enter to continue',
      submit: 'Submit',
      placeholder: 'Type your answer...',
    },
    task: {
      requirements: '📋 Task Requirements',
      whatToDo: '📝 What You Need To Do:',
      minimumLength: '📏 Minimum Length',
      requiredKeywords: '🔑 Required Keywords',
      bonusChallenges: '⚡ Bonus Challenges (Optional)',
      back: '← Back',
      accept: "Yes, I'll Help! →",
    },
    story: {
      submitTitle: 'Submit Your Story',
      submitButton: 'Submit Story',
      evaluating: 'Evaluating...',
      pasteStory: 'Paste your story here...',
      success: 'Story approved!',
      failure: 'Story needs improvement',
      failureMessage: 'The Guard thinks your story needs some improvements. Go back to the AI Companion to revise it, then try again!',
      error: 'Error',
    },
    aiChat: {
      title: 'AI Companion',
      placeholder: 'Type your message...',
      send: '📤',
      copy: 'Copy',
      copied: 'Copied!',
    },
    common: {
      characters: 'characters',
      error: 'Error',
      loading: 'Loading...',
      close: 'Close',
      back: 'Back',
    },
    guard: {
      name: 'Castle Guard',
      role: 'Task Evaluator',
      response: "Guard's Response:",
    },
    labAssistant: {
      name: 'Lab Assistant',
      role: 'Reflection & Evaluation',
      reflectionQuestion: 'Reflection Question:',
      placeholder: 'Type your reflection here...',
      evaluating: 'Evaluating...',
      submit: 'Submit Reflection',
      success: "Great reflection! You've shown good understanding. Here\'s your password to unlock the next task.",
      tooShort: 'Your answer is a bit short. Can you elaborate more on your thoughts? Try to write at least 20 characters.',
      password: 'Your Password:',
      passwordHint: 'Use this password to unlock the next task on the map',
      continue: 'Continue →',
    },
    criteria: {
      title: 'Task Criteria',
      task: 'Task:',
      minimumLength: 'Minimum Length:',
      requiredKeywords: 'Required Keywords:',
    },
    answer: {
      placeholder: 'Type your answer here...',
      evaluating: 'Evaluating...',
      submit: 'Submit Answer',
      error: 'Error',
    },
    aiChatSystem: {
      welcome: 'Welcome to the AI Chat! Use this to help you complete your tasks.',
      system: 'SYSTEM',
      assistant: 'AI Assistant',
      typing: 'AI is typing',
      placeholder: 'Type your message here...',
    },
    storySubmission: {
      description: 'Paste your completed story below. The Guard will evaluate it and let you know if it meets the requirements.',
      guardResponse: "Guard's Response:",
    },
    moduleSelection: {
      noModules: 'No modules available. Check back later!',
    },
    errors: {
      unknownComponent: 'Unknown component type:',
      worldMapMissing: 'Error: WorldMap configuration is missing',
      evaluateStory: 'Failed to evaluate story',
      evaluateAnswer: 'Failed to evaluate answer',
    },
    interactables: {
      newTask: 'New task available',
      requirementPrefix: 'Requirement: ',
      requirementTask1: 'Finish task 1',
      requirementTask2: 'Finish task 2',
      requirementLocked: 'Locked',
      guardDescription: 'Talk to the guard to start tasks and submit your answers',
      aiCompanionDescription: 'Chat with the AI to get help with your tasks',
      fridgeDescription: 'View the fridge contents to plan the dinner',
    },
    taskDetails: {
      beginTask: 'Begin Task →',
      cancel: 'Cancel',
    },
    ui: {
      copyMessage: 'Copy message',
      availableTypes: 'Available types:',
    },
    fridge: {
      title: "Guard's Fridge",
      description: "Here\'s what\'s in the guard\'s fridge. Use this information to plan the romantic dinner!",
      imageAlt: 'Image of the contents of the guard\'s fridge',
      noImage: 'No image available',
    },
    modules: {
      intro: {
        name: 'Introduction',
        description: 'Get started with the AI Lab and learn the basics',
        welcome: {
          lines: [
            'Welcome to the AI Lab!',
            'This is where you\'ll learn about artificial intelligence through hands-on activities.',
            'Let\'s start with the basics.',
          ],
        },
      },
      textGenerationCastle: {
        welcome: {
          lines: [
            'Welcome to the Text Generation Castle!',
            'In this module, you\'ll learn how AI can help generate text and stories.',
            'You\'ll meet a friendly castle guard who needs your help with various tasks.',
            'Use the AI Companion for help when you need it!',
          ],
        },
        name: 'Text Generation Castle',
        description: 'Learn text generation with a friendly castle guard. Complete tasks using AI and get feedback!',
        interactables: {
          castleGuard: 'Castle Guard',
          aiCompanion: 'AI Companion',
          fridge: 'Fridge',
        },
        task1: {
          description: 'Create a complete story based on the guard\'s memories. The story should have a clear beginning, middle, and end, and include elements of adventure and magic.',
          guardIntro: {
            lines: [
              'Hello there! I\'m the Castle Guard, and I need your help.',
              'You see, I remember my mother used to tell me a wonderful bedtime story when I was young.',
              'But I can only remember bits and pieces - the beginning, some fragments in the middle, and how it ended.',
              'I\'d love to tell a similar story to my own son, but I need help filling in the gaps.',
            ],
            question: 'Can you help me create a complete story?',
            choices: [
              'Yes, I\'d be happy to help!',
              'I\'ll do my best!',
              'Of course! Let\'s create something amazing!',
            ],
          },
          guardDialogue: 'I remember the story started with a young hero discovering a hidden door in an old tree. In the middle, there was a magical creature that helped them, and it ended with the hero returning home wiser. Can you help me create a complete story with these elements?',
          readyCheck: {
            lines: [
              'Have you finished writing your story with the AI Companion?',
            ],
            question: 'Is your story ready to submit?',
            choices: [
              'Yes, I\'m ready!',
              'Not yet, I need more time with the AI',
            ],
          },
          reflection: 'What did you learn from creating this story? How did using AI help you in the process?',
        },
        task2: {
          description: 'Plan a romantic dinner menu using ingredients from the guard\'s fridge, considering both preferences and allergies.',
          guardIntro: {
            lines: [
              'Thank you for helping with the story! Now I have another challenge for you.',
              'I have a picture of what\'s in my fridge, and I need help planning a romantic dinner for my wife.',
              'We both have our preferences and some allergies I need to consider.',
              'Can you help me figure out what to cook?',
            ],
            question: 'Are you ready for this challenge?',
            choices: [
              'Yes, let\'s plan the perfect dinner!',
              'I\'m ready to help!',
              'Absolutely!',
            ],
          },
          guardDialogue: 'Here\'s what I have in my fridge: [fridge image]. My wife loves Italian food and is allergic to nuts. I prefer lighter meals. Can you help me create a romantic dinner plan?',
          reflection: 'How did AI help you plan the dinner? What considerations did you make for preferences and allergies?',
        },
      },
      imageRecognition: {
        name: 'Image Recognition',
        description: 'Explore how AI can identify and understand images',
        welcome: {
          lines: [
            'Welcome to the Image Recognition module!',
            'Here you\'ll explore how AI can identify and understand images.',
            'You\'ll learn about image classification, object recognition, and much more.',
            'Let\'s get started!',
          ],
        },
      },
      soundMusicGeneration: {
        name: 'Sound & Music Generation',
        description: 'Create music and sounds using AI',
        welcome: {
          lines: [
            'Welcome to the Sound & Music Generation module!',
            'In this module, you\'ll learn how AI can create music and sounds.',
            'You\'ll experiment with different AI tools to generate melodies, rhythms, and sound effects.',
            'Let\'s begin your musical journey!',
          ],
        },
      },
      videoGeneration: {
        name: 'Video Generation',
        description: 'Generate and edit videos with AI assistance',
        welcome: {
          lines: [
            'Welcome to the Video Generation module!',
            'Here you\'ll learn how AI can help generate and edit videos.',
            'You\'ll explore different techniques for creating videos with AI assistance.',
            'Let\'s start creating something amazing!',
          ],
        },
      },
      codeGenerationLab: {
        name: 'Code Generation Lab',
        description: 'Learn to generate, debug, and refactor code with AI assistance. Master the art of AI-powered programming!',
        welcome: {
          lines: [
            'Welcome to the Code Generation Lab!',
            'Here you\'ll learn how AI can help you write, debug, and improve code.',
            'You\'ll work with a coding mentor who will guide you through practical programming challenges.',
            'Let\'s start by exploring the lab!',
          ],
        },
        interactables: {
          castleGuard: 'Coding Mentor',
          aiCompanion: 'AI Code Assistant',
        },
      },
    },
  },
};

