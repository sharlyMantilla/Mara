(() => {
  try {
    const header = document.querySelector('header');
    if (!header) return;
    const mobileMenu = document.getElementById('mobileMenu');

    let lastY = window.scrollY;
    let ticking = false;
    const deltaThreshold = 10; // px
    const topGuard = 32; // no ocultar muy arriba

    function menuOpen() {
      return mobileMenu && !mobileMenu.classList.contains('hidden');
    }

    function onScroll() {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;

        // No ocultar si el menú móvil está abierto
        if (menuOpen()) {
          header.classList.remove('sticky-hide');
          ticking = false;
          return;
        }

        // Siempre visible cerca del tope
        if (y < topGuard) {
          header.classList.remove('sticky-hide');
          ticking = false;
          return;
        }

        if (Math.abs(delta) < deltaThreshold) {
          ticking = false;
          return;
        }

        if (delta > 0) {
          // Bajando
          header.classList.add('sticky-hide');
        } else {
          // Subiendo
          header.classList.remove('sticky-hide');
        }

        ticking = false;
      });
      ticking = true;
    }

    // Activar transición tras la primera pintura para evitar salto inicial
    requestAnimationFrame(() => header.classList.add('sticky-ready'));

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mostrar si el usuario acerca el puntero al borde superior
    document.addEventListener('mousemove', (e) => {
      if (e.clientY < 16) header.classList.remove('sticky-hide');
    }, { passive: true });
    header.addEventListener('mouseenter', () => header.classList.remove('sticky-hide'));

    // Reaparecer ante cambios de estado comunes
    window.addEventListener('resize', () => header.classList.remove('sticky-hide'));
    window.addEventListener('popstate', () => header.classList.remove('sticky-hide'));
  } catch {}
})();

