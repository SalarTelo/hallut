import { useEffect, useState, useCallback, useRef } from 'react';
import { CharacterPortrait } from './CharacterPortrait.js';
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { useI18n } from '../../i18n/context.js';
import { useModuleStore } from '../../store/moduleStore.js';
import { moduleActions } from '../../store/moduleActions.js';
import '../../styles/dialogue.css';

export interface DialogueProps {
  speaker: string;
  text?: string; // Single line (for backward compatibility)
  lines?: string[]; // Multiple dialogue lines (JRPG style)
  avatar?: string;
  portraitUrl?: string; // Full portrait image URL for RPG style
  role?: string; // Character role to display below name
  onContinue?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  showBackButton?: boolean;
  typewriterEffect?: boolean;
  typewriterSpeed?: number;
  // Interactive dialogue props
  question?: string; // Question to ask the player
  inputType?: 'text' | 'choices'; // Type of input
  choices?: string[]; // Multiple choice options
  responseKey?: string; // Key to store response in moduleState
  onResponse?: (response: string) => void; // Callback when player responds
  moduleState?: Record<string, unknown>; // Module state for storing responses (deprecated - use store)
  placeholder?: string; // Placeholder for text input
}

export function Dialogue({
  speaker,
  text,
  lines,
  avatar,
  portraitUrl,
  role,
  onContinue,
  onNext,
  onPrevious,
  autoAdvance = false,
  autoAdvanceDelay = 3000,
  showBackButton = false,
  typewriterEffect = true,
  typewriterSpeed = 30,
  question,
  inputType = 'text',
  choices = [],
  responseKey,
  onResponse,
  moduleState: moduleStateProp, // Keep for backward compatibility
  placeholder,
}: DialogueProps) {
  const { t } = useI18n();
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const defaultPlaceholder = placeholder || t.dialogue.placeholder;
  // Support both single text and multiple lines
  const dialogueLines = lines || (text ? [text] : []);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playerResponse, setPlayerResponse] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLine = dialogueLines[currentLineIndex] || '';
  const isLastLine = currentLineIndex >= dialogueLines.length - 1;
  const showQuestion = isLastLine && !isTyping && (question || (choices && choices.length > 0));
  const handleContinue = onNext || onContinue;

  useEffect(() => {
    setIsVisible(true);
    setCurrentLineIndex(0);
    setDisplayedText('');
    setIsTyping(false);
    setPlayerResponse('');
    setSelectedChoice(null);
  }, [dialogueLines.length]); // Reset when dialogue lines change

  useEffect(() => {
    // Clear any existing interval
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
      typewriterIntervalRef.current = null;
    }

    if (typewriterEffect && currentLine) {
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;
      
      typewriterIntervalRef.current = setInterval(() => {
        if (currentIndex < currentLine.length) {
          setDisplayedText(currentLine.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          if (typewriterIntervalRef.current) {
            clearInterval(typewriterIntervalRef.current);
            typewriterIntervalRef.current = null;
          }
        }
      }, typewriterSpeed);
      
      return () => {
        if (typewriterIntervalRef.current) {
          clearInterval(typewriterIntervalRef.current);
          typewriterIntervalRef.current = null;
        }
      };
    } else {
      setDisplayedText(currentLine);
      setIsTyping(false);
    }
  }, [currentLine, typewriterEffect, typewriterSpeed]);

  // Focus input when question appears
  useEffect(() => {
    if (showQuestion && inputType === 'text' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showQuestion, inputType]);

  useEffect(() => {
    if (autoAdvance && handleContinue && !isTyping && isLastLine && !question) {
      const timer = setTimeout(() => {
        handleContinue();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, autoAdvanceDelay, handleContinue, isTyping, isLastLine, question]);

  const submitResponse = useCallback((response: string) => {
    // Store response in moduleState if responseKey is provided
    if (responseKey && currentModuleId) {
      moduleActions.setModuleStateField(
        currentModuleId,
        responseKey as keyof import('../../types/moduleState.types.js').ModuleState,
        response
      );
    }

    // Call onResponse callback if provided
    if (onResponse) {
      onResponse(response);
    }

    // Advance to next step
    if (handleContinue) {
      handleContinue();
    }
  }, [responseKey, currentModuleId, onResponse, handleContinue]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const response = inputType === 'choices' ? selectedChoice : playerResponse.trim();
    if (response) {
      submitResponse(response);
    }
  }, [inputType, selectedChoice, playerResponse, submitResponse]);

  const advanceDialogue = useCallback(() => {
    if (isTyping) {
      // Skip typewriter effect - show full text immediately
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
      setDisplayedText(currentLine);
      setIsTyping(false);
      return;
    }

    if (showQuestion) {
      // If there's a question, don't advance - wait for response
      return;
    }

    if (!isLastLine) {
      // Move to next dialogue line
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // All lines shown, advance to next step
      if (handleContinue) {
        handleContinue();
      }
    }
  }, [isTyping, currentLine, isLastLine, showQuestion, handleContinue]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (showQuestion && inputType === 'text' && e.key === 'Enter' && playerResponse.trim()) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!showQuestion) {
        advanceDialogue();
      }
    } else if (e.key === 'Escape' && onPrevious) {
      e.preventDefault();
      onPrevious();
    }
  }, [advanceDialogue, onPrevious, showQuestion, inputType, playerResponse, handleSubmit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (dialogueLines.length === 0) {
    return null;
  }

  return (
    <div
      className="dialogue-overlay"
      role="dialog"
      aria-labelledby="dialogue-speaker"
      aria-describedby="dialogue-text"
      aria-modal="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity var(--transition-base)',
        backgroundColor: 'transparent',
      }}
    >
      <div className="dialogue-container">
        <CharacterPortrait
          imageUrl={portraitUrl}
          name={speaker}
          avatar={avatar}
          role={role}
        />
        
        <div className="dialogue-content">
          <div 
            className="dialogue-box"
            onClick={!showQuestion ? advanceDialogue : undefined}
            style={{ cursor: !showQuestion ? 'pointer' : 'default' }}
          >
            <p
              id="dialogue-text"
              className="dialogue-text"
            >
              {displayedText}
              {isTyping && <span style={{ opacity: 0.7 }}>|</span>}
            </p>

            {/* Question and input area */}
            {showQuestion && (
              <div
                style={{
                  marginTop: 'var(--spacing-4)',
                  paddingTop: 'var(--spacing-4)',
                  borderTop: '2px solid var(--color-dialogue-border)',
                }}
              >
                {question && (
                  <div
                    className="dialogue-text"
                    style={{
                      marginBottom: 'var(--spacing-4)',
                      color: 'var(--color-dialogue-border)',
                      fontWeight: 'bold',
                    }}
                  >
                    {question}
                  </div>
                )}

                {inputType === 'text' ? (
                  <form onSubmit={handleSubmit}>
                    <Input
                      ref={inputRef}
                      type="text"
                      value={playerResponse}
                      onChange={(e) => setPlayerResponse(e.target.value)}
                      placeholder={defaultPlaceholder}
                      fullWidth
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '2px solid var(--color-dialogue-border)',
                        color: 'var(--color-dialogue-text)',
                        fontFamily: 'var(--font-family-pixel)',
                        fontSize: 'var(--font-size-base)',
                        padding: 'var(--spacing-3)',
                      }}
                    />
                    <div style={{ marginTop: 'var(--spacing-3)', textAlign: 'right' }}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!playerResponse.trim()}
                        style={{
                          backgroundColor: 'var(--color-dialogue-border)',
                          color: 'var(--color-dialogue-bg)',
                          fontFamily: 'var(--font-family-pixel)',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        {t.dialogue.submit}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    {choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedChoice(choice);
                          setTimeout(() => submitResponse(choice), 300);
                        }}
                        className="dialogue-choice-btn"
                        style={{
                          padding: 'var(--spacing-3) var(--spacing-4)',
                          backgroundColor: selectedChoice === choice
                            ? 'var(--color-dialogue-border)'
                            : 'rgba(0, 0, 0, 0.3)',
                          color: selectedChoice === choice
                            ? 'var(--color-dialogue-bg)'
                            : 'var(--color-dialogue-text)',
                          border: '2px solid var(--color-dialogue-border)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-family-pixel)',
                          fontSize: 'var(--font-size-sm)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all var(--transition-base)',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedChoice !== choice) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 235, 59, 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedChoice !== choice) {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                          }
                        }}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!autoAdvance && !showQuestion && (
            <div className="dialogue-continue-hint">
              {isTyping 
                ? t.dialogue.continueHint 
                : isLastLine 
                  ? t.dialogue.continueHint
                  : `${t.dialogue.continueHint} (${currentLineIndex + 1}/${dialogueLines.length})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
