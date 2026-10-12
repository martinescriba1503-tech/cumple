import React, { useState } from 'react';
import { FloatingFloralIcon } from './FloralDecorations';

interface EnvelopeIntroProps {
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Allow animation to play before transitioning to the full card
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className={`envelope-intro-section ${isOpening ? 'animating-open' : ''}`}>
      {/* Decorative floating flowers around the envelope */}
      <FloatingFloralIcon style={{ top: '8%', left: '8%' }} delay={0} />
      <FloatingFloralIcon style={{ top: '14%', right: '10%' }} delay={1.2} />
      <FloatingFloralIcon style={{ bottom: '15%', left: '12%' }} delay={0.6} />
      <FloatingFloralIcon style={{ bottom: '20%', right: '8%' }} delay={1.8} />

      <div className="envelope-intro-content">
        {/* Main Title */}
        <div className="title-badge">
          <span>Un detalle especial</span>
        </div>
        <h1 className="intro-title">
          SHARON, TENEMOS UNA PEQUEÑA SORPRESA PARA TI 🌷
        </h1>

        {/* Subtitle */}
        <p className="intro-subtitle">
          “Hay detalles que no necesitan una fecha especial, solo personas que los hagan especiales.”
        </p>

        {/* Envelope Illustration with 3D open effect */}
        <div
          className={`envelope-container ${isOpening ? 'open' : ''}`}
          onClick={handleOpenClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleOpenClick();
            }
          }}
          aria-label="Sobre sorpresa para Sharon. Pulsa para abrir."
        >
          {/* Subtle golden aura behind envelope */}
          <div className="envelope-glow" aria-hidden="true"></div>

          <div className="envelope">
            {/* Back of envelope */}
            <div className="envelope-back"></div>

            {/* Letter peek inside */}
            <div className="envelope-card-peek">
              <div className="card-peek-header">
                <span className="mini-tulip">🌸</span>
                <span className="mini-text">Para Sharon</span>
              </div>
              <div className="card-peek-lines">
                <div className="line"></div>
                <div className="line short"></div>
              </div>
            </div>

            {/* Front folds */}
            <div className="envelope-left"></div>
            <div className="envelope-right"></div>
            <div className="envelope-bottom"></div>

            {/* Top flap with 3D folding transition */}
            <div className="envelope-flap"></div>

            {/* Golden Wax Seal */}
            <div className="wax-seal">
              <div className="seal-inner">
                <span className="seal-monogram">S</span>
                <span className="seal-leaf">🌿</span>
              </div>
            </div>
          </div>

          <p className="envelope-tap-hint">
            {isOpening ? 'Abriendo tu carta con cariño...' : 'Toca el sobre para abrir'}
          </p>
        </div>

        {/* Action Button */}
        <div className="intro-button-wrapper">
          <button
            type="button"
            className="btn-open-surprise"
            onClick={handleOpenClick}
            disabled={isOpening}
            id="btn-open-surprise"
          >
            <span className="btn-sparkle" aria-hidden="true">✨</span>
            <span className="btn-text">
              {isOpening ? 'ABRIENDO TU CARTA...' : 'ABRIR MI SORPRESA 💌'}
            </span>
            <span className="btn-sparkle" aria-hidden="true">✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
