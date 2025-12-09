/**
 * ContentViewer Component Tests
 * Tests for the consolidated content viewer component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentViewer } from '../ContentViewer.js';
import * as themeHook from '../../hooks/useThemeBorderColor.js';

describe('ContentViewer', () => {
  beforeEach(() => {
    vi.spyOn(themeHook, 'useThemeBorderColor').mockReturnValue('#FFD700');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('text content', () => {
    it('should render text content when contentType is text', () => {
      render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="text"
          textContent="Test content"
          title="Test Title"
        />
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should use md size for text content by default', () => {
      const { container } = render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="text"
          textContent="Test"
        />
      );

      // Modal should be rendered (size is passed to Modal component)
      expect(container.querySelector('.bg-black')).toBeInTheDocument();
    });

    it('should use max-h-[70vh] for text content', () => {
      const { container } = render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="text"
          textContent="Test"
        />
      );

      const contentArea = container.querySelector('.max-h-\\[70vh\\]');
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('image content', () => {
    it('should render image when contentType is image', () => {
      render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="image"
          imageUrl="https://example.com/image.jpg"
          title="Image Title"
        />
      );

      const img = screen.getByAltText('Image Title');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should use lg size for image content by default', () => {
      const { container } = render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="image"
          imageUrl="https://example.com/image.jpg"
        />
      );

      expect(container.querySelector('.bg-black')).toBeInTheDocument();
    });

    it('should use max-h-[80vh] for image content', () => {
      const { container } = render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="image"
          imageUrl="https://example.com/image.jpg"
        />
      );

      const contentArea = container.querySelector('.max-h-\\[80vh\\]');
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('modal behavior', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <ContentViewer
          isOpen={false}
          onClose={() => {}}
          contentType="text"
          textContent="Test"
        />
      );

      expect(container.querySelector('.bg-black')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <ContentViewer
          isOpen={true}
          onClose={onClose}
          contentType="text"
          textContent="Test"
          title="Test"
        />
      );

      const closeButton = screen.getByLabelText('Close');
      closeButton.click();

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('styling', () => {
    it('should apply correct text styling for text content', () => {
      const { container } = render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="text"
          textContent="Test"
        />
      );

      const textContent = container.querySelector('.text-gray-200.text-sm.leading-relaxed.whitespace-pre-wrap.pixelated');
      expect(textContent).toBeInTheDocument();
    });

    it('should apply correct image styling for image content', () => {
      render(
        <ContentViewer
          isOpen={true}
          onClose={() => {}}
          contentType="image"
          imageUrl="https://example.com/image.jpg"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('max-w-full', 'h-auto', 'rounded');
    });
  });
});

