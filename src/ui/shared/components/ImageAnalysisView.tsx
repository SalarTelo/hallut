/**
 * Bildanalysvy-komponent
 * Låter användaren ladda upp en bild och analysera den med Ollama vision
 */

import { useState, useRef } from 'react';
import { Modal } from './Modal.js';
import { PixelIcon } from './PixelIcon.js';
import { Button } from './Button.js';
import { getThemeValue } from '@utils/theme.js';
import { analyzeImage, DEFAULT_MODELS } from '@services/ollamaService.js';

export interface ImageAnalysisViewProps {
  /**
   * Om vyn är öppen
   */
  isOpen: boolean;

  /**
   * Callback för att stänga vyn
   */
  onClose: () => void;

  /**
   * Prompt för bildanalys (standard: "Beskriv vad du ser i denna bild på svenska")
   */
  analysisPrompt?: string;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Bildanalysvy-komponent
 */
export function ImageAnalysisView({
  isOpen,
  onClose,
  analysisPrompt = 'Beskriv vad du ser i denna bild på svenska. Var detaljerad.',
  borderColor,
}: ImageAnalysisViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  // Återställ när vyn stängs
  const handleClose = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kontrollera att det är en bild
    if (!file.type.startsWith('image/')) {
      setError('Välj en bildfil (PNG, JPG, etc.)');
      return;
    }

    // Läs bilden som data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setSelectedImage(result);
        setError(null);
        setAnalysisResult(null);
      }
    };
    reader.onerror = () => {
      setError('Kunde inte läsa bildfilen');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Extrahera base64 från data URL
      let imageBase64: string;
      if (selectedImage.startsWith('data:')) {
        // Ta bort data URL-prefixet (t.ex. "data:image/png;base64,")
        imageBase64 = selectedImage.split(',')[1];
      } else {
        // Om det redan är base64, använd direkt
        imageBase64 = selectedImage;
      }

      // Analysera bilden med vision-modell
      const analysis = await analyzeImage(analysisPrompt, imageBase64, DEFAULT_MODELS.vision);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Bildanalysfel:', error);
      setError('Kunde inte analysera bild. Kontrollera att Ollama är igång och att vision-modellen (llava:7b) är installerad.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnEscape
      closeOnOverlayClick
      showCloseButton={false}
      className="max-w-4xl"
    >
      <div
        className="bg-black border-2 rounded-lg flex flex-col overflow-hidden"
        style={{
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${borderColorValue}40`,
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 flex items-center justify-between flex-shrink-0 relative"
          style={{
            background: `linear-gradient(135deg, ${borderColorValue}20 0%, ${borderColorValue}08 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${borderColorValue}25`,
                border: `1px solid ${borderColorValue}50`,
              }}
            >
              <PixelIcon type="box" size={18} color={borderColorValue} />
            </div>
            <h3 className="text-base font-bold text-yellow-300">Bildanalys</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-gray-800"
            aria-label="Stäng"
          >
            <PixelIcon type="close" size={18} color="currentColor" />
          </button>
        </div>

        {/* Innehåll */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Dold filuppladdning */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Bildval */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-300">Välj bild</h4>
            </div>

            {selectedImage ? (
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border-2" style={{ borderColor: `${borderColorValue}40` }}>
                <img
                  src={selectedImage}
                  alt="Vald bild"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
                <button
                  onClick={handleSelectImage}
                  className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/70 hover:bg-black/90 text-white rounded border"
                  style={{ borderColor: borderColorValue }}
                >
                  Byt bild
                </button>
              </div>
            ) : (
              <div
                onClick={handleSelectImage}
                className="flex flex-col items-center justify-center py-12 bg-gray-900/50 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-900/70 transition-colors"
                style={{ borderColor: `${borderColorValue}30` }}
              >
                <PixelIcon type="box" size={48} color={borderColorValue} className="opacity-50 mb-3" />
                <p className="text-sm text-gray-400 mb-2">Klicka för att välja en bild</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF eller andra bildformat</p>
              </div>
            )}
          </div>

          {/* Analysknapp */}
          {selectedImage && !isAnalyzing && !analysisResult && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyzeImage}
                pixelated
                className="px-6"
              >
                <PixelIcon type="star" size={16} color="currentColor" className="mr-2" />
                Analysera bild med AI
              </Button>
            </div>
          )}

          {/* Analysresultat */}
          {isAnalyzing && (
            <div className="bg-gray-900/50 rounded-lg border-2 p-4" style={{ borderColor: `${borderColorValue}30` }}>
              <div className="flex items-center gap-3 mb-2">
                <PixelIcon type="star" size={16} color={borderColorValue} className="animate-pulse" />
                <p className="text-sm text-gray-300 font-medium">Analyserar bild...</p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="bg-gray-800 rounded-lg border-2 p-4 space-y-2" style={{ borderColor: `${borderColorValue}50` }}>
              <div className="flex items-center gap-2 mb-2">
                <PixelIcon type="check" size={16} color={borderColorValue} />
                <h4 className="text-sm font-semibold text-yellow-300">AI-analys</h4>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {analysisResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

