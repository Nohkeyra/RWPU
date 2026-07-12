import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedY: number;
  speedX: number;
  amplitude: number;
  frequency: number;
  phase: number;
  opacity: number;
  life: number;
  maxLife: number;
}

// Updated for bright tropical palette
const PARTICLE_COLORS = [
  'rgba(255, 202, 38, ',    // sunshine yellow
  'rgba(248, 96, 21, ',     // crisp carrot orange
  'rgba(154, 188, 4, ',     // kiwi green
  'rgba(212, 37, 24, ',     // tomato burst red
  'rgba(243, 232, 204, ',   // cream (subtle)
];

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxParticles = isMobile ? 30 : 50; // Reduced for light theme subtlety

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => {
      const colorIdx = Math.floor(Math.random() * PARTICLE_COLORS.length);
      const life = Math.random() * 200 + 100;
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 50,
        radius: Math.random() * 2 + 1,
        color: PARTICLE_COLORS[colorIdx],
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        amplitude: Math.random() * 40 + 20,
        frequency: Math.random() * 0.002 + 0.001,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.2,
        life: 0,
        maxLife: life,
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.y = Math.random() * window.innerHeight;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.speedX + Math.sin(p.life * p.frequency + p.phase) * 0.3;
        p.y += p.speedY;

        if (p.life > p.maxLife || p.y < -50) {
          Object.assign(p, createParticle());
        }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
    />
  );
}
