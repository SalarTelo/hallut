/**
 * Image Submission Component
 * UI component for image-based task submissions
 */

import { useRef, useState } from 'react';
import type { ImageTaskSubmission, ImageSubmissionConfig } from '../../../../types/taskTypes.js';
import type { SubmissionComponentProps } from './registry';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface ImageSubmissionProps
  extends SubmissionComponentProps<ImageTaskSubmission> {
  config: ImageSubmissionConfig;
}

export function ImageSubmission({
  config,
  value,
  onChange,
  disabled = false,
  error,
}: ImageSubmissionProps) {
  const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    typeof value?.image === 'string' ? value.image : null
  );

  const maxSize = config.config?.maxSize || 5 * 1024 * 1024; // 5MB default
  const acceptedFormats =
    config.config?.acceptedFormats || ['image/png', 'image/jpeg', 'image/jpg'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      // Error will be handled by parent
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      // Error will be handled by parent
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange({
      type: 'image',
      image: file,
    });
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({
      type: 'image',
      image: '',
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1.5">
        Upload Image
      </label>

      {preview ? (
        <div className="space-y-2">
          <div className="relative border-2 rounded" style={{ borderColor }}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-64 object-contain rounded"
            />
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                type="button"
              >
                Remove
              </button>
            )}
          </div>
          {value?.image instanceof File && (
            <p className="text-xs text-gray-400">
              File: {value.image.name} ({(value.image.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded p-8 text-center cursor-pointer hover:bg-gray-900 transition-colors"
          style={{ borderColor }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">
            Accepted: {acceptedFormats.join(', ')}
            <br />
            Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </div>
      )}

      {error && (
        <div className="p-2 border-2 rounded" style={{ borderColor: '#ff4444' }}>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

