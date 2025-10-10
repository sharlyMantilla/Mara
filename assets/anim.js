// Animaciones fuertes pero no intrusivas en layout
(function(){
  const d = document;
  // Inyectar CSS de animaciones si no está
  (function ensureCSS(){
    const href = '/assets/anim.css';
    if (![...d.querySelectorAll('link[rel="stylesheet"]')].some(l => l.getAttribute('href')===href)){
      const ln = d.createElement('link'); ln.rel='stylesheet'; ln.href=href; d.head.appendChild(ln);
    }
  })();

  const hero = d.getElementById('hero');
  if (!hero) return;

  // Insertar capa de efectos detrás del texto del hero
  (function addEffects(){
    if (hero.querySelector('.hero-effects')) return;
    const fx = d.createElement('div'); fx.className = 'hero-effects'; fx.setAttribute('aria-hidden','true');
    fx.innerHTML = '<div class="hero-glow"></div><div class="hero-lines"></div><div class="hero-sparkles"></div>';
    const bg = hero.querySelector('.hero-bg');
    if (bg && bg.parentNode === hero) { hero.insertBefore(fx, bg.nextSibling); }
    else { hero.appendChild(fx); }
  })();

  // Añadir clases de brillo a título y botón sin cambiar diseño
  (function decorateCTAs(){
    const title = hero.querySelector('h1'); if (title) title.classList.add('hero-title');
    const cta = hero.querySelector('a[href^="#tienda"]');
    if (cta) {
      // Una animación de introducción cuando aparece el hero por primera vez
      const io = new IntersectionObserver((entries)=>{
        if (entries.some(e=>e.isIntersecting)) { cta.classList.add('btn-intro'); io.disconnect(); }
      }, { threshold: .6 });
      io.observe(hero);
    }
  })();

  // Generar partículas (sparkles)
  (function sparkles(){
    const box = hero.querySelector('.hero-sparkles'); if (!box) return;
    const N = 36;
    const vh = Math.max(window.innerHeight, hero.clientHeight || 0);
    for (let i=0;i<N;i++){
      const s = d.createElement('span');
      const size = 4 + Math.random()*6; // 4..10px
      const left = Math.random()*100;   // %
      const delay = -Math.random()*9;   // arranque desfasado
      const dur = 7 + Math.random()*6;  // 7..13s
      const startY = vh * (0.2 + Math.random()*0.6); // dentro de viewport
      s.style.width = s.style.height = size+'px';
      s.style.left = left+'%';
      s.style.bottom = (-startY)+'px';
      s.style.animationDelay = delay+'s';
      s.style.animationDuration = dur+'s';
      box.appendChild(s);
    }
  })();

  // Parallax con el mouse (solo desktop)
  (function parallax(){
    const fx = hero.querySelector('.hero-effects');
    if (!fx) return;
    let rect = hero.getBoundingClientRect();
    function onMove(e){
      const x = (e.clientX - rect.left)/rect.width - .5;
      const y = (e.clientY - rect.top)/rect.height - .5;
      const rx = y * -6; // rotar hasta 6º
      const ry = x * 6;
      fx.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function onLeave(){ fx.style.transform = 'none'; }
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', ()=>{ rect = hero.getBoundingClientRect(); });
  })();

  // Ticker: duplicar contenido para cinta continua y asegurar una sola fila
  (function ticker(){
    const track = d.querySelector('.ticker .track');
    if (!track) return;
    const original = track.innerHTML;
    // Duplicar hasta cubrir al menos 2 anchos de viewport para bucle perfecto
    let guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard < 8){
      track.innerHTML += original;
      guard++;
    }
    // Pausa opcional al hover (UX)
    track.addEventListener('mouseenter', ()=>{ track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', ()=>{ track.style.animationPlayState = 'running'; });
  })();

  // Parallax suave del fondo con scroll
  (function scrollParallax(){
    const bg = hero.querySelector('.hero-bg'); if (!bg) return;
    let ticking = false;
    function update(){
      const y = window.scrollY || window.pageYOffset || 0;
      const t = Math.min(40, y*0.08); // hasta 40px
      bg.style.transform = `translateY(${t}px)`;
      ticking = false;
    }
    function onScroll(){ if (!ticking){ window.requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  })();

  // Revelado al hacer scroll en secciones (excepto hero)
  (function reveal(){
    const targets = new Set();
    // Secciones completas
    Array.from(d.querySelectorAll('section')).filter(s => s.id !== 'hero').forEach(s => { s.classList.add('reveal'); targets.add(s); });
    // Elementos individuales marcados para deslizamiento
    d.querySelectorAll('.slide-in-left, .slide-in-right, [data-reveal]')?.forEach(el => targets.add(el));
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    targets.forEach(t => io.observe(t));
  })();
})();
