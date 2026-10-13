import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playCameraClickSound } from '../utils/audioSynth';

interface StickmanSceneProps {
  autoStart?: boolean;
  onRequestBurst?: () => void;
}

export type AnimPhase =
  | 'drawing'
  | 'walking'
  | 'delivering'
  | 'blooming'
  | 'photo'
  | 'celebrating'
  | 'finished';

export const StickmanScene: React.FC<StickmanSceneProps> = ({
  autoStart = true,
  onRequestBurst,
}) => {
  const [phase, setPhase] = useState<AnimPhase>('drawing');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [photoToast, setPhotoToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const isPhotoPosed = phase === 'photo' || phase === 'celebrating' || phase === 'finished';

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const snapPhotoEffect = (isAutoTrigger = false) => {
    setIsFlashing(true);
    playCameraClickSound();
    if (onRequestBurst) onRequestBurst();

    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#F7D6D0', '#E8A598', '#E05A47', '#D4AF37', '#FFFDF9', '#8A9A86'],
      });
    } catch {
      // Safe fallback
    }

    setPhotoCount((prev) => prev + 1);
    setPhotoToast(
      isAutoTrigger
        ? '¡Click! 📸 ¡Sonrían todos! Foto guardada en el recuerdo 💖'
        : '¡Click! 📸 ¡Hermosa pose de los 6! ✨'
    );

    const flashTimer = window.setTimeout(() => {
      setIsFlashing(false);
    }, 450);
    timeoutsRef.current.push(flashTimer);

    const toastTimer = window.setTimeout(() => {
      setPhotoToast(null);
    }, 4000);
    timeoutsRef.current.push(toastTimer);
  };

  const startAnimationSequence = () => {
    clearAllTimeouts();
    setHasStarted(true);
    setPhase('drawing');

    // 0 - 2.2s: Drawing sketch
    const t1 = window.setTimeout(() => {
      setPhase('walking');
    }, 2200);

    // 2.2s - 4.8s: Walking in
    const t2 = window.setTimeout(() => {
      setPhase('delivering');
    }, 4800);

    // 4.8s - 6.8s: Bouquet delivery
    const t3 = window.setTimeout(() => {
      setPhase('blooming');
      if (onRequestBurst) onRequestBurst();
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#F7D6D0', '#E8A598', '#E05A47', '#D4AF37', '#8A9A86'],
        });
      } catch {
        // Safe fallback
      }
    }, 6800);

    // 6.8s - 9.2s: Gathering closer for the photo! ("acercándose para la foto")
    const t4 = window.setTimeout(() => {
      setPhase('photo');
      snapPhotoEffect(true);
    }, 9200);

    // 9.2s - 11.5s: Celebrating together in photo pose
    const t5 = window.setTimeout(() => {
      setPhase('celebrating');
    }, 11500);

    // 11.5s+: Finished final pose with continuous micro-movement
    const t6 = window.setTimeout(() => {
      setPhase('finished');
    }, 13500);

    timeoutsRef.current.push(t1, t2, t3, t4, t5, t6);
  };

  // Intersection observer: starts automatically when the section scrolls into view
  useEffect(() => {
    if (!hasStarted) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasStarted) {
            startAnimationSequence();
          }
        },
        { threshold: 0.2 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [hasStarted]);

  // If autoStart triggered directly from props
  useEffect(() => {
    if (autoStart && !hasStarted) {
      startAnimationSequence();
    }
  }, [autoStart, hasStarted]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const handleReplay = () => {
    startAnimationSequence();
  };

  const handleTakePhotoClick = () => {
    if (!isPhotoPosed) {
      setPhase('photo');
    }
    snapPhotoEffect(false);
  };

  const handleJumpToPhoto = () => {
    clearAllTimeouts();
    setPhase('finished');
    snapPhotoEffect(false);
  };

  return (
    <section
      className="stickman-stage-section"
      id="stickman-scene-section"
      ref={containerRef}
      aria-label="Animación especial de los 5 compañeros y Sharon"
    >
      <div className="stickman-stage-header">
        <span className="stage-pill">Sorpresa final 🌷 • Foto de recuerdo 📸</span>
        <h2 className="stage-title">El momento de la entrega</h2>
        <p className="stage-subtitle">
          Una pequeña historia ilustrada de nosotros 5 para ti
        </p>

        {/* Quick action button to toggle photo pose if desired */}
        <div className="stage-header-actions">
          <button
            type="button"
            className={`btn-stage-quick ${isPhotoPosed ? 'active' : ''}`}
            onClick={handleJumpToPhoto}
            title="Ver directamente a todos reunidos para la foto"
          >
            📸 Pose para la foto grupal
          </button>
        </div>
      </div>

      <div className={`stickman-canvas-wrapper phase-${phase}`}>
        {/* Soft decorative frame */}
        <div className="stage-paper-card">
          {/* Camera Viewfinder Corners Overlay */}
          <div className={`camera-viewfinder-overlay ${isPhotoPosed ? 'active' : ''}`} aria-hidden="true">
            <span className="vf-corner vf-tl" />
            <span className="vf-corner vf-tr" />
            <span className="vf-corner vf-bl" />
            <span className="vf-corner vf-br" />
            <div className="vf-badge">
              <span className="vf-rec-dot" />
              <span>FOTO GRUPAL 📸</span>
            </div>
          </div>

          {/* Camera Flash Screen Layer */}
          <div className={`camera-flash-overlay ${isFlashing ? 'flashing' : ''}`} aria-hidden="true" />

          {/* Photo Toast Confirmation Notification */}
          {photoToast && (
            <div className="stage-photo-toast" role="status" aria-live="polite">
              <span>{photoToast}</span>
            </div>
          )}

          <svg
            className="stickman-svg"
            viewBox="0 0 840 450"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="kraftPaper" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EAD8C7" />
                <stop offset="100%" stopColor="#D4BC9F" />
              </linearGradient>
              <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAD3CB" />
                <stop offset="100%" stopColor="#E88B7B" />
              </linearGradient>
              <linearGradient id="tulipRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F56555" />
                <stop offset="100%" stopColor="#C93B2B" />
              </linearGradient>
              <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#8B5E55" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Hand-drawn Stage Floor Line */}
            <path
              d="M 40 370 Q 240 368 420 371 Q 620 369 800 370"
              stroke="#D8C8B8"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="draw-stroke line-ground"
            />
            {/* Small grass/floral sprouts on the floor */}
            <g opacity="0.6" stroke="#8A9A86" strokeWidth="1.5" fill="none">
              <path d="M 120 370 Q 123 358 128 355 M 120 370 Q 115 360 110 357" />
              <path d="M 370 371 Q 373 361 378 358 M 370 371 Q 366 363 362 360" />
              <path d="M 470 371 Q 473 360 477 358 M 470 371 Q 466 362 463 360" />
              <path d="M 720 370 Q 723 358 728 355 M 720 370 Q 716 360 712 358" />
            </g>

            {/* Cute Speech Bubble / Photo prompt above group */}
            <g className={`photo-cue-bubble ${isPhotoPosed ? 'visible' : ''}`}>
              <rect
                x="300"
                y="85"
                width="240"
                height="34"
                rx="17"
                fill="#FFF4F1"
                stroke="#E8A598"
                strokeWidth="1.2"
                className="bubble-bg"
              />
              <path d="M 414 119 L 420 128 L 426 119 Z" fill="#FFF4F1" stroke="#E8A598" strokeWidth="1.2" />
              <text x="420" y="107" textAnchor="middle" className="bubble-text">
                📸 ¡Sonrían todos! ¡Whiskey! ✨
              </text>
            </g>

            {/* ========================================================= */}
            {/* COMPAÑERO 1: MARTÍN (Extremo Izquierdo, Base X=150) */}
            {/* ========================================================= */}
            <g className={`coworker-group cw-1 phase-item ${phase}`}>
              <g transform="translate(150, 0)">
                <g className={`photo-cluster-wrap cw-wrap-1 ${isPhotoPosed ? 'gathered' : ''}`}>
                  <g className={`photo-micro-sway cw-sway-1 ${isPhotoPosed ? 'swaying' : ''}`}>
                    {/* Name Tag */}
                    <text x="0" y="165" textAnchor="middle" className="char-nametag">Martín</text>

                    {/* Head */}
                    <circle cx="0" cy="205" r="22" className="stick-head" />
                    {/* Smile & Eyes */}
                    <circle cx="-7" cy="201" r="2.2" className="stick-eye" />
                    <circle cx="7" cy="201" r="2.2" className="stick-eye" />
                    <path d="M -8 212 Q 0 219 8 212" className="stick-mouth" />

                    {/* Body */}
                    <line x1="0" y1="227" x2="0" y2="305" className="stick-body" />

                    {/* Left Arm */}
                    <path d="M 0 245 L -26 270" className="stick-arm stick-arm-left" />
                    {/* Right Arm (Waving & Posing) */}
                    <path d="M 0 245 L 26 230 L 32 205" className="stick-arm stick-arm-right waving-arm" />

                    {/* Legs */}
                    <path d="M 0 305 L -16 368" className="stick-leg stick-leg-left" />
                    <path d="M 0 305 L 16 368" className="stick-leg stick-leg-right" />
                  </g>
                </g>
              </g>
            </g>

            {/* ========================================================= */}
            {/* COMPAÑERO 2: JAVIER (Izquierda Medio, Base X=245) */}
            {/* ========================================================= */}
            <g className={`coworker-group cw-2 phase-item ${phase}`}>
              <g transform="translate(245, 0)">
                <g className={`photo-cluster-wrap cw-wrap-2 ${isPhotoPosed ? 'gathered' : ''}`}>
                  <g className={`photo-micro-sway cw-sway-2 ${isPhotoPosed ? 'swaying' : ''}`}>
                    <text x="0" y="165" textAnchor="middle" className="char-nametag">Javier</text>

                    {/* Head */}
                    <circle cx="0" cy="205" r="22" className="stick-head" />
                    {/* Cute Glasses */}
                    <circle cx="-7" cy="202" r="5" fill="none" stroke="#6D5A54" strokeWidth="1.2" />
                    <circle cx="7" cy="202" r="5" fill="none" stroke="#6D5A54" strokeWidth="1.2" />
                    <line x1="-2" y1="202" x2="2" y2="202" stroke="#6D5A54" strokeWidth="1.2" />
                    {/* Eyes & Smile */}
                    <circle cx="-7" cy="202" r="1.8" className="stick-eye" />
                    <circle cx="7" cy="202" r="1.8" className="stick-eye" />
                    <path d="M -7 215 Q 0 221 7 215" className="stick-mouth" />

                    {/* Body */}
                    <line x1="0" y1="227" x2="0" y2="305" className="stick-body" />

                    {/* Arms */}
                    <path d="M 0 245 L -24 265" className="stick-arm stick-arm-left" />
                    <path d="M 0 245 L 22 255" className="stick-arm stick-arm-right" />

                    {/* Legs */}
                    <path d="M 0 305 L -14 368" className="stick-leg stick-leg-left" />
                    <path d="M 0 305 L 14 368" className="stick-leg stick-leg-right" />
                  </g>
                </g>
              </g>
            </g>

            {/* ========================================================= */}
            {/* COMPAÑERO 3: ABEL (Izquierda Frente a Sharon, Base X=335) */}
            {/* ========================================================= */}
            <g className={`coworker-group cw-3 phase-item ${phase}`}>
              <g transform="translate(335, 0)">
                <g className={`photo-cluster-wrap cw-wrap-3 ${isPhotoPosed ? 'gathered' : ''}`}>
                  <g className={`photo-micro-sway cw-sway-3 ${isPhotoPosed ? 'swaying' : ''}`}>
                    <text x="0" y="165" textAnchor="middle" className="char-nametag">Abel</text>

                    {/* Head */}
                    <circle cx="0" cy="205" r="22" className="stick-head" />
                    {/* Smile & Eyes */}
                    <circle cx="-6" cy="201" r="2.2" className="stick-eye" />
                    <circle cx="8" cy="201" r="2.2" className="stick-eye" />
                    <path d="M -6 213 Q 2 220 10 213" className="stick-mouth" />

                    {/* Body */}
                    <line x1="0" y1="227" x2="0" y2="305" className="stick-body" />

                    {/* Left Arm */}
                    <path d="M 0 245 L -20 270" className="stick-arm stick-arm-left" />

                    {/* Right Arm: Extends bouquet during delivery; poses proudly beside Sharon during photo */}
                    {phase === 'delivering' ? (
                      <path d="M 0 245 L 34 265 L 55 250" className="stick-arm stick-arm-right delivery-arm" />
                    ) : isPhotoPosed ? (
                      <path d="M 0 245 L 22 230 L 26 205" className="stick-arm stick-arm-right abel-photo-arm" />
                    ) : (
                      <path d="M 0 245 L 20 270" className="stick-arm stick-arm-right" />
                    )}

                    {/* Legs */}
                    <path d="M 0 305 L -12 368" className="stick-leg stick-leg-left" />
                    <path d="M 0 305 L 18 368" className="stick-leg stick-leg-right" />
                  </g>
                </g>
              </g>
            </g>

            {/* ========================================================= */}
            {/* SHARON EN EL CENTRO (X=425) - PROTAGONISTA 🌸 */}
            {/* ========================================================= */}
            <g className={`sharon-group phase-item ${phase}`} transform="translate(425, 0)">
              <g className={`photo-cluster-wrap sharon-wrap ${isPhotoPosed ? 'gathered' : ''}`}>
                <g className={`photo-micro-sway sharon-sway ${isPhotoPosed ? 'swaying' : ''}`}>
                  {/* Highlight Aura */}
                  <circle cx="0" cy="255" r="70" fill="url(#roseGrad)" opacity="0.12" className="sharon-aura" />

                  {/* Sharon Badge / Name */}
                  <g className="sharon-tag-group">
                    <rect
                      x="-46"
                      y="132"
                      width="92"
                      height="24"
                      rx="12"
                      fill="#FCEEE9"
                      stroke="#E8A598"
                      strokeWidth="1.2"
                    />
                    <text x="0" y="148" textAnchor="middle" className="sharon-nametag">
                      ✨ Sharon 🌸
                    </text>
                  </g>

                  {/* Sharon's Hair Flower / Ribbon */}
                  <g className="sharon-flower-hair" transform="translate(16, 186)">
                    <circle cx="0" cy="0" r="6" fill="#F7D6D0" stroke="#C87D74" strokeWidth="1" />
                    <circle cx="0" cy="0" r="3" fill="#E05A47" />
                    <path d="M 4 -3 Q 9 -8 14 -4" stroke="#8A9A86" strokeWidth="1.2" fill="none" />
                  </g>

                  {/* Head */}
                  <circle cx="0" cy="205" r="23" className="stick-head sharon-head" />

                  {/* Sharon's Eyes & Blushing Cheeks */}
                  <circle cx="-8" cy="201" r="2.2" className="stick-eye" />
                  <circle cx="8" cy="201" r="2.2" className="stick-eye" />
                  {/* Rosy Cheeks */}
                  <circle cx="-14" cy="211" r="4.2" fill="#F7D6D0" opacity="0.9" />
                  <circle cx="14" cy="211" r="4.2" fill="#F7D6D0" opacity="0.9" />
                  {/* Sweet smile */}
                  <path d="M -9 213 Q 0 223 9 213" className="stick-mouth sharon-smile" />

                  {/* Cute A-line Dress */}
                  <path
                    d="M -6 230 L 6 230 L 22 305 L -22 305 Z"
                    fill="#FFF4F1"
                    stroke="#C87D74"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="sharon-dress"
                  />
                  <line x1="0" y1="230" x2="0" y2="280" className="stick-body" />

                  {/* Arms holding the bouquet */}
                  <g className="sharon-arms-holding">
                    <path d="M -6 242 L -25 262 L -6 276" className="stick-arm sharon-arm-left" />
                    <path d="M 6 242 L 25 262 L 6 276" className="stick-arm sharon-arm-right" />
                  </g>

                  {/* Sharon's Legs */}
                  <line x1="-8" y1="305" x2="-8" y2="368" className="stick-leg" />
                  <line x1="8" y1="305" x2="8" y2="368" className="stick-leg" />

                  {/* =================================================== */}
                  {/* EL RAMO DE FLORES DE SHARON 🌷💐 */}
                  {/* =================================================== */}
                  <g
                    className={`bouquet-group ${
                      phase === 'drawing' || phase === 'walking' ? 'bouquet-traveling' : 'bouquet-in-hands'
                    }`}
                    transform="translate(0, 268)"
                    filter="url(#shadowFilter)"
                  >
                    {/* Green flower stems */}
                    <g stroke="#688464" strokeWidth="2" strokeLinecap="round">
                      <line x1="-4" y1="-5" x2="-8" y2="25" />
                      <line x1="0" y1="-8" x2="0" y2="28" />
                      <line x1="4" y1="-5" x2="8" y2="25" />
                      {/* Leaves */}
                      <path d="M -12 6 Q -20 2 -16 12 Q -10 10 -12 6" fill="#8A9A86" stroke="none" />
                      <path d="M 12 8 Q 20 4 17 14 Q 11 12 12 8" fill="#8A9A86" stroke="none" />
                    </g>

                    {/* Kraft paper wrap */}
                    <polygon
                      points="-18,2 -5,35 5,35 18,2"
                      fill="url(#kraftPaper)"
                      stroke="#A88B73"
                      strokeWidth="1.2"
                    />
                    {/* Pink ribbon on the bouquet */}
                    <path d="M -7 20 Q 0 24 7 20" stroke="#C87D74" strokeWidth="2.5" fill="none" />
                    <path d="M -5 20 Q -10 26 -7 32" stroke="#C87D74" strokeWidth="1.8" fill="none" />
                    <path d="M 5 20 Q 10 26 7 32" stroke="#C87D74" strokeWidth="1.8" fill="none" />

                    {/* Flowers Blossom Cluster (Roses, Tulips, Daisies) */}
                    <g className="bouquet-blossoms">
                      {/* Center Pink Rose */}
                      <circle cx="0" cy="-6" r="9" fill="url(#roseGrad)" stroke="#C87D74" strokeWidth="1" />
                      <circle cx="0" cy="-6" r="4.5" fill="#FFF4F1" />

                      {/* Left Red Tulip */}
                      <path
                        d="M -14 -10 C -22 -6 -20 6 -12 5 C -6 6 -8 -6 -14 -10 Z"
                        fill="url(#tulipRed)"
                        stroke="#A83020"
                        strokeWidth="0.8"
                      />

                      {/* Right White & Yellow Daisy */}
                      <circle cx="13" cy="-4" r="8" fill="#FFFDF9" stroke="#E0C9B6" strokeWidth="0.8" />
                      <circle cx="13" cy="-4" r="3.2" fill="#D4AF37" />

                      {/* Top Pastel Bloom */}
                      <circle cx="-4" cy="-17" r="7" fill="#FCEEE9" stroke="#E8A598" strokeWidth="0.8" />
                      <circle cx="-4" cy="-17" r="3" fill="#C87D74" />

                      {/* Top Right Mini Tulip */}
                      <circle cx="8" cy="-16" r="6" fill="#F7D6D0" stroke="#E08F83" strokeWidth="0.8" />
                    </g>

                    {/* Floating Love Hearts and Petals during Blooming & Celebration */}
                    <g className="floating-bouquet-sparks" aria-hidden="true">
                      <path
                        d="M -22 -30 C -22 -36 -14 -36 -14 -30 C -14 -36 -6 -36 -6 -30 C -6 -22 -14 -16 -14 -16 C -14 -16 -22 -22 -22 -30 Z"
                        fill="#E05A47"
                        className="spark-heart h-1"
                      />
                      <path
                        d="M 10 -35 C 10 -40 16 -40 16 -35 C 16 -40 22 -40 22 -35 C 22 -29 16 -24 16 -24 C 16 -24 10 -29 10 -35 Z"
                        fill="#F78D7D"
                        className="spark-heart h-2"
                      />
                      <circle cx="0" cy="-38" r="3" fill="#D4AF37" className="spark-gold" />
                      <circle cx="-10" cy="-45" r="2" fill="#D4AF37" className="spark-gold" />
                      <circle cx="14" cy="-46" r="2.5" fill="#D4AF37" className="spark-gold" />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            {/* ========================================================= */}
            {/* COMPAÑERO 4: CARLOS (Derecha Frente a Sharon, Base X=515) */}
            {/* ========================================================= */}
            <g className={`coworker-group cw-4 phase-item ${phase}`}>
              <g transform="translate(515, 0)">
                <g className={`photo-cluster-wrap cw-wrap-4 ${isPhotoPosed ? 'gathered' : ''}`}>
                  <g className={`photo-micro-sway cw-sway-4 ${isPhotoPosed ? 'swaying' : ''}`}>
                    <text x="0" y="165" textAnchor="middle" className="char-nametag">Carlos</text>

                    {/* Head */}
                    <circle cx="0" cy="205" r="22" className="stick-head" />
                    {/* Smile & Eyes */}
                    <circle cx="-8" cy="201" r="2.2" className="stick-eye" />
                    <circle cx="6" cy="201" r="2.2" className="stick-eye" />
                    <path d="M -8 213 Q 0 220 8 213" className="stick-mouth" />

                    {/* Body */}
                    <line x1="0" y1="227" x2="0" y2="305" className="stick-body" />

                    {/* Arms (Clapping/Cheering) */}
                    <path d="M 0 245 L -26 230 L -22 205" className="stick-arm stick-arm-left cheering-arm" />
                    <path d="M 0 245 L 24 265" className="stick-arm stick-arm-right" />

                    {/* Legs */}
                    <path d="M 0 305 L -16 368" className="stick-leg stick-leg-left" />
                    <path d="M 0 305 L 14 368" className="stick-leg stick-leg-right" />
                  </g>
                </g>
              </g>
            </g>

            {/* ========================================================= */}
            {/* COMPAÑERO 5: GINO (Extremo Derecho, Base X=625) */}
            {/* ========================================================= */}
            <g className={`coworker-group cw-5 phase-item ${phase}`}>
              <g transform="translate(625, 0)">
                <g className={`photo-cluster-wrap cw-wrap-5 ${isPhotoPosed ? 'gathered' : ''}`}>
                  <g className={`photo-micro-sway cw-sway-5 ${isPhotoPosed ? 'swaying' : ''}`}>
                    <text x="0" y="165" textAnchor="middle" className="char-nametag">Gino</text>

                    {/* Head */}
                    <circle cx="0" cy="205" r="22" className="stick-head" />
                    {/* Smile & Eyes */}
                    <circle cx="-7" cy="201" r="2.2" className="stick-eye" />
                    <circle cx="7" cy="201" r="2.2" className="stick-eye" />
                    <path d="M -8 212 Q 0 220 8 212" className="stick-mouth" />

                    {/* Body */}
                    <line x1="0" y1="227" x2="0" y2="305" className="stick-body" />

                    {/* Arms (Both raising up during celebration) */}
                    <path d="M 0 245 L -22 245" className="stick-arm stick-arm-left" />
                    <path d="M 0 245 L 28 220 L 32 198" className="stick-arm stick-arm-right waving-arm-2" />

                    {/* Legs */}
                    <path d="M 0 305 L -14 368" className="stick-leg stick-leg-left" />
                    <path d="M 0 305 L 16 368" className="stick-leg stick-leg-right" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Celebratory Final Banner */}
        <div className={`stickman-final-banner ${phase === 'celebrating' || phase === 'finished' || phase === 'photo' ? 'visible' : ''}`}>
          <div className="banner-flower-icon">💐</div>
          <h3 className="banner-title">
            “¡SHARON, ESTE DETALLE ES PARA TI! 💐”
          </h3>
          <p className="banner-subtitle">
            Con cariño, tus compañeros de trabajo ❤️
          </p>
          <p className="banner-names">
            Martín • Javier • Abel • Carlos • Gino
          </p>

          <div className="banner-actions">
            <button
              type="button"
              className="btn-take-photo"
              onClick={handleTakePhotoClick}
              title="Tomar una foto del recuerdo con los compañeros"
            >
              <span className="btn-icon">📸</span>
              <span>¡Tomar foto grupal!</span>
            </button>

            <button
              type="button"
              className="btn-replay-anim"
              onClick={handleReplay}
              title="Volver a ver la animación de los compañeros"
            >
              <span className="btn-icon">↺</span>
              <span>Repetir historia</span>
            </button>
          </div>

          {photoCount > 0 && (
            <p className="photo-count-badge">
              ✨ Foto tomada con cariño {photoCount > 1 ? `(${photoCount} veces)` : ''} 💖
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
