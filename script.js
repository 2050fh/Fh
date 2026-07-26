/* ==================================================
   AMINE FELLAH — PORTFOLIO
   Production script: preloader, cursor, tilt,
   scroll-reveal, counters, magnetic buttons.
================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('lock');
  initPreloader();
  initCursor();
  initNavbarScroll();
  initSmoothAnchors();
  initScrollReveal();
  initTilt();
  initCounters();
  initMagnetic();
});

/* -------------------- 1. PRELOADER -------------------- */
function initPreloader(){
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');

  let progress = 0;
  const target = 100;

  const tick = () => {
    // ease toward target with randomized increments for organic feel
    const remaining = target - progress;
    const increment = Math.max(0.6, remaining * 0.06);
    progress = Math.min(target, progress + increment);

    fill.style.width = progress + '%';
    percentEl.textContent = String(Math.floor(progress)).padStart(2, '0');

    if (progress < target) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(finishPreloader, 350);
    }
  };

  function finishPreloader(){
    preloader.classList.add('done');
    document.body.classList.remove('lock');
    // Retrigger reveal check once layout is visible
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
  }

  requestAnimationFrame(tick);

  // Safety fallback in case something hangs
  setTimeout(finishPreloader, 4500);
}

/* -------------------- 2. CUSTOM CURSOR -------------------- */
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

  const hoverables = document.querySelectorAll('a, button, .hobby-card, .magnetic');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* -------------------- 3. NAVBAR SCROLL STATE -------------------- */
function initNavbarScroll(){
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------- 4. SMOOTH ANCHOR SCROLL -------------------- */
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

/* -------------------- 5. SCROLL REVEAL -------------------- */
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

/* -------------------- 6. 3D TILT ON HOBBY CARDS -------------------- */
function initTilt(){
  const cards = document.querySelectorAll('[data-tilt]');
  const MAX_TILT = 10;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -MAX_TILT;
      const rotateY = ((x / rect.width) - 0.5) * MAX_TILT;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* -------------------- 7. ANIMATED COUNTER (VO2 MAX) -------------------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = (target * eased).toFixed(2);
      el.textContent = value;
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

/* -------------------- 8. MAGNETIC BUTTONS -------------------- */
function initMagnetic(){
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const elements = document.querySelectorAll('.magnetic');
  const STRENGTH = 0.35;

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
