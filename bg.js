// Sfondo: rete di nodi collegati, leggera, che segue il mouse.
(() => {
  const c = document.getElementById('net');
  if (!c) return;
  const ctx = c.getContext('2d');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['94,234,212', '78,161,255', '167,139,250'];
  let w, h, dpr, nodes = [], mouse = { x: -999, y: -999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (w * h) / 12000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 1,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const max = 130;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!still) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < max) {
          ctx.strokeStyle = `rgba(${a.c},${0.3 * (1 - d / max)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < 170) {
        ctx.strokeStyle = `rgba(${a.c},${0.35 * (1 - md / 170)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${a.c},0.8)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!still && !document.hidden) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); if (still) draw(); });
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; if (still) draw(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !still) requestAnimationFrame(draw); });
  resize(); draw();
})();
