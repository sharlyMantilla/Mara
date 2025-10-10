(function(){
  function run(){
    try{
      const footer = document.getElementById('contacto');
      if (!footer) return;
      const bars = footer.querySelectorAll('.max-w-7xl.mx-auto.px-6.py-6');
      const bar = bars[bars.length - 1] || footer.querySelector('.max-w-7xl');
      if (!bar) return;
      // Fix garbled copyright character if present
      const p = bar.querySelector('p');
      if (p && /derechos\s+reservados/i.test(p.textContent||'')){
        p.textContent = '© 2025 Mara. Todos los derechos reservados.';
      }
      if (p) p.classList.add('foot-copy');
      // Inject CTA once
      let a = bar.querySelector('a[href*="sharly-brands.netlify.app"]');
      if (!a){ a = document.createElement('a'); bar.appendChild(a); }
      a.href = 'https://sharly-brands.netlify.app';
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'foot-cta inline-flex items-center gap-2 hover:text-white cta-rainbow';
      a.innerHTML = '<img src="logo sharly brands.svg" alt="Sharly Brands" class="h-5 md:h-6 w-auto" />'
        + '<span class="t">Página hecha por Sharly Brands</span>';
      bar.classList.add('gap-4');
    }catch{}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
