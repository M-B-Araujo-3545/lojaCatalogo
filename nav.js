// nav.js
// Toggle navigation (hamburger) for mobile
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(toggle => {
    const controls = toggle.getAttribute('aria-controls');
    if (!controls) return;
    const navList = document.getElementById(controls);
    if (!navList) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      navList.classList.toggle('open');
      // Optionally lock body scroll
      document.body.classList.toggle('nav-open', !expanded);
      // Update label
      toggle.setAttribute('aria-label', !expanded ? 'Fechar menu' : 'Abrir menu');
    });

    // Close nav when a link is clicked (mobile ux)
    navList.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'A' && window.matchMedia('(max-width: 768px)').matches) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
        document.body.classList.remove('nav-open');
      }
    });
  });
});
