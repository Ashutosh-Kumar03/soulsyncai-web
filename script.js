/* ═══════════════════════════════════════════════════════════════
   SoulSyncAI — script.js
   Handles: Custom cursor · Cosmos canvas · Wave bars ·
            Scroll reveal · Counter animation · Waitlist form
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');

  if (!cur || !cur2) return;

  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let tx = mx;
  let ty = my;

  // Move dot cursor instantly
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  // Trail cursor with lerp delay
  function animateCursor() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    cur2.style.left = tx + 'px';
    cur2.style.top  = ty + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover expand on interactive elements
  const interactives = document.querySelectorAll('button, a, .fc, .tc, .pc, .pill, .nav-badge');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cur.style.width        = '16px';
      cur.style.height       = '16px';
      cur2.style.width       = '60px';
      cur2.style.height      = '60px';
      cur2.style.borderColor = 'rgba(196, 181, 253, 0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width        = '6px';
      cur.style.height       = '6px';
      cur2.style.width       = '40px';
      cur2.style.height      = '40px';
      cur2.style.borderColor = 'rgba(167, 139, 250, 0.5)';
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   2. COSMOS CANVAS — starfield, nebulae, shooting stars
───────────────────────────────────────────────────────────── */
(function initCosmos() {
  const canvas = document.getElementById('cosmos');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let stars         = [];
  let nebulae       = [];
  let shootingStars = [];
  let mouseX        = window.innerWidth  / 2;
  let mouseY        = window.innerHeight / 2;
  let t             = 0;

  // ── Resize ──
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initStars(); });

  // Track mouse for parallax glow
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ── Build star + nebula arrays ──
  function initStars() {
    // Stars
    stars = [];
    const STAR_COUNT = 220;
    const starColors  = ['#c4b5fd', '#67e8f9', '#ffffff'];

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random();
      stars.push({
        x:             Math.random() * W,
        y:             Math.random() * H,
        radius:        r < 0.6 ? 0.5 : r < 0.85 ? 1 : r < 0.95 ? 1.5 : 2.5,
        alpha:         Math.random() * 0.8 + 0.2,
        twinkleSpeed:  Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
        color:         starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Nebulae
    nebulae = [];
    const nebColors = [
      'rgba(139,92,246',
      'rgba(6,182,212',
      'rgba(244,114,182',
      'rgba(251,191,36',
    ];
    for (let i = 0; i < 6; i++) {
      nebulae.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    120 + Math.random() * 200,
        a:    0.015 + Math.random() * 0.02,
        col:  nebColors[Math.floor(Math.random() * nebColors.length)],
        dx:   (Math.random() - 0.5) * 0.15,
        dy:   (Math.random() - 0.5) * 0.1,
      });
    }
  }
  initStars();

  // ── Spawn shooting star ──
  function spawnShootingStar() {
    if (Math.random() < 0.003 && shootingStars.length < 3) {
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
      shootingStars.push({
        x:    Math.random() * W * 0.7,
        y:    Math.random() * H * 0.4,
        vx:   Math.cos(angle) * 12,
        vy:   Math.sin(angle) * 12,
        len:  80 + Math.random() * 120,
        life: 1,
      });
    }
  }

  // ── Draw loop ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep space background gradient
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.7);
    bg.addColorStop(0,   'rgba(14,8,36,.4)');
    bg.addColorStop(0.5, 'rgba(7,4,26,.3)');
    bg.addColorStop(1,   'rgba(4,2,15,.2)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Nebulae
    nebulae.forEach((n) => {
      n.x += n.dx;
      n.y += n.dy;
      if (n.x < -n.r) n.x = W + n.r;
      if (n.x > W + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = H + n.r;
      if (n.y > H + n.r) n.y = -n.r;

      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0,   `${n.col},${n.a})`);
      g.addColorStop(0.5, `${n.col},${n.a * 0.4})`);
      g.addColorStop(1,   `${n.col},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Stars with twinkle
    t += 0.016;
    stars.forEach((s) => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
      const a = s.alpha * 0.4 + s.alpha * 0.6 * twinkle;

      // Halo for large stars
      if (s.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,181,253,${a * 0.12})`;
        ctx.fill();
      }

      // Star core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      if (s.color === '#ffffff') {
        ctx.fillStyle = `rgba(255,255,255,${a})`;
      } else if (s.color === '#c4b5fd') {
        ctx.fillStyle = `rgba(196,181,253,${a})`;
      } else {
        ctx.fillStyle = `rgba(103,232,249,${a})`;
      }
      ctx.fill();
    });

    // Shooting stars
    spawnShootingStar();
    shootingStars = shootingStars.filter((s) => {
      s.life -= 0.018;
      s.x    += s.vx;
      s.y    += s.vy;
      if (s.life <= 0) return false;

      const segments = s.len / 12;
      const g = ctx.createLinearGradient(
        s.x, s.y,
        s.x - s.vx * segments, s.y - s.vy * segments
      );
      g.addColorStop(0,   `rgba(255,255,255,${s.life * 0.9})`);
      g.addColorStop(0.4, `rgba(196,181,253,${s.life * 0.5})`);
      g.addColorStop(1,   'rgba(139,92,246,0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * segments, s.y - s.vy * segments);
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      return true;
    });

    // Mouse parallax glow
    const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 220);
    mg.addColorStop(0, 'rgba(139,92,246,.04)');
    mg.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ─────────────────────────────────────────────────────────────
   3. WAVE BARS (session card)
───────────────────────────────────────────────────────────── */
(function initWaveBars() {
  const container = document.getElementById('wc');
  if (!container) return;

  const BAR_COUNT = 16;
  const gradients = [
    'linear-gradient(180deg,#c4b5fd,#8b5cf6)',
    'linear-gradient(180deg,#67e8f9,#06b6d4)',
    'linear-gradient(180deg,#f472b6,#8b5cf6)',
  ];

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'wv';
    const h = 6 + Math.random() * 22;
    bar.style.cssText = [
      `height:${h}px`,
      `background:${gradients[i % gradients.length]}`,
      `animation-delay:${(i * 0.08).toFixed(2)}s`,
      `animation-duration:${(1 + Math.random() * 0.6).toFixed(2)}s`,
    ].join(';');
    container.appendChild(bar);
  }
})();


/* ─────────────────────────────────────────────────────────────
   4. SCROLL REVEAL
───────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('on');
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.rv, .rv2, .rv3').forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   5. COUNTER ANIMATION (metrics strip)
───────────────────────────────────────────────────────────── */
(function initCounters() {
  const metricsEl = document.querySelector('.metrics');
  if (!metricsEl) return;

  let animated = false;

  function runCounters() {
    if (animated) return;
    animated = true;

    document.querySelectorAll('.metric-val').forEach((el) => {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix   || '';
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      const frames  = 70;
      let   frame   = 0;

      function step() {
        frame++;
        const progress = frame / frames;
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value  = target * eased;
        el.textContent = decimal
          ? value.toFixed(decimal) + suffix
          : Math.round(value) + suffix;

        if (frame < frames) requestAnimationFrame(step);
        else el.textContent = (decimal ? target.toFixed(decimal) : target) + suffix;
      }

      requestAnimationFrame(step);
    });
  }

  const metObs = new IntersectionObserver(
    (entries) => { if (entries[0].isIntersecting) runCounters(); },
    { threshold: 0.5 }
  );
  metObs.observe(metricsEl);
})();


/* ─────────────────────────────────────────────────────────────
   6. NAVBAR — scroll shadow
───────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.backdropFilter = 'blur(24px)';
    } else {
      navbar.style.backdropFilter = 'none';
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────
   7. WAITLIST FORM
───────────────────────────────────────────────────────────── */
(function initWaitlist() {
  const btn   = document.getElementById('waitlistBtn');
  const input = document.getElementById('emailInput');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      input.style.borderColor = 'rgba(244,114,182,.7)';
      input.style.animation   = 'shake .4s ease';
      setTimeout(() => {
        input.style.borderColor = 'rgba(139,92,246,.25)';
        input.style.animation   = '';
      }, 800);
      return;
    }

    // Success state
    btn.textContent       = '✦ You\'re on the list!';
    btn.style.background  = 'linear-gradient(135deg,rgba(52,211,153,.9),rgba(16,185,129,.7))';
    btn.style.letterSpacing = '0.05em';
    input.value           = '';
    input.placeholder     = 'See you on the other side 🌌';
    input.disabled        = true;
    btn.disabled          = true;

    // Reset after 5s
    setTimeout(() => {
      btn.textContent       = 'Join Waitlist';
      btn.style.background  = '';
      btn.style.letterSpacing = '';
      input.placeholder     = 'your@email.com';
      input.disabled        = false;
      btn.disabled          = false;
    }, 5000);
  });

  // Allow Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
})();


/* ─────────────────────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL
───────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   9. FEATURE CARD 3D TILT
───────────────────────────────────────────────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.fc').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;
      card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      card.style.transition   = 'transform 0.1s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s ease';
    });
  });
})();




/* ─────────────────────────────────────────────────────────────
   10. CTA / BUTTON ACTIONS
───────────────────────────────────────────────────────────── */
(function initButtonActions() {
  function scrollToTarget(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function notify(message) {
    const existing = document.querySelector('.site-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:28px',
      'transform:translateX(-50%)',
      'z-index:9999',
      'padding:0.9rem 1.2rem',
      'border:1px solid rgba(196,181,253,.32)',
      'background:rgba(4,2,15,.88)',
      'backdrop-filter:blur(18px)',
      'color:#fff',
      'font-family:Space Grotesk, sans-serif',
      'font-size:.72rem',
      'letter-spacing:.08em',
      'box-shadow:0 0 40px rgba(139,92,246,.25)'
    ].join(';');

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.dataset.scroll;
      scrollToTarget(target);

      if (el.dataset.contact === 'sales') {
        const input = document.getElementById('emailInput');
        if (input) input.placeholder = 'Enter your email for sales access';
      }
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  document.querySelectorAll('[data-action="signin"]').forEach((el) => {
    el.addEventListener('click', () => {
      scrollToTarget('#waitlist');
      notify('Sign In will open after private beta. Join the waitlist for early access.');
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  document.querySelectorAll('[data-action="privacy"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      notify('Privacy page is planned. SoulSyncAI will follow a privacy-first approach.');
    });
  });

  document.querySelectorAll('[data-action="terms"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      notify('Terms page is planned for the official launch.');
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   SHAKE KEYFRAME (injected for waitlist error)
───────────────────────────────────────────────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);