/**
 * Translations for text-generation module
 */

interface ModuleTranslations {
  manifest: {
    name: string;
    description: string;
  };
  welcome: {
    lines: string[];
  };
  interactables: {
    guard: {
      name: string;
    };
    aiCompanion: {
      name: string;
    };
    fridge: {
      name: string;
    };
  };
  dialogues: {
    guard_intro: {
      lines: string[];
    };
  };
  tasks: {
    task1: {
      name: string;
      description: string;
      intro: {
        lines: string[];
      };
    };
    task2: {
      name: string;
      description: string;
      intro: {
        lines: string[];
      };
    };
    task3: {
      name: string;
      description: string;
      intro: {
        lines: string[];
      };
    };
  };
  fridge: {
    title: string;
    description: string;
    imageAlt: string;
    noImage: string;
  };
}

export const translations: Record<string, ModuleTranslations> = {
  sv: {
    manifest: {
      name: 'Textgenerering',
      description: 'Lär dig att skriva kreativa texter med AI-stöd',
    },
    welcome: {
      lines: [
        'Välkommen till Textgenereringsmodulen!',
        'Här kommer du att hjälpa vakten med olika uppgifter.',
        'Låt oss börja!',
      ],
    },
    interactables: {
      guard: {
        name: 'Vakt',
      },
      aiCompanion: {
        name: 'AI-kompanjon',
      },
      fridge: {
        name: 'Kylskåp',
      },
    },
    dialogues: {
      guard_intro: {
        lines: [
          'Hej! Jag är vakten här.',
          'Jag har några uppgifter som jag behöver hjälp med.',
        ],
      },
    },
    tasks: {
      task1: {
        name: 'Återskapa en berättelse',
        description: 'Vakten minns en gammal saga som hans mor berättade för honom. Han minns början, några delar i mitten, och slutet. Skapa en berättelse som är tillräckligt lik den ursprungliga.',
        intro: {
          lines: [
            'Jag minns en saga som min mor brukade berätta för mig innan jag somnade.',
            'Jag vill berätta samma saga för min son, men jag minns inte hela berättelsen.',
            'Jag minns början, några delar i mitten, och slutet.',
            'Kan du hjälpa mig att skapa en berättelse som är lik den ursprungliga?',
          ],
        },
      },
      task2: {
        name: 'Romantisk middag',
        description: 'Vakten vill göra en romantisk middag till sin fru. Titta i kylskåpet och berätta vad han kan laga. Måste vara gjort av saker som finns i kylskåpet.',
        intro: {
          lines: [
            'Jag vill göra en romantisk middag till min fru ikväll.',
            'Kan du titta i mitt kylskåp och berätta vad jag kan laga?',
            'Det måste vara gjort av saker som faktiskt finns där.',
            'Titta i kylskåpet och kom tillbaka med förslag!',
          ],
        },
      },
      task3: {
        name: 'Reflektion om textgenererande AI',
        description: 'En reflektion om användningen av textgenererande AI som vakten frågar om. Det är inte riktigt en uppgift utan mer en reflektion.',
        intro: {
          lines: [
            'Jag har tänkt mycket på textgenererande AI nyligen.',
            'Jag skulle vilja höra dina tankar om hur vi använder den.',
            'Vad tror du om fördelar och nackdelar?',
            'Låt oss diskutera detta tillsammans.',
          ],
        },
      },
    },
    fridge: {
      title: 'Kylskåp',
      description: 'Titta på innehållet i kylskåpet och kom med förslag på vad som kan lagas.',
      imageAlt: 'Bild på kylskåpets innehåll',
      noImage: 'Bild kommer snart...',
    },
  },
  en: {
    manifest: {
      name: 'Text Generation',
      description: 'Learn to write creative texts with AI support',
    },
    welcome: {
      lines: [
        'Welcome to the Text Generation module!',
        'Here you will help the guard with various tasks.',
        'Let\'s begin!',
      ],
    },
    interactables: {
      guard: {
        name: 'Guard',
      },
      aiCompanion: {
        name: 'AI Companion',
      },
      fridge: {
        name: 'Fridge',
      },
    },
    dialogues: {
      guard_intro: {
        lines: [
          'Hello! I\'m the guard here.',
          'I have some tasks that I need help with.',
        ],
      },
    },
    tasks: {
      task1: {
        name: 'Recreate a Story',
        description: 'The guard remembers an old tale his mother used to tell him. He remembers the beginning, some parts in the middle, and the end. Create a story that is similar enough to the original.',
        intro: {
          lines: [
            'I remember a tale my mother used to tell me before I fell asleep.',
            'I want to tell the same tale to my son, but I don\'t remember the whole story.',
            'I remember the beginning, some parts in the middle, and the end.',
            'Can you help me create a story that is similar to the original?',
          ],
        },
      },
      task2: {
        name: 'Romantic Dinner',
        description: 'The guard wants to make a romantic dinner for his wife. Look in the fridge and tell him what he can cook. Must be made of things that are in the fridge.',
        intro: {
          lines: [
            'I want to make a romantic dinner for my wife tonight.',
            'Can you look in my fridge and tell me what I can cook?',
            'It must be made of things that are actually in there.',
            'Look in the fridge and come back with suggestions!',
          ],
        },
      },
      task3: {
        name: 'Reflection on Text-Generating AI',
        description: 'A reflection about the usage of text-generating AI that the guard asks you about. It\'s not really a task more so a reflection.',
        intro: {
          lines: [
            'I\'ve been thinking a lot about text-generating AI lately.',
            'I\'d like to hear your thoughts on how we use it.',
            'What do you think about the pros and cons?',
            'Let\'s discuss this together.',
          ],
        },
      },
    },
    fridge: {
      title: 'Fridge',
      description: 'Look at the contents of the fridge and suggest what can be cooked.',
      imageAlt: 'Image of fridge contents',
      noImage: 'Image coming soon...',
    },
  },
};

export function getTranslations(locale: string = 'sv'): ModuleTranslations {
  return translations[locale] || translations.sv;
}

export const t = translations.sv;
