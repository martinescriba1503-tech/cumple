import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState<string>('');
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false);
  const printableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin + window.location.pathname;
      const host = window.location.hostname;
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
      setIsLocalhost(isLocal);

      // If local, provide a friendly starter or placeholder for Vercel
      if (isLocal) {
        setUrl('https://tarjeta-sharon.vercel.app');
      } else {
        setUrl(currentUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (!url.trim()) return;

    // Generate High-Res PNG (1024x1024 with white background and quiet zone)
    QRCode.toDataURL(
      url.trim(),
      {
        width: 1024,
        margin: 4,
        color: {
          dark: '#261C19',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (err, dataUrl) => {
        if (!err && dataUrl) {
          setQrPngUrl(dataUrl);
        }
      }
    );

    // Generate Vector SVG
    QRCode.toString(
      url.trim(),
      {
        type: 'svg',
        margin: 4,
        color: {
          dark: '#261C19',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (err, svgString) => {
        if (!err && svgString) {
          setQrSvgString(svgString);
        }
      }
    );
  }, [url]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement('a');
    a.href = qrPngUrl;
    a.download = 'QR-Sorpresa-Sharon.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'QR-Sorpresa-Sharon.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🏷️</span>
            <div>
              <h3 className="modal-title">Código QR para el Ramo de Sharon</h3>
              <p className="modal-desc">Genera e imprime la tarjeta física para acompañar las flores</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Localhost Warning / URL Guidance */}
        {isLocalhost && (
          <div className="alert-guidance" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">
              <strong>Importante para antes de imprimir:</strong>
              <p>
                Actualmente estás probando el proyecto en tu equipo local. Para que el celular de Sharon pueda abrir la tarjeta,
                escribe abajo la <strong>URL pública de Vercel</strong> donde publicarás la página (ej: <code>https://tu-proyecto.vercel.app</code>).
              </p>
            </div>
          </div>
        )}

        {/* URL Input Form */}
        <div className="url-input-section">
          <label htmlFor="target-url-input" className="url-label">
            URL a la que dirigirá el QR:
          </label>
          <div className="url-input-row">
            <input
              id="target-url-input"
              type="url"
              className="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tarjeta-sharon.vercel.app"
              required
            />
            <button
              type="button"
              className="btn-use-current"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  setUrl(window.location.origin + window.location.pathname);
                }
              }}
              title="Usar la URL actual del navegador"
            >
              Usar actual
            </button>
          </div>
          <small className="url-hint">
            El QR llevará a Sharon directamente a la experiencia sorpresa sin mostrar pantallas de administración.
          </small>
        </div>

        {/* QR Code Preview & Physical Gift Tag Template */}
        <div className="qr-preview-container">
          <div className="printable-card" ref={printableRef} id="printable-gift-tag">
            <div className="printable-border">
              <div className="printable-floral-corner top-left">🌸</div>
              <div className="printable-floral-corner top-right">🌸</div>
              <div className="printable-floral-corner bottom-left">🌿</div>
              <div className="printable-floral-corner bottom-right">🌿</div>

              <div className="printable-content">
                <span className="printable-to">Para:</span>
                <h4 className="printable-name">Sharon 🌷</h4>
                <p className="printable-sub">Tenemos un pequeño detalle para ti...</p>

                {/* The QR Image */}
                <div className="printable-qr-wrapper">
                  {qrPngUrl ? (
                    <img
                      src={qrPngUrl}
                      alt="Código QR para abrir la tarjeta de Sharon"
                      className="printable-qr-image"
                      width="180"
                      height="180"
                    />
                  ) : (
                    <div className="qr-loading">Generando QR...</div>
                  )}
                </div>

                <p className="printable-instruction">
                  📷 <strong>Escanea con la cámara de tu celular</strong>
                </p>
                <p className="printable-from">
                  Con mucho cariño,<br />
                  <strong>Martín, Javier, Abel, Carlos y Gino 💐</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn-modal-action primary"
            onClick={handlePrintCard}
          >
            <span>🖨️ Imprimir Tarjeta para el Ramo</span>
          </button>

          <button
            type="button"
            className="btn-modal-action secondary"
            onClick={handleDownloadPng}
            disabled={!qrPngUrl}
          >
            <span>📥 Descargar PNG (Alta Resolución)</span>
          </button>

          <button
            type="button"
            className="btn-modal-action secondary"
            onClick={handleDownloadSvg}
            disabled={!qrSvgString}
          >
            <span>📐 Descargar SVG Vectorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
