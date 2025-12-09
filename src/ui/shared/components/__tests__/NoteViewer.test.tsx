/**
 * NoteViewer Component Tests
 * Tests for NoteViewer component (wrapper around ContentViewer)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { NoteViewer } from '../NoteViewer.js';
import * as contentViewer from '../ContentViewer.js';

describe('NoteViewer', () => {
  beforeEach(() => {
    vi.spyOn(contentViewer, 'ContentViewer');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render ContentViewer with correct props', () => {
    const onClose = vi.fn();
    render(
      <NoteViewer
        isOpen={true}
        onClose={onClose}
        content="Test note content"
        title="Custom Title"
        borderColor="#FF0000"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      isOpen: true,
      contentType: 'text',
      textContent: 'Test note content',
      title: 'Custom Title',
      borderColor: '#FF0000',
    });
    expect(callArgs.onClose).toBe(onClose);
  });

  it('should use default title when not provided', () => {
    const onClose = vi.fn();
    render(
      <NoteViewer
        isOpen={true}
        onClose={onClose}
        content="Test content"
      />
    );

    expect(contentViewer.ContentViewer).toHaveBeenCalled();
    const callArgs = vi.mocked(contentViewer.ContentViewer).mock.calls[0][0];
    expect(callArgs).toMatchObject({
      title: 'Note',
      contentType: 'text',
      textContent: 'Test content',
      isOpen: true,
    });
    expect(callArgs.onClose).toBe(onClose);
  });

  it('should maintain backward compatibility with props interface', () => {
    // This test ensures the props interface hasn't changed
    const props: Parameters<typeof NoteViewer>[0] = {
      isOpen: true,
      onClose: () => {},
      content: 'test',
      title: 'test',
      borderColor: '#FFD700',
    };

    expect(props).toBeDefined();
  });
});

