import React from 'react';
import { AudioPlayerButton } from './AudioPlayerButton';

interface HeaderBarProps {
  onOpenQrModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenQrModal }) => {
  return (
    <header className="header-top-bar" aria-label="Barra de herramientas">
      <div className="header-brand">
        <span className="brand-tulip" aria-hidden="true">🌷</span>
        <span className="brand-name">Para Sharon</span>
      </div>

      <div className="header-actions">
        {/* Soft audio toggle */}
        <AudioPlayerButton />

        {/* Discreet button for coworkers to create/print QR */}
        <button
          type="button"
          className="btn-header-qr"
          onClick={onOpenQrModal}
          title="Generar e imprimir el código QR para colocar junto al ramo de flores"
          aria-label="Generar código QR para imprimir"
        >
          <span className="qr-icon" aria-hidden="true">🏷️</span>
          <span className="qr-text">Imprimir QR</span>
        </button>
      </div>
    </header>
  );
};
