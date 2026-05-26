/* =========================================================
   AEPAX ENGINEERING — Site scripts
   ========================================================= */

// Theme toggle — initial theme was set inline in <head> to prevent flash.
// This module handles user-initiated toggling and reacts to system changes
// when no explicit user preference has been stored.
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'aepax-theme';

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }
    }
  }

  // Sync the label on first load
  setTheme(root.getAttribute('data-theme') || 'light', false);

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
  }

  // Follow OS-level changes only when the user hasn't picked a theme
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      let stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) { /* noop */ }
      if (!stored) setTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }
})();

// Mobile nav toggle
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu on link tap (but not when tapping the theme toggle)
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Footer year
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// Scroll-reveal — subtle fade/rise as elements enter viewport
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reveals.length === 0) {
    reveals.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => io.observe(el));
})();

// Scroll progress bar + back-to-top visibility
(function initScrollUI() {
  const bar = document.getElementById('scrollProgress');
  const toTopBtn = document.getElementById('toTop');
  let ticking = false;

  function update() {
    const doc = document.documentElement;
    const scrolled = window.scrollY;
    const max = (doc.scrollHeight - window.innerHeight) || 1;
    const pct = Math.min(100, (scrolled / max) * 100);
    if (bar) bar.style.width = pct + '%';
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', scrolled > 400);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }
})();

// Active-section highlight in nav (scroll spy)
(function initScrollSpy() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  // Map: section id -> nav link element
  const map = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) map.set(section, link);
  });

  if (map.size === 0) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          // Clear active state on all, then mark current
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    {
      // The section title is "in view" when it's roughly in the top third
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    }
  );

  map.forEach((_, section) => spy.observe(section));
})();

// Count-up animation for the hero stat numbers
(function initCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.stat-val');
  if (targets.length === 0) return;

  targets.forEach((el) => {
    const raw = (el.textContent || '').trim();
    // Extract leading number; preserve suffix like "°" or "+"
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const finalNum = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const padTo = match[1].length; // preserve "05" not "5"
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(finalNum * eased);
      el.textContent = String(current).padStart(padTo, '0') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    // Reset to zero first so the animation reads cleanly
    el.textContent = '0'.padStart(padTo, '0') + suffix;
    requestAnimationFrame(tick);
  });
})();
