/* ==========================================================
   AMINE FELLAH — LINK IN BIO
   Lightweight script: preloader / cursor / magnetic / reveal / counter
   No heavy loops, no canvas — smooth premium interactions only
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');

  const finishLoading = () => {
    preloader.classList.add('loaded');
    document.body.classList.remove('no-scroll');
    setTimeout(() => preloader.remove(), 900);
  };

  if (prefersReducedMotion) {
    finishLoading();
  } else {
    requestAnimationFrame(() => {
      fill.style.width = '100%';
    });
    setTimeout(finishLoading, 1300);
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
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .magnetic, .grid-card').forEach((el) => {
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

  /* ---------------- MAGNETIC BUTTONS (desktop only, subtle) ---------------- */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach((magnet) => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${relX * 0.18}px, ${relY * 0.18}px)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
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
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
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
