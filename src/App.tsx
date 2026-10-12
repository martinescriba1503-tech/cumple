import React, { useState, useEffect } from 'react';
import { PetalsCanvas } from './components/PetalsCanvas';
import { HeaderBar } from './components/HeaderBar';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { SurpriseCard } from './components/SurpriseCard';
import { StickmanScene } from './components/StickmanScene';
import { QrModal } from './components/QrModal';
import './App.css';

export const App: React.FC = () => {
  const [cardOpened, setCardOpened] = useState<boolean>(false);
  const [showStickman, setShowStickman] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(0);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Check URL query params for ?qr=1 to auto-open the generator if coworkers need it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('qr') === '1' || searchParams.get('imprimir') === '1') {
        setIsQrModalOpen(true);
      }
    }
  }, []);

  const handleOpenEnvelope = () => {
    setBurstCount((prev) => prev + 1);
    setCardOpened(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShowStickmanScene = () => {
    setShowStickman(true);
  };

  const handleRequestBurst = () => {
    setBurstCount((prev) => prev + 1);
  };

  return (
    <div className="surprise-app-wrapper">
      {/* Background Falling Petals Canvas */}
      <PetalsCanvas burstTrigger={burstCount} />

      {/* Top Header Navigation (Audio toggle & QR Helper) */}
      <HeaderBar onOpenQrModal={() => setIsQrModalOpen(true)} />

      {/* Main Experience Container */}
      <main className="main-experience-container">
        {!cardOpened ? (
          /* Step 1: Envelope Intro Screen */
          <EnvelopeIntro onOpen={handleOpenEnvelope} />
        ) : (
          /* Step 2: Surprise Card & Letter with Stickman Scene */
          <div className="opened-experience-flow">
            <SurpriseCard
              onShowStickmanScene={handleShowStickmanScene}
              onRequestBurst={handleRequestBurst}
            />

            {/* Step 3: Stickman Scene (10. Escena Final) */}
            <StickmanScene
              autoStart={showStickman}
              onRequestBurst={handleRequestBurst}
            />
          </div>
        )}
      </main>

      {/* Discreet Footer */}
      <footer className="experience-footer">
        <p className="footer-quote">
          Un detalle pensado especialmente para alegrar tu día 🌸
        </p>
        <button
          type="button"
          className="btn-footer-qr"
          onClick={() => setIsQrModalOpen(true)}
        >
          Generar o Imprimir QR para el Ramo 🖨️
        </button>
      </footer>

      {/* QR Code & Printable Gift Tag Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};

export default App;
