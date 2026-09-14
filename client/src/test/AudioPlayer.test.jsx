import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AudioPlayer } from '../components/AudioPlayer';

describe('AudioPlayer Component', () => {
  const mockSpeech = {
    text: 'Hello world',
    voice: 'Samantha',
    language: 'en-US',
    speakingRate: 1.0,
    pitch: 0.0,
    volume: 1.0
  };

  it('renders null when no speech data is provided', () => {
    const { container } = render(<AudioPlayer activeSpeech={null} onClear={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Speech Controls with voice metadata when active', () => {
    render(<AudioPlayer activeSpeech={mockSpeech} onClear={vi.fn()} />);
    expect(screen.getByText('Speech Controls')).toBeInTheDocument();
    expect(screen.getByText('Samantha')).toBeInTheDocument();
    expect(screen.getByText('en-US')).toBeInTheDocument();
    expect(screen.getByText('Spoken Progress')).toBeInTheDocument();
    expect(screen.getByText(/Device-Direct Playback/i)).toBeInTheDocument();
  });

  it('displays speaking status when speech is active', () => {
    render(
      <AudioPlayer
        activeSpeech={mockSpeech}
        speakingStatus="speaking"
        isSpeaking={true}
        onPause={vi.fn()}
        onStop={vi.fn()}
      />
    );
    expect(screen.getByText('Speaking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause speech/i })).toBeInTheDocument();
  });

  it('calls onPause when pause button is clicked during speech', () => {
    const onPauseMock = vi.fn();
    render(
      <AudioPlayer
        activeSpeech={mockSpeech}
        speakingStatus="speaking"
        isSpeaking={true}
        onPause={onPauseMock}
        onStop={vi.fn()}
      />
    );
    const pauseBtn = screen.getByRole('button', { name: /pause speech/i });
    fireEvent.click(pauseBtn);
    expect(onPauseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when Clear Speech button is clicked', () => {
    const onClearMock = vi.fn();
    render(<AudioPlayer activeSpeech={mockSpeech} onClear={onClearMock} />);
    const clearBtn = screen.getByRole('button', { name: /clear speech/i });
    fireEvent.click(clearBtn);
    expect(onClearMock).toHaveBeenCalledTimes(1);
  });
});
