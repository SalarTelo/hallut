import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';
import { useI18n } from '../../i18n/context.js';
import { useModuleStore } from '../../store/moduleStore.js';
import type { OllamaMessage } from '../../services/ollama.js';
import '../../styles/game-theme.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AiChatModalProps {
  onNext?: () => void;
  systemPrompt?: string;
  moduleState?: Record<string, unknown>;
  onStoryReady?: () => void;
  ollamaModel?: string; // Ollama model to use (e.g., 'llama3.2', 'mistral', etc.)
  ollamaUrl?: string; // Ollama server URL (default: http://localhost:11434)
}

export function AiChatModal({ 
  onNext, 
  systemPrompt, 
  moduleState: _moduleState, 
  onStoryReady,
  ollamaModel,
  ollamaUrl,
}: AiChatModalProps) {
  const { t } = useI18n();
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  
  // Storage key for chat messages (per module)
  const storageKey = currentModuleId ? `ai-chat-${currentModuleId}` : 'ai-chat-default';
  
  // Load messages from localStorage on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    // Default: just system message
    return [
      {
        id: '1',
        role: 'system',
        content: systemPrompt || t.aiChatSystem.welcome,
        timestamp: new Date(),
      },
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    // Auto-scroll to bottom when messages update (including during streaming)
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

    // Create a placeholder AI message that we'll update as chunks arrive
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      // Convert messages to Ollama format (excluding the placeholder we just added)
      const ollamaMessages: OllamaMessage[] = messages
        .filter(m => m.role !== 'system') // Remove old system messages
        .map(m => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }));

      // Add system prompt if provided
      if (systemPrompt) {
        ollamaMessages.unshift({
          role: 'system',
          content: systemPrompt,
        });
      }

      // Add the new user message
      ollamaMessages.push({
        role: 'user',
        content: messageContent,
      });

      // Call Ollama API with streaming
      const url = ollamaUrl?.startsWith('/') 
        ? `${ollamaUrl}/chat`
        : `${ollamaUrl || 'http://localhost:11434'}/api/chat`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel || 'llama3.2',
          messages: ollamaMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullResponse += data.message.content;
              // Update the message in real-time
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: fullResponse }
                    : msg
                )
              );
            }
            if (data.done) {
              setIsLoading(false);
              return;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorContent = error instanceof Error 
        ? error.message 
        : 'Tyvärr kunde jag inte få svar från AI-modellen. Kontrollera att Ollama körs (kör "ollama serve" i terminalen) och att en modell är installerad (t.ex. "ollama pull llama3.2").';
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleClose = () => {
    // If player has used the AI chat, mark story as ready
    if (onStoryReady && messages.length > 2) {
      onStoryReady();
    }
    if (onNext) {
      onNext();
    }
  };

  return (
    <div
      className="game-surface-elevated"
      style={{
        padding: 'var(--spacing-5)',
        border: '3px solid var(--game-world-border)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        maxHeight: '70vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 'var(--spacing-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            color: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-lg)',
          }}
        >
          {t.aiChat.title}
        </h2>
        <Button
          onClick={handleClose}
          variant="secondary"
          style={{
            padding: 'var(--spacing-2) var(--spacing-3)',
            minWidth: 'auto',
          }}
        >
          ✕
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-5)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-4)',
            minHeight: '400px',
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: 'var(--spacing-5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: 'var(--spacing-4) var(--spacing-5)',
                  borderRadius:
                    message.role === 'user'
                      ? 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)'
                      : 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)',
                  backgroundColor:
                    message.role === 'user'
                      ? 'var(--game-primary)'
                      : message.role === 'assistant'
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'rgba(0, 0, 0, 0.5)',
                  border: `2px solid ${
                    message.role === 'user'
                      ? 'var(--game-world-border)'
                      : message.role === 'assistant'
                        ? 'rgba(0, 0, 0, 0.1)'
                        : 'transparent'
                  }`,
                  color: message.role === 'assistant' 
                    ? 'rgba(0, 0, 0, 0.9)' 
                    : 'var(--game-text-primary)',
                  boxShadow: message.role === 'assistant'
                    ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                    : 'var(--shadow-md)',
                  wordWrap: 'break-word',
                  lineHeight: '1.6',
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
                    style={{
                      marginBottom: 'var(--spacing-2)',
                      color: 'rgba(0, 0, 0, 0.6)',
                      fontFamily: 'var(--font-family-base)',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t.aiChatSystem.assistant}
                  </div>
                )}
                <div 
                  style={{ 
                    fontSize: '15px',
                    lineHeight: '1.7',
                    fontFamily: 'var(--font-family-base)',
                    color: message.role === 'assistant' 
                      ? 'rgba(0, 0, 0, 0.9)' 
                      : 'var(--game-text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {message.content}
                </div>
                <div
                  style={{
                    marginTop: 'var(--spacing-3)',
                    fontSize: '11px',
                    opacity: 0.6,
                    textAlign: 'right',
                    fontFamily: 'var(--font-family-base)',
                    color: message.role === 'assistant' 
                      ? 'rgba(0, 0, 0, 0.5)' 
                      : 'var(--game-text-secondary)',
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
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

        {/* Input area */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.aiChat.placeholder}
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
      </div>
    </div>
  );
}

