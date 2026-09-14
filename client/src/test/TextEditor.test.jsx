import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TextEditor } from '../components/TextEditor';

describe('TextEditor Component', () => {
  const defaultProps = {
    text: 'Hello world',
    setText: vi.fn(),
    characterCount: 11,
    wordCount: 2,
    maxCharacters: 5000,
    isApproachingLimit: false,
    isOverLimit: false,
    onClearText: vi.fn(),
    onApplySample: vi.fn(),
    error: null
  };

  it('renders the editor heading and textarea with current text', () => {
    render(<TextEditor {...defaultProps} />);
    expect(screen.getByText('What would you like to say?')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Hello world');
  });

  it('displays correct character and word counts', () => {
    render(<TextEditor {...defaultProps} />);
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls setText when user types', () => {
    render(<TextEditor {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(defaultProps.setText).toHaveBeenCalledWith('New text');
  });

  it('calls onClearText when Clear button is clicked', () => {
    render(<TextEditor {...defaultProps} />);
    const clearBtn = screen.getByTitle('Clear all text');
    fireEvent.click(clearBtn);
    expect(defaultProps.onClearText).toHaveBeenCalledTimes(1);
  });

  it('displays warning when approaching or exceeding character limit', () => {
    const { rerender } = render(<TextEditor {...defaultProps} isApproachingLimit={true} />);
    expect(screen.getByText('Approaching maximum character limit')).toBeInTheDocument();

    rerender(<TextEditor {...defaultProps} isOverLimit={true} />);
    expect(screen.getByText(/Exceeds maximum limit/i)).toBeInTheDocument();
  });
});
