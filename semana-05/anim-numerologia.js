/* Animación · Numerología de 5G NR: la misma rejilla de 1 ms × 120 kHz con μ = 0, 1, 2 y 3
   Δf = 15 kHz · 2^μ · ranura de 14 símbolos (prefijo cíclico normal) = 1 ms / 2^μ.
   Duración útil de un símbolo = 1/Δf = 66,67 µs / 2^μ. Prefijo cíclico normal ≈ 4,69 µs / 2^μ (TS 38.211).
   Cada elemento de recurso ocupa Δf × (duración de símbolo): al subir μ se vuelve el doble de alto y la mitad de angosto,
   así que en la misma ventana caben siempre 14 × 8 = 112 elementos (con 15 kHz: 8 subportadoras × 14 símbolos).
   Escalas: horizontal 1 ms = 800 px; vertical 120 kHz = 240 px (2 px por kHz).
   Pasos: 1 μ = 0 · 2 μ = 1 · 3 μ = 2 · 4 μ = 3 · 5 resumen (latencia frente a prefijo cíclico).
   En modo lectura se dibuja μ = 1 con el resumen. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-numerologia');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 470', role: 'img',
    'aria-label': 'Rejilla de 1 milisegundo por 120 kilohercios. Con mu igual a 0 hay 8 subportadoras de 15 kHz y una ranura de 1 ms; con mu igual a 3 hay una subportadora de 120 kHz y 8 ranuras de 0,125 ms. Cada elemento de recurso cambia de forma pero no de área.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 62);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const G = { x: 120, y: 40, w: 800, h: 240 };
  const estilo = {
    re: 'fill:var(--superficie);stroke:var(--caja-diagrama);stroke-width:1',
    reMarcado: 'fill:var(--dorado);fill-opacity:.55;stroke:var(--caja-diagrama);stroke-width:1',
    ranura: 'stroke:var(--acento);stroke-width:4',
    texto: 'fill:var(--tinta-suave);font-size:15px',
    valor: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:18px;font-weight:700',
    nota: 'fill:var(--tinta);font-size:20px;font-weight:700',
  };
  nodo('rect', { x: G.x, y: G.y, width: G.w, height: G.h, style: 'fill:none;stroke:var(--tinta-suave);stroke-width:2' }, svg);
  nodo('text', { x: G.x, y: G.y + G.h + 22, style: estilo.texto }, svg, '0');
  nodo('text', { x: G.x + G.w, y: G.y + G.h + 22, 'text-anchor': 'end', style: estilo.texto }, svg, '1 ms');
  nodo('text', { x: G.x - 10, y: G.y + 6, 'text-anchor': 'end', style: estilo.texto }, svg, '120 kHz');
  nodo('text', { x: G.x - 10, y: G.y + G.h, 'text-anchor': 'end', style: estilo.texto }, svg, '0');
  nodo('text', { x: G.x - 10, y: G.y + G.h / 2 + 5, 'text-anchor': 'end', style: estilo.texto }, svg, 'frecuencia');
  nodo('text', { x: G.x + G.w / 2, y: G.y + G.h + 22, 'text-anchor': 'middle', style: estilo.texto }, svg, 'tiempo');

  const rejilla = nodo('g', {}, svg);
  const datos = nodo('g', {}, svg);
  const nota = nodo('text', { x: 20, y: 432, style: estilo.nota }, svg, '');
  const nota2 = nodo('text', { x: 20, y: 460, style: 'fill:var(--tinta-suave);font-size:17px' }, svg, '');
  const fmt = (x, d) => x.toFixed(d).replace('.', ',');

  function dibujarMu(mu) {
    rejilla.replaceChildren();
    const subp = 8 / 2 ** mu;          // subportadoras en 120 kHz
    const simb = 14 * 2 ** mu;         // símbolos en 1 ms
    const alto = G.h / subp, ancho = G.w / simb;
    for (let s = 0; s < subp; s++) {
      for (let t = 0; t < simb; t++) {
        nodo('rect', { x: G.x + t * ancho, y: G.y + G.h - (s + 1) * alto, width: ancho, height: alto,
          style: s === 0 && t === 0 ? estilo.reMarcado : estilo.re }, rejilla);
      }
    }
    for (let r = 1; r < 2 ** mu; r++) {
      const x = G.x + r * 14 * ancho;
      nodo('line', { x1: x, y1: G.y - 6, x2: x, y2: G.y + G.h + 6, style: estilo.ranura }, rejilla);
    }
    datos.replaceChildren();
    const filas = [
      ['μ', String(mu)],
      ['Δf', `${15 * 2 ** mu} kHz`],
      ['ranura', `${fmt(1 / 2 ** mu, mu === 3 ? 3 : mu === 2 ? 2 : 1)} ms`],
      ['ranuras / ms', String(2 ** mu)],
      ['símbolo útil', `${fmt(1000 / (15 * 2 ** mu), 2)} µs`],
      ['prefijo cíclico', `≈ ${fmt(4.69 / 2 ** mu, 2)} µs`],
    ];
    filas.forEach(([k, v], i) => {
      const x = 120 + i * 140;
      nodo('text', { x, y: G.y + G.h + 56, style: estilo.texto }, datos, k);
      nodo('text', { x, y: G.y + G.h + 82, style: estilo.valor }, datos, v);
    });
  }

  const TEXTOS = [
    ['Avanza para cambiar la numerología.', ''],
    ['μ = 0, como LTE: 8 subportadoras de 15 kHz y una ranura de 1 ms (14 símbolos).', 'El elemento marcado es 1 subportadora × 1 símbolo.'],
    ['μ = 1: subportadoras de 30 kHz, ranuras de 0,5 ms. Típico en banda media (3,5 GHz).', 'El elemento es el doble de alto y la mitad de angosto: la misma área.'],
    ['μ = 2: 60 kHz, ranuras de 0,25 ms.', 'En 1 ms caben 4 ranuras: el planificador decide más seguido, menos latencia.'],
    ['μ = 3: 120 kHz, ranuras de 0,125 ms. Típico en ondas milimétricas.', 'Pero el prefijo cíclico baja a 0,59 µs: tolera ecos menores.'],
    ['Δf × duración útil del símbolo = 1: siempre 112 elementos en 1 ms × 120 kHz.', 'Subir μ compra latencia y tolerancia al Doppler a cambio de prefijo cíclico (celdas grandes con muchos ecos piden μ bajo).'],
  ];

  function dibujar(paso, lectura) {
    const p = lectura ? 5 : Math.max(0, Math.min(5, paso));
    const mu = p === 0 ? 0 : p === 5 ? (lectura ? 1 : 3) : p - 1;
    dibujarMu(mu);
    rejilla.style.opacity = p === 0 ? 0.3 : 1;
    nota.textContent = TEXTOS[p][0];
    nota2.textContent = TEXTOS[p][1];
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso, e.detail.lectura));
  dibujar(0, false);
})();
