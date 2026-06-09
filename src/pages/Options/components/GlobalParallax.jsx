import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Distributed across the whole viewport so the parallax reads even when the
// dashboard is scrolled deep. Each has a depth multiplier - higher = swings
// more under mouse movement and conceptually "closer to the camera".
const FLOATERS = [
  { emoji: '🍔', size: 180, left: '92%', top: '88%', depth: 1.0, opacity: 0.10, blur: 0 },
  { emoji: '🍕', size: 64,  left: '8%',  top: '12%', depth: 1.7, opacity: 0.20, blur: 0 },
  { emoji: '🍟', size: 48,  left: '24%', top: '74%', depth: 0.5, opacity: 0.15, blur: 2 },
  { emoji: '🌮', size: 56,  left: '78%', top: '14%', depth: 1.2, opacity: 0.18, blur: 0 },
  { emoji: '🍣', size: 40,  left: '94%', top: '46%', depth: 0.4, opacity: 0.13, blur: 3 },
  { emoji: '🍩', size: 52,  left: '6%',  top: '58%', depth: 1.4, opacity: 0.20, blur: 0 },
  { emoji: '🥟', size: 38,  left: '46%', top: '92%', depth: 0.7, opacity: 0.15, blur: 1 },
  { emoji: '🍰', size: 44,  left: '62%', top: '6%',  depth: 1.0, opacity: 0.18, blur: 0 },
  { emoji: '🍦', size: 34,  left: '34%', top: '8%',  depth: 0.5, opacity: 0.16, blur: 2 },
  { emoji: '🥗', size: 50,  left: '14%', top: '40%', depth: 1.1, opacity: 0.16, blur: 0 },
  { emoji: '🍱', size: 46,  left: '88%', top: '70%', depth: 0.8, opacity: 0.18, blur: 1 },
  { emoji: '🍪', size: 30,  left: '70%', top: '54%', depth: 0.45, opacity: 0.14, blur: 2 },
  { emoji: '🥐', size: 42,  left: '52%', top: '48%', depth: 1.5, opacity: 0.12, blur: 0 },
  { emoji: '🍿', size: 40,  left: '4%',  top: '88%', depth: 0.6, opacity: 0.16, blur: 1 },
  { emoji: '🧁', size: 36,  left: '40%', top: '30%', depth: 1.3, opacity: 0.15, blur: 0 },
  { emoji: '🥨', size: 38,  left: '82%', top: '32%', depth: 0.55, opacity: 0.14, blur: 2 },
  { emoji: '🍇', size: 32,  left: '20%', top: '20%', depth: 0.7, opacity: 0.16, blur: 1 },
  { emoji: '🌯', size: 48,  left: '66%', top: '78%', depth: 1.4, opacity: 0.16, blur: 0 },
];

const Floater = ({ emoji, size, left, top, depth, opacity, blur, mx, my }) => {
  const tx = useTransform(mx, (v) => v * 45 * depth);
  const ty = useTransform(my, (v) => v * 35 * depth);
  const rot = useTransform(mx, (v) => v * 8 * depth);
  return (
    <motion.span
      aria-hidden
      className="absolute select-none will-change-transform"
      style={{
        left,
        top,
        fontSize: size,
        opacity,
        filter: blur ? `blur(${blur}px)` : 'none',
        translateX: tx,
        translateY: ty,
        rotate: rot,
      }}
    >
      {emoji}
    </motion.span>
  );
};

const GlobalParallax = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mx.set(e.clientX / w - 0.5);
      my.set(e.clientY / h - 0.5);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {FLOATERS.map((f, i) => (
        <Floater key={i} {...f} mx={smx} my={smy} />
      ))}
    </div>
  );
};

export default GlobalParallax;
