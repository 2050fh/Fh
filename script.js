/* ==========================================================
   AMINE FELLAH — PORTFOLIO SCRIPT
   Preloader / Cursor / Magnetic / Tilt / Reveal / Counter / Canvas
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');
  const heroContent = document.getElementById('heroContent');
  const siteHeader = document.getElementById('siteHeader');

  const finishLoading = () => {
    preloader.classList.add('loaded');
    document.body.classList.remove('no-scroll');
    if (heroContent) heroContent.classList.add('is-visible');
    if (siteHeader) siteHeader.style.opacity = '1';
    setTimeout(() => preloader.remove(), 900);
  };

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      fill.style.width = '100%';
      percentEl.textContent = '100%';
      setTimeout(finishLoading, 350);
    } else {
      fill.style.width = progress + '%';
      percentEl.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
    }
  }, 140);

  // Safety fallback
  setTimeout(() => {
    if (!preloader.classList.contains('loaded')) {
      clearInterval(loadInterval);
      finishLoading();
    }
  }, 4500);

  /* ---------------- CUSTOM CURSOR ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    (function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .tilt-card, [data-magnetic]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });
  }

  /* ---------------- MAGNETIC ELEMENTS ---------------- */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach((magnet) => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${relX * 0.35}px, ${relY * 0.35}px)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ---------------- 3D TILT CARDS ---------------- */
  if (!isTouch) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  let globalIndex = 0;

  revealEls.forEach((el) => {
    if (el.classList.contains('hobby-card')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.style.transitionDelay = `${idx * 90}ms`;
    } else {
      el.style.transitionDelay = `${(globalIndex % 4) * 80}ms`;
    }
    globalIndex++;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- ANIMATED COUNTER (Running VO2 Max) ---------------- */
  const counterEl = document.querySelector('.metric-number');
  if (counterEl) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const duration = 1800;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = (target * eased).toFixed(2);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(2);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counterObserver.observe(counterEl);
  }

  /* ---------------- CANVAS NEURAL BACKGROUND ---------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.6 + 0.6;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.8;
            this.y += (dy / dist) * force * 1.8;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(90, 163, 255, 0.85)';
        ctx.shadowColor = 'rgba(47, 111, 237, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(130, Math.max(45, Math.floor((width * height) / 15000)));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 125) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(47, 111, 237, ${(1 - dist / 125) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resizeCanvas();
    animate();
  }

});
