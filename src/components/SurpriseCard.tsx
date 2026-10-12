import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CornerBotanical, GoldDivider } from './FloralDecorations';

interface SurpriseCardProps {
  onShowStickmanScene: () => void;
  onRequestBurst: () => void;
}

export const SurpriseCard: React.FC<SurpriseCardProps> = ({
  onShowStickmanScene,
  onRequestBurst,
}) => {
  const [hasClickedThanks, setHasClickedThanks] = useState(false);

  const handleThanksClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHasClickedThanks(true);
    onRequestBurst();

    // Trigger sweet floral & pastel confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: ['#F7D6D0', '#E8A598', '#C87D74', '#8A9A86', '#D4AF37', '#FFFDF9'],
      shapes: ['circle'],
      scalar: 1.1,
      ticks: 180,
    });

    // Smoothly scroll or advance to the Stickman Scene
    setTimeout(() => {
      onShowStickmanScene();
      const stickmanEl = document.getElementById('stickman-scene-section');
      if (stickmanEl) {
        stickmanEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 800);
  };

  return (
    <article className="card-container" id="surprise-letter-card">
      <div className="card-outer-shimmer">
        <div className="card-inner-paper">
          {/* Four Corner Botanicals */}
          <CornerBotanical position="top-left" />
          <CornerBotanical position="top-right" />
          <CornerBotanical position="bottom-left" />
          <CornerBotanical position="bottom-right" />

          {/* Golden Header Crest */}
          <header className="card-header">
            <div className="card-crest" aria-hidden="true">
              <span className="crest-flower">🌸</span>
            </div>
            <h2 className="card-title">
              Para Sharon, con mucho cariño 🌸
            </h2>
            <GoldDivider />
          </header>

          {/* Letter Content with comfortable typography and staggered entrance */}
          <div className="card-message-body">
            <p className="card-paragraph p-1">
              Hoy queremos regalarte algo más que flores: un pequeño detalle para recordarte lo bonito que es coincidir con personas que hacen más agradables nuestros días.
            </p>

            <p className="card-paragraph p-2">
              Esperamos que este ramo ilumine tu día, te saque una sonrisa y te recuerde que los pequeños detalles también pueden guardar grandes muestras de cariño.
            </p>

            <p className="card-paragraph p-3">
              Gracias por compartir con nosotros momentos, conversaciones y días de trabajo. Te deseamos muchas alegrías, éxitos y motivos para sonreír.
            </p>
          </div>

          {/* Signature and Closing */}
          <footer className="card-footer">
            <GoldDivider className="footer-divider" />

            <div className="signature-block">
              <p className="signature-preface">Con mucho cariño,</p>
              <p className="signature-team">
                <strong>Tus compañeros de trabajo 💐</strong>
              </p>
            </div>

            {/* Delicate end-of-letter floral ornament */}
            <div className="end-flower-badge" aria-hidden="true">
              <span className="glowing-heart">💖</span>
              <span className="sparkle-gold">✨</span>
            </div>

            {/* Special Final Button */}
            <div className="card-action-wrapper">
              <button
                type="button"
                className={`btn-thanks ${hasClickedThanks ? 'clicked' : ''}`}
                onClick={handleThanksClick}
                id="btn-thanks-smile"
                aria-label="Gracias por tu sonrisa. Ver la sorpresa de tus compañeros."
              >
                <span className="thanks-icon">🌷</span>
                <span className="thanks-text">GRACIAS POR TU SONRISA 🌷</span>
                <span className="thanks-shine" aria-hidden="true"></span>
              </button>

              <p className="scroll-cue">
                <span>👇 Tenemos una sorpresa animada de los 5 para ti 👇</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
};
