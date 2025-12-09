/**
 * Image analysis view component
 * Allows user to upload an image and analyze it with Ollama vision
 */

import { useState, useRef } from 'react';
import { Modal } from '../overlays/Modal.js';
import { PixelIcon } from '../icons/PixelIcon.js';
import { Button } from '../primitives/Button.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import { getHeaderGradient } from '../../utils/modalStyles.js';
import { analyzeImage, DEFAULT_MODELS } from '@services/ollamaService.js';

export interface ImageAnalysisViewProps {
  /**
   * Whether the view is open
   */
  isOpen: boolean;

  /**
   * Callback to close the view
   */
  onClose: () => void;

  /**
   * Prompt for image analysis (default: "Describe what you see in this image")
   */
  analysisPrompt?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Image analysis view component
 */
export function ImageAnalysisView({
  isOpen,
  onClose,
  analysisPrompt = 'Describe what you see in this image. Be detailed.',
  borderColor,
}: ImageAnalysisViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const borderColorValue = useThemeBorderColor(borderColor);

  // Reset when view is closed
  const handleClose = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check that it's an image
    if (!file.type.startsWith('image/')) {
      setError('Select an image file (PNG, JPG, etc.)');
      return;
    }

    // Read image as data URL
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
      setError('Could not read image file');
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
      // Extract base64 from data URL
      let imageBase64: string;
      if (selectedImage.startsWith('data:')) {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        imageBase64 = selectedImage.split(',')[1];
      } else {
        // If already base64, use directly
        imageBase64 = selectedImage;
      }

      // Analyze image with vision model
      const analysis = await analyzeImage(analysisPrompt, imageBase64, DEFAULT_MODELS.vision);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Image analysis error:', error);
      setError('Could not analyze image. Make sure Ollama is running and the vision model (llava:7b) is installed.');
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
        className="bg-black border rounded-lg flex flex-col overflow-hidden"
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
            background: getHeaderGradient(borderColorValue),
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
            <h3 className="text-base font-bold text-yellow-300">Image Analysis</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-gray-800"
            aria-label="Close"
          >
            <PixelIcon type="close" size={18} color="currentColor" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Hidden file upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Image selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-300">Select image</h4>
            </div>

            {selectedImage ? (
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border" style={{ borderColor: `${borderColorValue}40` }}>
                <img
                  src={selectedImage}
                  alt="Selected image"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
                <button
                  onClick={handleSelectImage}
                  className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/70 hover:bg-black/90 text-white rounded border"
                  style={{ borderColor: borderColorValue }}
                >
                  Change image
                </button>
              </div>
            ) : (
              <div
                onClick={handleSelectImage}
                className="flex flex-col items-center justify-center py-12 bg-gray-900/50 rounded-lg border border-dashed cursor-pointer hover:bg-gray-900/70 transition-colors"
                style={{ borderColor: `${borderColorValue}30` }}
              >
                <PixelIcon type="box" size={48} color={borderColorValue} className="opacity-50 mb-3" />
                <p className="text-sm text-gray-400 mb-2">Click to select an image</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF or other image formats</p>
              </div>
            )}
          </div>

          {/* Analyze button */}
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
                Analyze image with AI
              </Button>
            </div>
          )}

          {/* Analysis result */}
          {isAnalyzing && (
            <div className="bg-gray-900/50 rounded-lg border p-4" style={{ borderColor: `${borderColorValue}30` }}>
              <div className="flex items-center gap-3 mb-2">
                <PixelIcon type="star" size={16} color={borderColorValue} className="animate-pulse" />
                <p className="text-sm text-gray-300 font-medium">Analyzing image...</p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="bg-gray-800 rounded-lg border p-4 space-y-2" style={{ borderColor: `${borderColorValue}50` }}>
              <div className="flex items-center gap-2 mb-2">
                <PixelIcon type="check" size={16} color={borderColorValue} />
                <h4 className="text-sm font-semibold text-yellow-300">AI Analysis</h4>
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

