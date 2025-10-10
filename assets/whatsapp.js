(() => {
  try {
    const number = '573155964247';
    const text = 'Hola Mara, quiero consultar sobre un producto o pedido.';
    const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'wa-btn';
    a.setAttribute('aria-label', 'Chatear por WhatsApp');
    // Usar el mismo ícono que en el botón de producto (consistencia visual)
    a.innerHTML = (
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">'
      + '<path d="M16.62 13.75c-.27-.13-1.61-.79-1.86-.88-.25-.09-.43-.13-.61.13s-.7.88-.85 1.06c-.15.18-.31.2-.58.07a7.39 7.39 0 0 1-2.18-1.35 8.18 8.18 0 0 1-1.51-1.87c-.16-.27-.02-.42.12-.55.12-.12.27-.31.41-.46.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.46-.07-.13-.61-1.47-.84-2-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.46.07-.7.33s-.92.9-.92 2.2.94 2.55 1.07 2.73c.13.18 1.85 2.88 4.49 4.04.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.08 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31z"/>'
      + '<path d="M20.52 3.49A11.76 11.76 0 0 0 12.2 0C5.54 0 .2 5.34.2 11.93c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.65c1.73.95 3.7 1.45 5.73 1.45h.01c6.65 0 12.04-5.38 12.04-12 0-3.2-1.25-6.2-3.56-8.31zM12 21.54a9.6 9.6 0 0 1-4.89-1.34l-.35-.2-3.73.98.99-3.63-.23-.37A9.54 9.54 0 1 1 21.54 12 9.53 9.53 0 0 1 12 21.54z"/>'
      + '</svg>'
    );

    // Insert after DOM ready; if body is not yet available, queue it.
    if (document.body) {
      document.body.appendChild(a);
    } else {
      window.addEventListener('DOMContentLoaded', () => document.body.appendChild(a));
    }
  } catch {}
})();
