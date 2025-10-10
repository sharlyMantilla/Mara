// Catálogo básico (extensible) utilizado por tienda e producto
// id: slug único; price: número en COP; images: [principal, ...thumbs]
window.PRODUCTS = [
  {
    id: 'set-oversize',
    name: 'Set Oversize + Push Up + Medias',
    price: 90000,
    cats: ['sets','oversize'],
    images: [
      'productos/set oversize mas push up mas medias 1.jpg',
      'productos/set oversize mas push up mas medias 2.jpg',
      'productos/set oversize mas push up mas medias 3.jpg',
      'productos/set oversize mas push up mas medias 4.jpg'
    ]
  },
  {
    id: 'set-short-top',
    name: 'Set Short + Top',
    price: 60000,
    cats: ['sets'],
    images: [
      'productos/set short mas top 1.jpg',
      'productos/set short mas top 2.jpg',
      'productos/set short mas top 3.jpg',
      'productos/set short mas top 4.jpg'
    ]
  },
   // Licra corta (por color)
  {
    id: 'licra-corta-fucsia',
    name: 'Licra Corta - Fucsia',
    price: 47000,
    cats: ['licras cortas'],
    images: [
      'productos/l.icra corta - fuccia 1.webp',
      'productos/l.icra corta - fuccia 2.webp',
      'productos/l.icra corta - fuccia 3.webp',
      'productos/l.icra corta - fuccia 4.webp',
      'productos/l.icra corta - fuccia 5.webp',
      'productos/l.icra corta - fuccia 6.webp'
    ]
  },
  {
    id: 'licra-corta-lila',
    name: 'Licra Corta - Lila',
    price: 60000,
    cats: ['licras cortas'],
    images: [
      'productos/licra corta - lila 1.webp',
      'productos/licra corta - lila 2.webp',
      'productos/licra corta - lila 3.webp',
      'productos/licra corta - lila 4.webp',
      'productos/licra corta - lila 5.webp'
    ]
  },
  {
    id: 'licra-corta-roja',
    name: 'Licra Corta - Roja',
    price: 60000,
    cats: ['licras cortas'],
    images: [
      'productos/licra corta - roja 1.webp',
      'productos/licra corta - roja 2.webp',
      'productos/licra corta - roja 3.webp',
      'productos/licra corta - roja 5.webp',
      'productos/licra corta - roja 6.webp',
      'productos/licra corta - roja 7.webp',
      'productos/licra corta - roja 8.webp'
    ]
  },
  // Licra larga (por color)
  {
    id: 'licra-larga-azul',
    name: 'Licra Larga - Azul',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - azul 1.webp',
      'productos/licra larga - azul 2.webp',
      'productos/licra larga - azul 3.webp',
      'productos/licra larga - azul 4.webp',
      'productos/licra larga - azul 5.webp'
    ]
  },
  {
    id: 'licra-larga-gris',
    name: 'Licra Larga - Gris',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - gris 1.webp',
      'productos/licra larga - gris 2.webp',
      'productos/licra larga - gris 3.webp',
      'productos/licra larga - gris 4.webp',
      'productos/licra larga - gris 5.webp'
    ]
  },
  {
    id: 'licra-larga-morada',
    name: 'Licra Larga - Morada',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - morada 1.webp',
      'productos/licra larga - morada 2.webp',
      'productos/licra larga - morada 3.webp'
    ]
  },
  {
    id: 'licra-larga-negra',
    name: 'Licra Larga - Negra',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - negral 1.webp',
      'productos/licra larga - negral 2.webp',
      'productos/licra larga - negral 3.webp',
      'productos/licra larga - negral 4.webp',
      'productos/licra larga - negral 5.webp'
    ]
  },
  {
    id: 'licra-larga-roja',
    name: 'Licra Larga - Roja',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - roja 1.webp',
      'productos/licra larga - roja 2.webp',
      'productos/licra larga - roja 3.webp',
      'productos/licra larga - roja 4.webp',
      'productos/licra larga - roja 5.webp',
      'productos/licra larga - roja 6.webp'
    ]
  },
  {
    id: 'licra-larga-verde',
    name: 'Licra Larga - Verde',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - verde 1.webp',
      'productos/licra larga - verde 2.webp',
      'productos/licra larga - verde 3.webp',
      'productos/licra larga - verde 4.webp'
    ]
  },
  {
    id: 'licra-larga-verde-claro',
    name: 'Licra Larga - Verde Claro',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - verde claro 1.webp',
      'productos/licra larga - verde claro 2.webp',
      'productos/licra larga - verde claro 3.webp',
      'productos/licra larga - verde claro 4.webp',
      'productos/licra larga - verde claro 5.webp'
    ]
  },
  {
    id: 'licra-larga-azul-claro',
    name: 'Licra Larga - Azul Claro',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - azul claro 1.webp',
      'productos/licra larga - azul claro 2.webp',
      'productos/licra larga - azul claro 3.webp',
      'productos/licra larga - azul claro 4.webp',
      'productos/licra larga - azul claro 5.webp'
    ]
  },
  {
    id: 'licra-larga-azul-intenso',
    name: 'Licra Larga - Azul Intenso',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - azul intenso 1.webp',
      'productos/licra larga - azul intenso 2.webp',
      'productos/licra larga - azul intenso 3.webp',
      'productos/licra larga - azul intenso 4.webp',
      'productos/licra larga - azul intenso 5.webp',
      'productos/licra larga - azul intenso 6.webp'
    ]
  },
  {
    id: 'licra-larga-azul-pleno',
    name: 'Licra Larga - Azul Pleno',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - azul pleno 1.webp',
      'productos/licra larga - azul pleno 2.webp',
      'productos/licra larga - azul pleno 3.webp',
      'productos/licra larga - azul pleno 4.webp',
      'productos/licra larga - azul pleno 5.webp'
    ]
  },
  {
    id: 'licra-larga-fuccia',
    name: 'Licra Larga - Fucsia',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - fuccia 1.webp',
      'productos/licra larga - fuccia 2.webp',
      'productos/licra larga - fuccia 3.webp',
      'productos/licra larga - fuccia 4.webp',
      'productos/licra larga - fuccia 5.webp'
    ]
  },
  {
    id: 'licra-larga-gris-oscuro',
    name: 'Licra Larga - Gris Oscuro',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - gris oscuro 1.webp',
      'productos/licra larga - gris oscuro 2.webp',
      'productos/licra larga - gris oscuro 3.webp',
      'productos/licra larga - gris oscuro 4.webp',
      'productos/licra larga - gris oscuro 5.webp',
      'productos/licra larga - gris oscuro 6.webp'
    ]
  },
  {
    id: 'licra-larga-lila',
    name: 'Licra Larga - Lila',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - lila 1.webp',
      'productos/licra larga - lila 2.webp',
      'productos/licra larga - lila 3.webp',
      'productos/licra larga - lila 4.webp',
      'productos/licra larga - lila 5.webp'
    ]
  },
  {
    id: 'licra-larga-rosada',
    name: 'Licra Larga - Rosada',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - rosada 1.webp',
      'productos/licra larga - rosada 2.webp',
      'productos/licra larga - rosada 3.webp',
      'productos/licra larga - rosada 4.webp',
      'productos/licra larga - rosada 5.webp',
      'productos/licra larga - rosada 6.webp'
    ]
  },
  {
    id: 'licra-larga-verde-marino',
    name: 'Licra Larga - Verde Marino',
    price: 60000,
    cats: ['licras largas'],
    images: [
      'productos/licra larga - verde marino 1.webp',
      'productos/licra larga - verde marino 2.webp',
      'productos/licra larga - verde marino 3.webp',
      'productos/licra larga - verde marino 4.webp',
      'productos/licra larga - verde marino 5.webp'
    ]
  },
  // Camisetas oversize (por color)
  {
    id: 'camiseta-oversize-azul-oscuro',
    name: 'Camiseta Oversize - Azul Oscuro',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - azul oscuro 1.webp',
      'productos/Camiseta oversize - azul oscuro 2.webp',
      'productos/Camiseta oversize - azul oscuro 3.webp',
      'productos/Camiseta oversize - azul oscuro 4.webp'
    ]
  },
  {
    id: 'camiseta-oversize-beis',
    name: 'Camiseta Oversize - Beis',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - beis 1.webp',
      'productos/Camiseta oversize - beis 2.webp'
    ]
  },
  {
    id: 'camiseta-oversize-blanca',
    name: 'Camiseta Oversize - Blanca',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - blanca 1.webp',
      'productos/Camiseta oversize - blanca 2.webp',
      'productos/Camiseta oversize - blanca 3.webp',
      'productos/Camiseta oversize - blanca 4.webp'
    ]
  },
  {
    id: 'camiseta-oversize-fuccia',
    name: 'Camiseta Oversize - Fucsia',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - fuccia 1.webp',
      'productos/Camiseta oversize - fuccia 2.webp',
      'productos/Camiseta oversize - fuccia 3.webp',
      'productos/Camiseta oversize - fuccia 4.webp',
      'productos/Camiseta oversize - fuccia 5.webp'
    ]
  },
  {
    id: 'camiseta-oversize-gris-claro',
    name: 'Camiseta Oversize - Gris Claro',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - gris claro 1.webp',
      'productos/Camiseta oversize - gris claro 2.webp',
      'productos/Camiseta oversize - gris claro 3.webp',
      'productos/Camiseta oversize - gris claro 4.webp',
      'productos/Camiseta oversize - gris claro 5.webp'
    ]
  },
  {
    id: 'camiseta-oversize-marron',
    name: 'Camiseta Oversize - Marrón',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - marr�n 1.webp',
      'productos/Camiseta oversize - marr�n 2.webp',
      'productos/Camiseta oversize - marr�n 3.webp',
      'productos/Camiseta oversize - marr�n 4.webp',
      'productos/Camiseta oversize - marr�n 5.webp',
      'productos/Camiseta oversize - marr�n 6.webp'
    ]
  },
  {
    id: 'camiseta-oversize-morado',
    name: 'Camiseta Oversize - Morado',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - morado 1.webp',
      'productos/Camiseta oversize - morado 2.webp',
      'productos/Camiseta oversize - morado 3.webp',
      'productos/Camiseta oversize - morado 4.webp'
    ]
  },
  {
    id: 'camiseta-oversize-negra',
    name: 'Camiseta Oversize - Negra',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - negra 1.webp',
      'productos/Camiseta oversize - negra 2.webp',
      'productos/Camiseta oversize - negra 3.webp',
      'productos/Camiseta oversize - negra 4.webp'
    ]
  },
  {
    id: 'camiseta-oversize-rosada',
    name: 'Camiseta Oversize - Rosada',
    price: 40000,
    cats: ['camisetas oversize','oversize'],
    images: [
      'productos/Camiseta oversize - rosada 1.webp',
      'productos/Camiseta oversize - rosada 2.webp',
      'productos/Camiseta oversize - rosada 3.webp',
      'productos/Camiseta oversize - rosada 4.webp',
      'productos/Camiseta oversize - rosada 5.webp',
      'productos/Camiseta oversize - rosada 6.webp'
    ]
  }
];

window.priceToCOP = function(n){
  try {return n.toLocaleString('es-CO', {style:'currency', currency:'COP', maximumFractionDigits:0});}
  catch {return `$${n}`}
}

// Merge productos generados automáticamente si existen
;(function(){
  if (!Array.isArray(window.PRODUCTS)) window.PRODUCTS = [];
  if (Array.isArray(window.PRODUCTS_AUTO)){
    const seen = new Set(window.PRODUCTS.map(p => p && p.id));
    const add = window.PRODUCTS_AUTO.filter(p => p && p.id && !seen.has(p.id) && p.id !== 'camiseta-oversize-negra-4');
    window.PRODUCTS.push(...add);
  }
  // Normaliza precios por categora
  try {
    const norm = (p)=>{
      const cats = (p.cats||[]).map(c=>String(c).toLowerCase());
      if (cats.includes('camisetas oversize')) p.price = 40000;
      else if (cats.includes('licras cortas')) p.price = 40000;
      else if (cats.includes('licras largas')) p.price = 60000;
    };
    window.PRODUCTS.forEach(p=>{ if(p) norm(p); });
  } catch {}
})();
