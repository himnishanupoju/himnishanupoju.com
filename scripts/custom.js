(() => {
  // ---------- Canvas particle network ----------
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const PARTICLE_COUNT = 70;
  const LINK_DIST = 130;
  const mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 && dist > 0) {
          p.x -= (dx / dist) * 0.6;
          p.y -= (dy / dist) * 0.6;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(120,160,255,${1 - dist / LINK_DIST})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  initParticles();
  step();

  // ---------- Typewriter reveal ----------
  const cmdEl = document.getElementById('cmd');
  const output = document.getElementById('output');
  const dock = document.getElementById('dock');
  const command = 'whoami';
  let i = 0;

  function typeCmd() {
    if (i <= command.length) {
      cmdEl.textContent = command.slice(0, i);
      i++;
      setTimeout(typeCmd, 90 + Math.random() * 60);
    } else {
      setTimeout(() => {
        output.classList.add('show');
        dock.classList.add('show');
      }, 350);
    }
  }

  setTimeout(typeCmd, 600);

  // ---------- Dock magnification ----------
  // macOS dock effect: each icon's scale/lift falls off linearly with its
  // horizontal distance from the cursor, capped at maxDist.
  const dockItems = [...dock.querySelectorAll('.dock-item')];
  const maxDist = 110;
  const maxScale = 1.5;

  dock.addEventListener('mousemove', (e) => {
    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - center);
      const scale = Math.max(1, maxScale - (dist / maxDist) * (maxScale - 1));
      const lift = (scale - 1) * 18;
      item.style.transform = `translateY(${-lift}px) scale(${scale})`;
    });
  });

  dock.addEventListener('mouseleave', () => {
    dockItems.forEach((item) => {
      item.style.transform = '';
    });
  });
})();
