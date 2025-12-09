/**
 * Floating Chat Widget Component
 * Always-on-top customer support style chat widget
 * Can be minimized/maximized and positioned in corner
 */

import { useState, useEffect, useRef } from 'react';
import { PixelIcon } from '../icons/PixelIcon.js';
import { useThemeBorderColor } from '@ui/shared/hooks';
import { getHeaderGradient } from '@ui/shared/utils';
import { streamChatMessage, type OllamaMessage } from '@services/ollamaService.js';
import type { ChatMessage } from './ChatWindow.js';

export interface FloatingChatWidgetProps {
  /**
   * Chat title (default: "Support")
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

  /**
   * Position on screen (default: 'bottom-right')
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Whether widget starts minimized (default: true)
   */
  startMinimized?: boolean;
}

/**
 * Floating chat widget component
 */
export function FloatingChatWidget({
  title = 'Support',
  messages = [],
  onSend,
  isTyping = false,
  borderColor,
  enableOllama = true,
  ollamaModel = 'llama3.2',
  position = 'bottom-right',
  startMinimized = true,
}: FloatingChatWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(startMinimized);
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
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, isTyping, isMinimized]);

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
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Position styles based on position prop
  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
  };

  // Minimized button (always visible)
  if (isMinimized) {
    return (
      <div
        className="fixed z-[9999] cursor-pointer transition-all hover:scale-110 active:scale-95"
        style={positionStyles[position]}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-xl transition-all hover:shadow-2xl"
          style={{
            borderColor: borderColorValue,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 2px ${borderColorValue}40`,
          }}
          aria-label="Open chat"
        >
          <PixelIcon type="chat" size={24} color={borderColorValue} />
          {/* Notification badge if there are unread messages */}
          {localMessages.length > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: borderColorValue,
                color: '#000',
              }}
            >
              {localMessages.length > 9 ? '9+' : localMessages.length}
            </div>
          )}
        </button>
      </div>
    );
  }

  // Expanded chat widget
  return (
    <div
      className="fixed z-[9999] flex flex-col shadow-2xl rounded-lg border-2 overflow-hidden animate-scale-in"
      style={{
        ...positionStyles[position],
        width: '380px',
        height: '600px',
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
        borderColor: borderColorValue,
        backgroundColor: 'rgba(0, 0, 0, 0.98)',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${borderColorValue}40`,
      }}
    >
      {/* Minimize bar - clickable top area */}
      <div
        className="h-2 cursor-pointer select-none relative group"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${borderColorValue}40 20%, ${borderColorValue}60 50%, ${borderColorValue}40 80%, transparent 100%)`,
        }}
        onClick={() => setIsMinimized(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(90deg, transparent 0%, ${borderColorValue}60 20%, ${borderColorValue}80 50%, ${borderColorValue}60 80%, transparent 100%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `linear-gradient(90deg, transparent 0%, ${borderColorValue}40 20%, ${borderColorValue}60 50%, ${borderColorValue}40 80%, transparent 100%)`;
        }}
        title="Click to minimize"
      >
        {/* Visual indicator dots */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: borderColorValue }}></div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: borderColorValue }}></div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: borderColorValue }}></div>
        </div>
      </div>

      {/* Header content - not clickable */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 relative"
        style={{
          background: getHeaderGradient(borderColorValue),
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${borderColorValue}25`,
              border: `1px solid ${borderColorValue}50`,
            }}
          >
            <PixelIcon type="chat" size={16} color={borderColorValue} />
          </div>
          <h3 className="text-sm font-bold text-yellow-300">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {localMessages.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all hover:scale-105 active:scale-95 border"
              style={{
                borderColor: borderColorValue,
                backgroundColor: `${borderColorValue}15`,
                color: borderColorValue,
              }}
              aria-label="Reset conversation"
              title="Reset conversation"
            >
              <PixelIcon type="reload" size={12} color={borderColorValue} />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
            aria-label="Minimize chat"
            title="Minimize chat"
          >
            <PixelIcon type="close" size={16} color="currentColor" />
          </button>
        </div>
      </div>

      {/* Message area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${borderColorValue}40 transparent`,
        }}
      >
        {ollamaError && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-3 py-2 text-xs text-red-300 mb-2">
            {ollamaError}
          </div>
        )}
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${borderColorValue}15`,
                border: `1px solid ${borderColorValue}30`,
              }}
            >
              <PixelIcon type="chat" size={24} color={borderColorValue} className="opacity-70" />
            </div>
            <p className="text-sm text-gray-300 mb-1 font-medium">No messages yet</p>
            <p className="text-xs text-gray-500">Start a conversation to get help</p>
          </div>
        ) : (
          <>
            {localMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''} max-w-[80%]`}>
                  {/* Avatar */}
                  {message.sender === 'ai' ? (
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${borderColorValue}25`,
                          border: `1px solid ${borderColorValue}50`,
                        }}
                      >
                        <PixelIcon type="chat" size={14} color={borderColorValue} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-lg">
                        <span className="text-xs font-bold text-white">You</span>
                      </div>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`rounded-xl px-3 py-2 text-xs ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                    }`}
                    style={{
                      ...(message.sender === 'user' && {
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                      }),
                    }}
                  >
                    {message.sender === 'ai' && !message.text ? (
                      // Typing indicator
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <>
                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        {message.text && (
                          <p className={`text-[10px] mt-1.5 opacity-70 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
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
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${borderColorValue}25`,
                        border: `1px solid ${borderColorValue}50`,
                      }}
                    >
                      <PixelIcon type="chat" size={14} color={borderColorValue} />
                    </div>
                  </div>
                  <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
        className="px-4 py-3 flex flex-col gap-2 flex-shrink-0 relative border-t"
        style={{
          borderColor: `${borderColorValue}30`,
          background: `linear-gradient(135deg, ${borderColorValue}10 0%, ${borderColorValue}05 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full bg-gray-900 border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 resize-none focus:outline-none transition-all leading-normal"
              style={{
                borderColor: inputValue.trim() ? borderColorValue : `${borderColorValue}60`,
                minHeight: '40px',
                maxHeight: '120px',
                boxShadow: inputValue.trim() ? `0 2px 8px ${borderColorValue}20` : 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = borderColorValue;
                e.target.style.boxShadow = `0 0 0 2px ${borderColorValue}30, 0 2px 8px ${borderColorValue}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = inputValue.trim() ? borderColorValue : `${borderColorValue}60`;
                e.target.style.boxShadow = inputValue.trim() ? `0 2px 8px ${borderColorValue}20` : 'none';
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 h-[40px] w-[40px] rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 border"
            style={{
              backgroundColor: inputValue.trim() ? borderColorValue : `${borderColorValue}40`,
              borderColor: inputValue.trim() ? borderColorValue : `${borderColorValue}60`,
              color: 'white',
              boxShadow: inputValue.trim()
                ? `0 4px 12px ${borderColorValue}50`
                : 'none',
            }}
            aria-label="Send message"
          >
            <PixelIcon type="arrow-right" size={16} color="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}

