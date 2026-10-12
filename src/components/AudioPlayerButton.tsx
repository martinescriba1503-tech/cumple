import React, { useState, useEffect } from 'react';
import { romanticAudio } from '../utils/audioSynth';

export const AudioPlayerButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(romanticAudio.isPlaying());

  useEffect(() => {
    const unsubscribe = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggle = async () => {
    await romanticAudio.toggle();
  };

  return (
    <button
      type="button"
      className={`audio-floating-button ${isPlaying ? 'playing' : ''}`}
      onClick={handleToggle}
      aria-label={isPlaying ? 'Pausar melodía de piano' : 'Reproducir melodía suave de piano'}
      title={isPlaying ? 'Pausar música' : 'Reproducir música suave 🎵'}
      id="audio-toggle-btn"
    >
      <div className="audio-icon-wrapper">
        {isPlaying ? (
          <div className="equalizer-bars" aria-hidden="true">
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
            <span className="bar bar-4"></span>
          </div>
        ) : (
          <svg
            className="music-note-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </div>
      <span className="audio-label">{isPlaying ? 'Pausar música' : 'Música'}</span>
    </button>
  );
};
