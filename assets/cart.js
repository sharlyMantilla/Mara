// Carrito básico para Mara (localStorage)
(function(){
  const KEY = 'mara_cart';
  const PHONE = '573155964247'; // WhatsApp Mara (Dariela)

  function load(){
    try { const v = JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(v)? v : []; }
    catch { return []; }
  }
  function save(list){
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
    renderCount();
  }
  function findIndex(id){ return load().findIndex(x => x.id === id); }
  function getById(id){
    const list = (window.PRODUCTS||[]);
    return list.find(p => p.id === id) || null;
  }
  function addById(id, qty=1){
    function attempt(tries){
      const p = getById(id);
      if (p) {
        const cart = load();
        const i = cart.findIndex(x => x.id === id);
        if (i >= 0) cart[i].qty += qty; else cart.push({ id: p.id, name: p.name, price: p.price, qty: qty });
        save(cart);
      } else if ((tries||0) < 12) {
        setTimeout(() => attempt((tries||0) + 1), 120);
      }
    }
    attempt(0);
  }
  function setQty(id, qty){
    const cart = load();
    const i = cart.findIndex(x => x.id === id);
    if (i < 0) return;
    cart[i].qty = Math.max(1, parseInt(qty||1,10));
    save(cart);
  }
  function inc(id, d){
    const cart = load();
    const i = cart.findIndex(x => x.id === id);
    if (i < 0) return;
    cart[i].qty = Math.max(1, (cart[i].qty||1) + d);
    save(cart);
  }
  function remove(id){ save(load().filter(x => x.id !== id)); }
  function clear(){ save([]); }
  function count(){ return load().reduce((a,x)=>a+(x.qty||1),0); }
  function total(){ return load().reduce((a,x)=>a+(x.price||0)*(x.qty||1),0); }
  function priceToCOP(n){ try { return (n||0).toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}); } catch { return `$${n}`; } }

  function renderCount(){
    const c = String(count());
    document.querySelectorAll('.js-cart-count').forEach(el => { el.textContent = c; el.classList.toggle('hidden', c==='0'); });
  }

  function cartToText(){
    const cart = load();
    if (!cart.length) return 'Carrito vacío';
    const lines = cart.map(p => `• ${p.name} x${p.qty} — ${priceToCOP(p.price)}`);
    return lines.join('\n');
  }
  function whatsappHref(extra){
    const msg = [
      'Hola, quiero este pedido:',
      cartToText(),
      '',
      `Total: ${priceToCOP(total())}`,
      extra || ''
    ].join('\n');
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  }

  // Exponer API
  window.MaraCart = {
    load, save, addById, setQty, inc, remove, clear, count, total, priceToCOP, renderCount, whatsappHref
  };

  // Actualizar contadores al abrir la página
  document.addEventListener('DOMContentLoaded', renderCount);
})();
