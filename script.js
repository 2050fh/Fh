/* ==========================================================
   AMINE FELLAH — LINK IN BIO SCRIPT
   Lightweight: preloader / cursor / magnetic / tilt / reveal / counter
   No canvas, no heavy loops — optimized for mobile browsers
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');

  const finishLoading = () => {
    preloader.classList.add('loaded');
    document.body.classList.remove('no-scroll');
    setTimeout(() => preloader.remove(), 700);
  };

  if (prefersReducedMotion) {
    finishLoading();
  } else {
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 22 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        fill.style.width = '100%';
        percentEl.textContent = '100%';
        setTimeout(finishLoading, 250);
      } else {
        fill.style.width = progress + '%';
        percentEl.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
      }
    }, 100);

    // Safety fallback — never block the page for more than ~2s
    setTimeout(() => {
      if (!preloader.classList.contains('loaded')) {
        clearInterval(loadInterval);
        finishLoading();
      }
    }, 2200);
  }

  /* ---------------- CUSTOM CURSOR (desktop only) ---------------- */
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
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
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

  /* ---------------- MAGNETIC BUTTONS (desktop only) ---------------- */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach((magnet) => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${relX * 0.3}px, ${relY * 0.3}px)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ---------------- 3D TILT CARDS (desktop only) ---------------- */
  if (!isTouch) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
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
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- ANIMATED COUNTER (Running metric) ---------------- */
  const counterEl = document.querySelector('.metric-number');
  if (counterEl) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const duration = 1500;
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
      { threshold: 0.5 }
    );
    counterObserver.observe(counterEl);
  }

});
