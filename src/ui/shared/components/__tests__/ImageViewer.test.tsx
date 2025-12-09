/**
 * ImageViewer Component Tests
 * Tests for ImageViewer component (wrapper around ContentViewer)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ImageViewer } from '../ImageViewer.js';
import * as contentViewer from '../ContentViewer.js';

describe('ImageViewer', () => {
  beforeEach(() => {
    vi.spyOn(contentViewer, 'ContentViewer');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render ContentViewer with correct props', () => {
    const onClose = vi.fn();
    render(
      <ImageViewer
        isOpen={true}
        onClose={onClose}
        imageUrl="https://example.com/image.jpg"
        title="Custom Title"
        borderColor="#FF0000"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      isOpen: true,
      contentType: 'image',
      imageUrl: 'https://example.com/image.jpg',
      title: 'Custom Title',
      borderColor: '#FF0000',
    });
    expect(callArgs.onClose).toBe(onClose);
  });

  it('should use default title when not provided', () => {
    const onClose = vi.fn();
    render(
      <ImageViewer
        isOpen={true}
        onClose={onClose}
        imageUrl="https://example.com/image.jpg"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      title: 'Bild',
      contentType: 'image',
      imageUrl: 'https://example.com/image.jpg',
      isOpen: true,
    });
    expect(callArgs.onClose).toBe(onClose);
  });
});

