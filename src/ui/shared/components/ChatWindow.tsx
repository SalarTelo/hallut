/**
 * Chattfönsterkomponent
 * Modulspecifikt AI-kompanjon chattgränssnitt
 * Förbättrad design med bättre läsbarhet och visuell hierarki
 */

import { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal.js';
import { PixelIcon } from './PixelIcon.js';
import { getThemeValue } from '@utils/theme.js';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatWindowProps {
  /**
   * Om chattfönstret är öppet
   */
  isOpen: boolean;

  /**
   * Callback för att stänga chatten
   */
  onClose: () => void;

  /**
   * Chattitel (standard: "AI-kompanjon")
   */
  title?: string;

  /**
   * Initiala meddelanden
   */
  messages?: ChatMessage[];

  /**
   * Callback när meddelande skickas
   */
  onSend?: (message: string) => void;

  /**
   * Om AI skriver (visa typing indicator)
   */
  isTyping?: boolean;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Chattfönsterkomponent
 */
export function ChatWindow({
  isOpen,
  onClose,
  title = 'AI-kompanjon',
  messages = [],
  onSend,
  isTyping = false,
  borderColor,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  // Sync with external messages
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Auto-scroll till botten när nya meddelanden kommer
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, isTyping]);

  const handleSend = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Add user message to local state immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmedValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setLocalMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Call onSend if provided, otherwise just show the message
    if (onSend) {
      onSend(trimmedValue);
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
        className="bg-black border-2 rounded-lg flex flex-col h-[700px] overflow-hidden w-full"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${borderColorValue}40`,
        }}
      >
        {/* Kompakt header */}
        <div
          className="px-5 py-3 flex items-center justify-between flex-shrink-0 relative"
          style={{
            background: `linear-gradient(135deg, ${borderColorValue}20 0%, ${borderColorValue}08 100%)`,
          }}
        >
          {/* Subtle separator line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${borderColorValue}50 50%, transparent 100%)`,
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-gray-800"
            aria-label="Stäng chatt"
          >
            <PixelIcon type="close" size={18} color="currentColor" />
          </button>
        </div>

        {/* Meddelandeområde */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${borderColorValue}40 transparent`,
        }}>
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${borderColorValue}15`,
                  border: `2px solid ${borderColorValue}30`,
                }}
              >
                <PixelIcon type="star" size={32} color={borderColorValue} className="opacity-70" />
              </div>
              <p className="text-base text-gray-300 mb-1 font-medium">
                Inga meddelanden ännu
              </p>
              <p className="text-sm text-gray-500">
                Starta en konversation för att få hjälp
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
                            border: `2px solid ${borderColorValue}50`,
                          }}
                        >
                          <PixelIcon type="star" size={18} color={borderColorValue} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-lg">
                          <span className="text-xs font-bold text-white">Du</span>
                        </div>
                      </div>
                    )}

                    {/* Meddelandebubbla */}
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <p
                        className={`text-[11px] mt-2 opacity-70 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
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

        {/* Inmatningsområde */}
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
              background: `linear-gradient(90deg, transparent 0%, ${borderColorValue}50 50%, transparent 100%)`,
            }}
          />
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skriv ditt meddelande... (Tryck Enter för att skicka, Shift+Enter för ny rad)"
                rows={1}
                className="w-full bg-gray-900 border-2 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 resize-none focus:outline-none transition-all leading-normal"
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
              className="flex-shrink-0 h-[52px] w-[52px] rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 border-2"
              style={{
                backgroundColor: inputValue.trim() ? borderColorValue : `${borderColorValue}40`,
                borderColor: inputValue.trim() ? borderColorValue : `${borderColorValue}60`,
                color: 'white',
                boxShadow: inputValue.trim() 
                  ? `0 4px 12px ${borderColorValue}50, 0 0 8px ${borderColorValue}30`
                  : 'none',
              }}
              aria-label="Skicka meddelande"
            >
              <PixelIcon type="arrow-right" size={20} color="currentColor" />
            </button>
          </div>
          
          {/* Helper text */}
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="flex items-center gap-1.5">
              <PixelIcon type="pin" size={12} color="currentColor" />
              <span>Enter för att skicka</span>
            </span>
            {inputValue.trim() && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <PixelIcon type="check" size={12} color="currentColor" />
                <span>Redo att skicka</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
