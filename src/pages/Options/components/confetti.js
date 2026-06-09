// Tiny canvas-confetti. Single burst from the bottom-center of the canvas.
// Particles fall under gravity with rotation.

const COLORS = ['#E23744', '#FC8019', '#FFD23F', '#06A77D', '#FFFBF3'];

export function fireConfetti(canvas, { particles = 220, originY = 0.35 } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Two burst origins so the spray covers the full viewport width.
  const origins = [
    { x: W * 0.3, y: H * originY },
    { x: W * 0.7, y: H * originY },
  ];

  const parts = Array.from({ length: particles }, (_, i) => {
    const origin = origins[i % origins.length];
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const speed = 8 + Math.random() * 12;
    return {
      x: origin.x + (Math.random() - 0.5) * 120,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 5 + Math.random() * 10,
      rotation: Math.random() * 360,
      omega: (Math.random() - 0.5) * 14,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      life: 0,
    };
  });

  let frame = 0;
  const maxFrames = 170;

  function tick() {
    ctx.clearRect(0, 0, W, H);
    parts.forEach((p) => {
      p.vy += 0.28;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.omega;
      p.life++;
      const alpha = Math.max(0, 1 - p.life / maxFrames);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    frame++;
    if (frame < maxFrames) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }
  tick();
}
