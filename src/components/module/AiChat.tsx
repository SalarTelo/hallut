import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';
import { useI18n } from '../../i18n/context.js';
import '../../styles/game-theme.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AiChatProps {
  systemPrompt?: string;
  onMessage?: (message: string) => void;
  initialMessages?: Message[];
  onNext?: () => void;
}

export function AiChat({ systemPrompt, onMessage, initialMessages, onNext }: AiChatProps) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>(
    initialMessages || [
      {
        id: '1',
        role: 'system',
        content: systemPrompt || t.aiChatSystem.welcome,
        timestamp: new Date(),
      },
    ]
  );
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    if (onMessage) {
      onMessage(messageContent);
    }

    // For MVP: Placeholder response
    // TODO: Integrate with actual AI endpoint
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm here to help! You said: "${messageContent}". In a full implementation, I would connect to an AI model to provide real responses.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div className="game-surface-elevated" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '700px', padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: 'var(--spacing-5)',
            background: 'linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%)',
            borderBottom: '3px solid var(--game-world-border)',
            color: 'var(--game-text-primary)',
          }}
        >
          <h3
            className="h3"
            style={{
              margin: 0,
              fontFamily: 'var(--font-family-pixel)',
              color: 'var(--game-world-border)',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            AI Assistant
          </h3>
          <p
            className="text-sm"
            style={{
              margin: 'var(--spacing-2) 0 0 0',
              opacity: 0.9,
              color: 'var(--game-text-secondary)',
            }}
          >
            Use this chat to brainstorm ideas and get help with your tasks
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-5)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            minHeight: '300px',
            maxHeight: '500px',
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: 'var(--spacing-4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: 'var(--spacing-4)',
                  borderRadius:
                    message.role === 'user'
                      ? 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)'
                      : 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)',
                  backgroundColor:
                    message.role === 'user'
                      ? 'var(--game-primary)'
                      : message.role === 'assistant'
                        ? 'var(--game-surface)'
                        : 'rgba(0, 0, 0, 0.4)',
                  border: `2px solid ${
                    message.role === 'user'
                      ? 'var(--game-world-border)'
                      : message.role === 'assistant'
                        ? 'var(--game-world-border-light)'
                        : 'transparent'
                  }`,
                  color: 'var(--game-text-primary)',
                  boxShadow: 'var(--shadow-md)',
                  wordWrap: 'break-word',
                  position: 'relative',
                }}
              >
                {message.role === 'system' && (
                  <div
                    className="text-xs font-bold"
                    style={{
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--game-world-border)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: 'var(--font-family-pixel)',
                    }}
                  >
                    SYSTEM
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div
                    className="text-xs font-semibold"
                    style={{
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--game-text-secondary)',
                      fontFamily: 'var(--font-family-pixel)',
                    }}
                  >
                    {t.aiChatSystem.assistant}
                  </div>
                )}
                <div className="text-base" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                  {message.content}
                </div>
                <div
                  className="text-xs"
                  style={{
                    marginTop: 'var(--spacing-2)',
                    opacity: 0.7,
                    textAlign: 'right',
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
                {message.role !== 'system' && (
                  <button
                    onClick={() => copyMessage(message.content)}
                    aria-label={t.ui.copyMessage}
                    style={{
                      position: 'absolute',
                      top: 'var(--spacing-2)',
                      right: 'var(--spacing-2)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--game-world-border-light)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--spacing-1)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-xs)',
                      opacity: 0.6,
                      transition: 'opacity var(--transition-base)',
                      color: 'var(--game-text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                    }}
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-3)' }}>
              <div
                className="game-surface"
                style={{
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}
              >
                <LoadingSpinner size="sm" color="var(--game-world-border)" />
                <span className="text-xs" style={{ color: 'var(--game-text-secondary)' }}>
                  {t.aiChatSystem.typing}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-5)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderTop: '3px solid var(--game-world-border)',
          }}
        >
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.aiChatSystem.placeholder}
            disabled={isLoading}
            fullWidth
            className="game-input"
            style={{
              marginBottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderColor: 'var(--game-world-border)',
              color: 'var(--game-text-primary)',
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            loading={isLoading}
            style={{
              backgroundColor: 'var(--game-world-border)',
              color: 'var(--game-world-bg)',
              borderColor: 'var(--game-world-border)',
              fontFamily: 'var(--font-family-pixel)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {isLoading ? '' : '📤'}
          </Button>
        </form>

        {onNext && messages.length > 2 && (
          <div
            style={{
              padding: 'var(--spacing-4) var(--spacing-5)',
              borderTop: '3px solid var(--game-world-border)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <Button
              variant="primary"
              onClick={onNext}
              fullWidth
              style={{
                backgroundColor: 'var(--game-world-border)',
                color: 'var(--game-world-bg)',
                borderColor: 'var(--game-world-border)',
                fontFamily: 'var(--font-family-pixel)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Continue to Task →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
