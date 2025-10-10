// Favorites toggle utilities for cards and lists
(function(){
  const COUNT_KEY = 'mara_loves';       // local fallback counts
  const LIKED_KEY = 'mara_liked_flags'; // per-browser liked state
  const API = '/.netlify/functions/favorites';

  function $(root, sel){ return (root||document).querySelector(sel); }
  function $all(root, sel){ return Array.from((root||document).querySelectorAll(sel)); }

  function load(key){ try { return JSON.parse(localStorage.getItem(key)||'{}'); } catch { return {}; } }
  function save(key, map){ try { localStorage.setItem(key, JSON.stringify(map)); } catch {} }

  function isLiked(id){ const map = load(LIKED_KEY); return !!map[id]; }
  function setLiked(id, on){ const map = load(LIKED_KEY); if (on) map[id]=1; else delete map[id]; save(LIKED_KEY,map); }

  async function serverGet(id){
    try { const r = await fetch(`${API}?id=${encodeURIComponent(id)}`, { headers: { 'accept':'application/json' }}); if(!r.ok) throw 0; const j = await r.json(); return typeof j.count==='number'? j.count : null; } catch { return null; }
  }
  async function serverInc(id){
    try { const r = await fetch(`${API}?id=${encodeURIComponent(id)}`, { method:'POST', headers:{'accept':'application/json'}}); if(!r.ok) throw 0; const j = await r.json(); return typeof j.count==='number'? j.count : null; } catch { return null; }
  }
  async function serverDec(id){
    try { const r = await fetch(`${API}?id=${encodeURIComponent(id)}`, { method:'DELETE', headers:{'accept':'application/json'}}); if(!r.ok) throw 0; const j = await r.json(); return typeof j.count==='number'? j.count : null; } catch { return null; }
  }

  function setCount(root, n){ const span = $(root, '.js-fav-count'); if (span) span.textContent = String(Math.max(0, n|0)); }
  function setLikedUI(root, on){
    const btn = $(root, '[data-fav]'); if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('text-[var(--brand-primary)]', !!on);
    const outline = btn.querySelector('.love-outline');
    const fill = btn.querySelector('.love-fill');
    if (outline && fill) { outline.classList.toggle('hidden', !!on); fill.classList.toggle('hidden', !on); }
  }

  async function render(root){
    const btn = $(root, '[data-fav]'); if (!btn) return;
    const id = btn.getAttribute('data-fav'); if (!id) return;
    setLikedUI(root, isLiked(id));
    const s = await serverGet(id);
    if (s !== null) { setCount(root, s); return; }
    const map = load(COUNT_KEY); setCount(root, map[id]||0);
  }

  async function toggle(root){
    const btn = $(root, '[data-fav]'); if (!btn) return;
    const id = btn.getAttribute('data-fav'); if (!id) return;
    const liked = isLiked(id);
    const current = parseInt(($(root, '.js-fav-count')||{}).textContent||'0',10)||0;
    // Optimistic
    setCount(root, Math.max(0, current + (liked?-1:1)));
    setLiked(id, !liked); setLikedUI(root, !liked);
    try { btn.classList.add('scale-95'); setTimeout(()=>btn.classList.remove('scale-95'),120); } catch {}
    const s = await (liked ? serverDec(id) : serverInc(id));
    if (s !== null) { setCount(root, s); return; }
    const map = load(COUNT_KEY); map[id] = Math.max(0, (map[id]||0) + (liked?-1:1)); save(COUNT_KEY, map); setCount(root, map[id]);
  }

  function bind(root){
    $all(root||document, '[data-fav]').forEach(btn => {
      const card = btn.closest('[data-fav-card]') || btn.parentElement || root || document;
      if (btn.dataset.favReady) return;
      btn.dataset.favReady = '1';
      btn.addEventListener('click', ()=>toggle(card));
      btn.addEventListener('keydown', (e)=>{ if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(card); } });
      render(card);
    });
  }

  window.MaraFav = { bind };
})();

