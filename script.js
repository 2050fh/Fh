/* ==================================================
   AMINE FELLAH — LINK IN BIO
   Boot sequence, optimized matrix canvas, cursor,
   tilt cards, scroll reveal, typewriter, counters.
================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('lock');
  initPreloader();
  initMatrixCanvas();
  initCursor();
  initNavbarScroll();
  initSmoothAnchors();
  initScrollReveal();
  initTilt();
  initCounters();
  initMagnetic();
  initTypewriter();
});

/* -------------------- 1. PRELOADER -------------------- */
function initPreloader(){
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');

  let progress = 0;
  const target = 100;

  const tick = () => {
    const remaining = target - progress;
    const increment = Math.max(0.7, remaining * 0.07);
    progress = Math.min(target, progress + increment);

    fill.style.width = progress + '%';
    percentEl.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';

    if (progress < target) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(finish, 300);
    }
  };

  function finish(){
    preloader.classList.add('done');
    document.body.classList.remove('lock');
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
  }

  requestAnimationFrame(tick);
  setTimeout(finish, 4200); // safety fallback
}

/* -------------------- 2. MATRIX CANVAS (perf-optimized) -------------------- */
function initMatrixCanvas(){
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const CHARS = 'アイウエオカキクケコサシスセソ01AICYBER01アイ'.split('');
  const isMobile = window.innerWidth < 768;
  const fontSize = isMobile ? 15 : 16;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
  const targetFPS = isMobile ? 18 : 26; // capped frame rate = key perf win
  const frameInterval = 1000 / targetFPS;

  let width = 0, height = 0;
  let columns = [];
  let lastTime = 0;
  let rafId = null;
  let running = false;

  function resize(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columnCount = Math.floor(width / fontSize);
    columns = new Array(columnCount).fill(0).map(() => Math.random() * -100);

    // paint immediate base so there's no flash of blank canvas
    ctx.fillStyle = '#0a0704';
    ctx.fillRect(0, 0, width, height);
  }

  function draw(time){
    if (!running) return;
    rafId = requestAnimationFrame(draw);

    const delta = time - lastTime;
    if (delta < frameInterval) return;
    lastTime = time;

    ctx.fillStyle = 'rgba(10,7,4,0.16)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + 'px JetBrains Mono, monospace';

    for (let i = 0; i < columns.length; i++){
      const char = CHARS[(Math.random() * CHARS.length) | 0];
      const x = i * fontSize;
      const y = columns[i] * fontSize;

      const roll = Math.random();
      ctx.fillStyle = roll > 0.965 ? '#ffd888' : roll > 0.82 ? '#ff9d4d' : 'rgba(255,140,40,0.32)';
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975){
        columns[i] = 0;
      }
      columns[i] += 1;
    }
  }

  function start(){
    if (running || prefersReducedMotion) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(draw);
  }
  function stop(){
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { resize(); }, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  resize();
  start();
}

/* -------------------- 3. CUSTOM CURSOR -------------------- */
function initCursor(){
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  const hoverables = document.querySelectorAll('a, button, .interest-card, .gallery-item, .magnetic');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* -------------------- 4. NAVBAR SCROLL STATE -------------------- */
function initNavbarScroll(){
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------- 5. SMOOTH ANCHOR SCROLL -------------------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* -------------------- 6. SCROLL REVEAL -------------------- */
function initScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* -------------------- 7. 3D TILT (desktop only) -------------------- */
function initTilt(){
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const cards = document.querySelectorAll('[data-tilt] article');
  const MAX_TILT = 9;

  cards.forEach(card => {
    const parent = card.closest('[data-tilt]');

    parent.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -MAX_TILT;
      const rotateY = ((x / rect.width) - 0.5) * MAX_TILT;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    parent.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* -------------------- 8. ANIMATED COUNTER (VO2 MAX) -------------------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    if (Number.isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(2);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(2);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
}

/* -------------------- 9. MAGNETIC BUTTONS -------------------- */
function initMagnetic(){
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const elements = document.querySelectorAll('.magnetic');
  const STRENGTH = 0.3;

  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* -------------------- 10. TYPEWRITER IDENTITY CYCLE -------------------- */
function initTypewriter(){
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = ['AI & CYBERSECURITY', 'WEB DEVELOPMENT', 'POWERLIFTING', 'PHOTOGRAPHY', 'UNIVERSITY STUDENT'];

  if (prefersReducedMotion){
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1800;

  function loop(){
    const current = phrases[phraseIndex];

    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length){
        deleting = true;
        setTimeout(loop, HOLD_TIME);
        return;
      }
      setTimeout(loop, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0){
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(loop, 400);
        return;
      }
      setTimeout(loop, DELETE_SPEED);
    }
  }

  // Start with the initial phrase fully typed, then begin the cycle
  setTimeout(() => { deleting = true; loop(); }, 2400);
}
