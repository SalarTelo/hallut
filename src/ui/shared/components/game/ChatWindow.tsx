/**
 * Chat Window Component
 * Module-specific AI companion chat interface
 * Enhanced design with better readability and visual hierarchy
 */

import { useState, useEffect, useRef } from 'react';
import { Modal } from '../overlays/Modal.js';
import { PixelIcon } from '../icons/PixelIcon.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import { getHeaderGradient, getSeparatorGradient } from '../../utils/modalStyles.js';
import { streamChatMessage, type OllamaMessage } from '@services/ollamaService.js';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatWindowProps {
  /**
   * Whether the chat window is open
   */
  isOpen: boolean;

  /**
   * Callback to close the chat
   */
  onClose: () => void;

  /**
   * Chat title (default: "AI Companion")
   */
  title?: string;

  /**
   * Initial messages
   */
  messages?: ChatMessage[];

  /**
   * Callback when message is sent
   */
  onSend?: (message: string) => void;

  /**
   * Whether AI is typing (show typing indicator)
   */
  isTyping?: boolean;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;

  /**
   * Enable Ollama integration (default: true)
   */
  enableOllama?: boolean;

  /**
   * Ollama model to use (default: 'llama3.2')
   */
  ollamaModel?: string;
}

/**
 * Chat window component
 */
export function ChatWindow({
  isOpen,
  onClose,
  title = 'AI Companion',
  messages = [],
  onSend,
  isTyping = false,
  borderColor,
  enableOllama = true,
  ollamaModel = 'llama3.2',
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const [ollamaError, setOllamaError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const borderColorValue = useThemeBorderColor(borderColor);

  // Sync with external messages
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, isTyping]);

  /**
   * Convert chat messages to Ollama message format
   */
  const convertToOllamaMessages = (messages: ChatMessage[]): OllamaMessage[] => {
    return messages
      .filter((msg) => msg.sender === 'user' || msg.sender === 'ai')
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
  };

  /**
   * Update AI message with streaming text
   */
  const updateAiMessage = (messageId: string, text: string) => {
    setLocalMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, text } : msg))
    );
  };

  /**
   * Reset conversation
   */
  const handleReset = () => {
    setLocalMessages([]);
    setOllamaError(null);
    setInputValue('');
  };

  /**
   * Handle sending message
   */
  const handleSend = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmedValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setLocalMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setOllamaError(null);

    // Call onSend callback if it exists
    onSend?.(trimmedValue);

    // Get AI response with streaming if Ollama is enabled
    if (!enableOllama) return;

    const conversationHistory = convertToOllamaMessages(localMessages);
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    };

    // Add empty AI message for streaming
    setLocalMessages((prev) => [...prev, aiMessage]);

    try {
      let fullResponse = '';
      for await (const chunk of streamChatMessage(trimmedValue, conversationHistory, ollamaModel)) {
        fullResponse += chunk;
        updateAiMessage(aiMessageId, fullResponse);
      }
    } catch (error) {
      console.error('Ollama error:', error);
      setOllamaError('Could not connect to AI. Make sure Ollama is running.');

      // Replace empty message with error message
      setLocalMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== aiMessageId);
        return [
          ...filtered,
          {
            id: `error-${Date.now()}`,
            text: 'Sorry, I could not respond right now. Make sure Ollama is running and the model is installed.',
            sender: 'ai' as const,
            timestamp: new Date(),
          },
        ];
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      closeOnEscape
      closeOnOverlayClick
      showCloseButton={false}
      className="max-w-6xl"
      style={{ maxWidth: '1152px' }}
    >
      <div
        className="bg-black border rounded-lg flex flex-col h-[700px] overflow-hidden w-full"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${borderColorValue}40`,
        }}
      >
        {/* Compact header */}
        <div
          className="px-5 py-3 flex items-center justify-between flex-shrink-0 relative"
          style={{
            background: getHeaderGradient(borderColorValue),
          }}
        >
          {/* Subtle separator line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: getSeparatorGradient(borderColorValue),
            }}
          />
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${borderColorValue}25`,
                border: `1px solid ${borderColorValue}50`,
              }}
            >
              <PixelIcon type="star" size={18} color={borderColorValue} />
            </div>
            <h3 className="text-base font-bold text-yellow-300">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {localMessages.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 border"
                style={{
                  borderColor: borderColorValue,
                  backgroundColor: `${borderColorValue}15`,
                  color: borderColorValue,
                  boxShadow: `0 2px 8px ${borderColorValue}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${borderColorValue}25`;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${borderColorValue}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${borderColorValue}15`;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${borderColorValue}30`;
                }}
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <PixelIcon type="reload" size={16} color={borderColorValue} />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-gray-800"
              aria-label="Close chat"
            >
              <PixelIcon type="close" size={18} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${borderColorValue}40 transparent`,
        }}>
          {ollamaError && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-3 py-2 text-xs text-red-300 mb-2">
              {ollamaError}
            </div>
          )}
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${borderColorValue}15`,
                  border: `1px solid ${borderColorValue}30`,
                }}
              >
                <PixelIcon type="star" size={32} color={borderColorValue} className="opacity-70" />
              </div>
              <p className="text-base text-gray-300 mb-1 font-medium">
                No messages yet
              </p>
              <p className="text-sm text-gray-500">
                Start a conversation to get help
              </p>
            </div>
          ) : (
            <>
              {localMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''} max-w-[75%]`}>
                    {/* Avatar */}
                    {message.sender === 'ai' ? (
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${borderColorValue}25`,
                            border: `1px solid ${borderColorValue}50`,
                          }}
                        >
                          <PixelIcon type="star" size={18} color={borderColorValue} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-lg">
                          <span className="text-xs font-bold text-white">You</span>
                        </div>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`rounded-xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                      style={{
                        ...(message.sender === 'user' && {
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                        }),
                        ...(message.sender === 'ai' && {
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }),
                      }}
                    >
                      {message.sender === 'ai' && !message.text ? (
                        // Typing indicator for AI when message is empty (loading)
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                          {message.text && (
                            <p
                              className={`text-[11px] mt-2 opacity-70 ${
                                message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-3 max-w-[75%]">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${borderColorValue}25`,
                          border: `2px solid ${borderColorValue}50`,
                        }}
                      >
                        <PixelIcon type="star" size={18} color={borderColorValue} />
                      </div>
                    </div>
                    <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div
          className="px-5 py-4 flex flex-col gap-2 flex-shrink-0 relative"
          style={{
            background: `linear-gradient(135deg, ${borderColorValue}10 0%, ${borderColorValue}05 100%)`,
          }}
        >
          {/* Subtle separator line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: getSeparatorGradient(borderColorValue),
            }}
          />
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                rows={1}
                className="w-full bg-gray-900 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 resize-none focus:outline-none transition-all leading-normal"
                style={{
                  borderColor: inputValue.trim() ? borderColorValue : `${borderColorValue}60`,
                  minHeight: '52px',
                  maxHeight: '160px',
                  boxShadow: inputValue.trim() ? `0 2px 8px ${borderColorValue}20` : 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = borderColorValue;
                  e.target.style.boxShadow = `0 0 0 3px ${borderColorValue}30, 0 2px 8px ${borderColorValue}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputValue.trim() ? borderColorValue : `${borderColorValue}60`;
                  e.target.style.boxShadow = inputValue.trim() ? `0 2px 8px ${borderColorValue}20` : 'none';
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
                }}
              />
              {/* Character count indicator (optional, shows when typing) */}
              {inputValue.length > 0 && (
                <div className="absolute bottom-2.5 right-3 text-xs text-gray-500 pointer-events-none">
                  {inputValue.length}
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 h-[52px] w-[52px] rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 border"
              style={{
                backgroundColor: inputValue.trim() ? borderColorValue : `${borderColorValue}40`,
                borderColor: inputValue.trim() ? borderColorValue : `${borderColorValue}60`,
                color: 'white',
                boxShadow: inputValue.trim() 
                  ? `0 4px 12px ${borderColorValue}50, 0 0 8px ${borderColorValue}30`
                  : 'none',
              }}
              aria-label="Send message"
            >
              <PixelIcon type="arrow-right" size={20} color="currentColor" />
            </button>
          </div>
          
          {/* Helper text */}
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="flex items-center gap-1.5">
              <PixelIcon type="pin" size={12} color="currentColor" />
              <span>Enter to send</span>
            </span>
            {inputValue.trim() && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <PixelIcon type="check" size={12} color="currentColor" />
                <span>Ready to send</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
