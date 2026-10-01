(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const menu = document.querySelector('#main-navigation');
  const toggle = document.querySelector('.menu-toggle');
  const progress = document.querySelector('.reading-progress');
  const backTop = document.querySelector('.back-top');
  const animations = new Set();
  function animate(element, frames, options) {
    if (reduced.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.onfinish = () => animations.delete(animation);
    animation.oncancel = () => animations.delete(animation);
  }
  function translateControls() {
    const english = document.documentElement.lang === 'en';
    if (toggle) toggle.setAttribute('aria-label', toggle.getAttribute('aria-expanded') === 'true'
      ? (english ? 'Close navigation' : 'Tutup navigasi')
      : (english ? 'Open navigation' : 'Buka navigasi'));
    backTop.setAttribute('aria-label', english ? 'Back to top' : 'Kembali ke atas');
  }
  function setMenu(open, focusToggle = false) {
    if (!menu || !toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = mobile.matches && !open;
    translateControls();
    if (focusToggle) toggle.focus();
  }
  if (menu && toggle) {
    // Put links after their disclosure button in keyboard order on small screens.
    header.append(menu);
    toggle.hidden = false;
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (mobile.matches && !header.contains(event.target)) setMenu(false);
    });
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);
  }
  new MutationObserver(translateControls).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  translateControls();
  let scrollFrame = 0;
  const sectionLinks = menu ? Array.from(menu.querySelectorAll('a[href^="#"]')) : [];
  const sections = sectionLinks.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter(item => item.section);
  function renderScroll() {
    scrollFrame = 0;
    const position = window.scrollY;
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, Math.max(0, position / maximum)) : 0})`;
    header.classList.toggle('is-scrolled', position > 12);
    const showTop = position > window.innerHeight;
    backTop.classList.toggle('is-visible', showTop);
    backTop.tabIndex = showTop ? 0 : -1;
    let active = null;
    for (const item of sections) if (item.section.getBoundingClientRect().top <= 150) active = item;
    // Do not mark Education active after scrolling into the CV/contact sections.
    if (active && active.section.getBoundingClientRect().bottom < 150) active = null;
    for (const item of sections) {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }
  function queueScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll); }
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  renderScroll();
  const revealTargets = document.querySelectorAll('.reveal, .case-overview, .case-cover, .case-step, .case-evidence, .case-next');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      let index = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], {
          duration: 700, delay: Math.min(index++ * 75, 150), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'
        });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    revealTargets.forEach(element => observer.observe(element));
  }
  document.querySelectorAll('.hero-copy > :not(.hero-caption), .portrait-composition, .case-category, .case-hero h1, .case-intro').forEach((element, index) => {
    animate(element, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 780, delay: Math.min(index * 65, 360), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'
    });
  });
  document.querySelectorAll('.project-visual').forEach(card => {
    let frame = 0;
    let point;
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches) return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${point.x - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${point.y - bounds.top}px`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) animations.forEach(animation => animation.cancel());
  });
})();
