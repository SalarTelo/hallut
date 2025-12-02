/**
 * SignViewer Component Tests
 * Tests for SignViewer component (wrapper around ContentViewer)
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SignViewer } from '../SignViewer.js';
import * as contentViewer from '../ContentViewer.js';

describe('SignViewer', () => {
  beforeEach(() => {
    vi.spyOn(contentViewer, 'ContentViewer');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render ContentViewer with correct props', () => {
    const onClose = vi.fn();
    render(
      <SignViewer
        isOpen={true}
        onClose={onClose}
        content="Test sign content"
        title="Custom Title"
        borderColor="#FF0000"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      isOpen: true,
      contentType: 'text',
      textContent: 'Test sign content',
      title: 'Custom Title',
      borderColor: '#FF0000',
    });
    expect(callArgs.onClose).toBe(onClose);
  });

  it('should use default title when not provided', () => {
    const onClose = vi.fn();
    render(
      <SignViewer
        isOpen={true}
        onClose={onClose}
        content="Test content"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      title: 'Sign',
      contentType: 'text',
      textContent: 'Test content',
      isOpen: true,
    });
    expect(callArgs.onClose).toBe(onClose);
  });
});

