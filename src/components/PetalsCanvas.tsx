import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

interface PetalsCanvasProps {
  burstTrigger?: number;
}

const PALETTE = [
  'rgba(247, 214, 208, 0.85)', // pastel pink
  'rgba(232, 165, 152, 0.8)',  // soft blush
  'rgba(200, 125, 116, 0.75)', // dusty rose
  'rgba(255, 243, 240, 0.9)',  // ivory rose
  'rgba(242, 185, 178, 0.85)', // peach blossom
];

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial petal count based on screen width
    const petalCount = window.innerWidth < 600 ? 25 : 45;
    const petals: Petal[] = [];

    const createPetal = (startY?: number): Petal => {
      const size = Math.random() * 12 + 10;
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size,
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        opacity: Math.random() * 0.35 + 0.6,
      };
    };

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal());
    }
    petalsRef.current = petals;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, Math.cos(p.flip)); // 3D flip effect

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      // Realistic soft petal shape using cubic bezier curves
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.6, p.size * 0.8, p.size * 0.4, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.4, -p.size * 0.7, -p.size * 0.6, 0, -p.size);
      ctx.closePath();
      ctx.fill();

      // Subtle delicate vein line down the petal center
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(0, p.size * 0.6);
      ctx.stroke();

      ctx.restore();
    };

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.6, 2.5);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        petalsRef.current.forEach((petal) => {
          petal.y += petal.speedY * delta;
          petal.x += (petal.speedX + Math.sin(petal.y * 0.01) * 0.4) * delta;
          petal.rotation += petal.rotationSpeed * delta;
          petal.flip += petal.flipSpeed * delta;

          // Wrap around top if reached bottom
          if (petal.y > height + 20) {
            petal.y = -20;
            petal.x = Math.random() * width;
          }
          if (petal.x > width + 20) petal.x = -20;
          if (petal.x < -20) petal.x = width + 20;

          drawPetal(petal);
        });
      } else {
        // Just render static gentle petals if reduced motion requested
        petalsRef.current.forEach(drawPetal);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle burst trigger for special celebratory moments
  useEffect(() => {
    if (burstTrigger > 0 && canvasRef.current) {
      const width = canvasRef.current.width;
      const extraCount = window.innerWidth < 600 ? 18 : 30;
      for (let i = 0; i < extraCount; i++) {
        petalsRef.current.push({
          x: width * 0.5 + (Math.random() - 0.5) * 150,
          y: window.innerHeight * 0.35 + (Math.random() - 0.5) * 100,
          size: Math.random() * 14 + 10,
          speedY: Math.random() * 1.5 + 1.0,
          speedX: (Math.random() - 0.5) * 3.0,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.06,
          flip: Math.random() * Math.PI,
          flipSpeed: Math.random() * 0.05 + 0.02,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          opacity: 0.95,
        });
      }
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="petals-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
