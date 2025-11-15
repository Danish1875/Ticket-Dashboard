'use client';

import { useState, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  id: number;
  size: number;
}

export default function RippleEffect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // compute size so ripple can cover container (use larger dimension)
    const size = Math.max(rect.width, rect.height) * 1.2;

    const newRipple: Ripple = {
      x,
      y,
      id: rippleIdRef.current++,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes (800ms)
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {children}

      {/* Inline styles for ripple animation so no external CSS change is required */}
      <style>{`
        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          70% {
            transform: scale(1);
            opacity: 0.18;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        .rippleAnim {
          animation: rippleEffect 800ms cubic-bezier(.22,.98,.6,.99) forwards;
          transform-origin: center;
        }
      `}</style>

      {/* Ripple animations */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rippleAnim"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.18) 50%, transparent 60%)',
            willChange: 'transform, opacity',
            // ensure span starts scaled down (keyframes will transition it)
            transform: 'scale(0)',
            opacity: 1,
          }}
        />
      ))}
    </div>
  );
}