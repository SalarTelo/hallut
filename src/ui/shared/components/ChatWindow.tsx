/**
 * Chattfönsterkomponent
 * Modulspecifikt AI-kompanjon chattgränssnitt
 * Valfri komponent för moduler som behöver chattfunktionalitet
 */

import { useState } from 'react';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { Input } from './Input.js';
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
  borderColor,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
      size="lg"
      closeOnEscape
      closeOnOverlayClick
    >
      <div
        className="bg-black border-2 rounded-lg flex flex-col h-[600px]"
        style={{
          borderColor: borderColorValue,
          boxShadow: `0 0 10px ${borderColorValue}, 0 0 20px ${borderColorValue}`,
        }}
      >
        {/* Rubrik */}
        <div
          className="px-4 py-3 border-b-2 flex items-center justify-between"
          style={{ borderColor: borderColorValue }}
        >
          <h3 className="pixelated text-yellow-400 text-base font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-orange-400 hover:text-orange-300 pixelated text-sm"
            aria-label="Stäng chatt"
          >
            ✕
          </button>
        </div>

        {/* Meddelandeområde */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="pixelated text-gray-400 text-xs text-center">
              Inga meddelanden ännu. Starta en konversation!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded pixelated text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inmatningsområde */}
        <div
          className="px-4 py-3 border-t-2 flex items-center space-x-2"
          style={{ borderColor: borderColorValue }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ditt meddelande..."
            fullWidth
            className="pixelated"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            size="md"
            disabled={!inputValue.trim()}
          >
            +
          </Button>
        </div>
      </div>
    </Modal>
  );
}
