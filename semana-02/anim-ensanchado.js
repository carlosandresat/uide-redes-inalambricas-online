/* Animación · Ensanchar y desensanchar con códigos ortogonales (CDMA, como en WCDMA)
   Dos usuarios comparten la misma frecuencia al mismo tiempo, cada uno con un código OVSF de SF 4:
     código de A = C(4,1) = [+1 +1 −1 −1] · código de B = C(4,2) = [+1 −1 +1 −1]
     producto escalar = (+1)(+1) + (+1)(−1) + (−1)(+1) + (−1)(−1) = 0 → ortogonales
   Bits de A: +1, −1 · bits de B: −1, +1. Cada bit se multiplica chip a chip por el código (ensanchar).
   En el aire viaja la suma. El receptor de A multiplica por el código de A y suma los 4 chips de cada bit (desensanchar):
     bit 1: suma = +4 → +1 · bit 2: suma = −4 → −1. La parte de B suma 0 en cada bit.
   Aritmética verificada en Python. Con SF 4 la ganancia de procesamiento es 4 (6 dB); en WCDMA la tasa de chips es 3,84 Mchip/s.
   Pasos: 1 bits y código de A · 2 chips de A · 3 chips de B · 4 suma en el aire · 5 el receptor multiplica por el código de A
          6 suma por bit: recupera los bits de A · 7 por qué B no molesta.
   En modo lectura se dibuja el estado final (paso 7). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-ensanchado');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const SF = 4;
  const CA = [1, 1, -1, -1], CB = [1, -1, 1, -1];
  const BA = [1, -1], BB = [-1, 1];
  const ensanchar = (bits, cod) => bits.flatMap((b) => cod.map((c) => b * c));
  const chipsA = ensanchar(BA, CA), chipsB = ensanchar(BB, CB);
  const aire = chipsA.map((v, i) => v + chipsB[i]);
  const codA8 = [...CA, ...CA];
  const producto = aire.map((v, i) => v * codA8[i]);
  const sumas = [0, 1].map((b) => producto.slice(b * SF, b * SF + SF).reduce((a, x) => a + x, 0));
  const parteB = [0, 1].map((b) => chipsB.slice(b * SF, b * SF + SF).reduce((a, x, i) => a + x * CA[i], 0));

  const svg = nodo('svg', { viewBox: '0 0 1000 500', role: 'img',
    'aria-label': 'A y B ensanchan sus bits con códigos ortogonales de 4 chips. En el aire viaja la suma. El receptor de A multiplica por el código de A y suma 4 chips por bit: obtiene más 4 y menos 4, los bits de A; la parte de B suma cero.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 64);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const X0 = 250, W = 80; // 8 chips de 80 px
  const FILAS = [
    { id: 'codA', nombre: 'código de A', datos: codA8, paso: 1, color: 'var(--tinta-suave)' },
    { id: 'chipsA', nombre: 'A ensanchado', datos: chipsA, paso: 2, color: 'var(--acento)' },
    { id: 'chipsB', nombre: 'B ensanchado', datos: chipsB, paso: 3, color: 'var(--caja-diagrama)' },
    { id: 'aire', nombre: 'en el aire (A + B)', datos: aire, paso: 4, color: 'var(--tinta)' },
    { id: 'prod', nombre: 'aire × código de A', datos: producto, paso: 5, color: 'var(--dorado)' },
  ];
  const ALTO = 62, Y0 = 70;
  const escalaY = (v, y) => y + ALTO / 2 - v * 12; // ±2 cabe en ±24 px

  // Bits arriba
  nodo('text', { x: 20, y: 40, style: 'fill:var(--tinta);font-size:18px;font-weight:700' }, svg, 'bits de A: +1, −1 · bits de B: −1, +1 · SF 4');
  [0, 1].forEach((b) => {
    nodo('rect', { x: X0 + b * SF * W, y: 50, width: SF * W, height: 6, style: b ? 'fill:var(--regla)' : 'fill:var(--superficie)' }, svg);
    nodo('text', { x: X0 + b * SF * W + SF * W / 2, y: 46 + 0, 'text-anchor': 'middle', style: 'fill:var(--tinta-suave);font-size:15px' }, svg, `bit ${b + 1}`);
  });

  const grupos = FILAS.map((f, i) => {
    const y = Y0 + i * (ALTO + 8);
    const g = nodo('g', {}, svg);
    g.style.transition = 'opacity 400ms ease';
    nodo('text', { x: 20, y: y + ALTO / 2 + 6, style: 'fill:var(--tinta);font-size:17px;font-weight:700' }, g, f.nombre);
    nodo('line', { x1: X0, y1: escalaY(0, y), x2: X0 + 8 * W, y2: escalaY(0, y), style: 'stroke:var(--regla);stroke-width:1.5' }, g);
    let d = '';
    f.datos.forEach((v, k) => {
      const xa = X0 + k * W, xb = xa + W, yv = escalaY(v, y);
      d += (k === 0 ? `M${xa},${yv}` : `L${xa},${yv}`) + ` L${xb},${yv}`;
      nodo('text', { x: xa + W / 2, y: y + 14, 'text-anchor': 'middle', style: 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:14px' }, g, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v));
    });
    nodo('path', { d, style: `fill:none;stroke:${f.color};stroke-width:3.5` }, g);
    for (let k = 1; k < 8; k++) nodo('line', { x1: X0 + k * W, y1: y + 18, x2: X0 + k * W, y2: y + ALTO, style: `stroke:var(--regla);stroke-width:${k === 4 ? 3 : 1}` }, g);
    return { g, paso: f.paso };
  });

  // Resultado de la suma por bit
  const yRes = Y0 + 5 * (ALTO + 8) + 6;
  const res = nodo('g', {}, svg);
  res.style.transition = 'opacity 400ms ease';
  nodo('text', { x: 20, y: yRes + 22, style: 'fill:var(--tinta);font-size:17px;font-weight:700' }, res, 'suma de 4 chips');
  [0, 1].forEach((b) => {
    nodo('rect', { x: X0 + b * SF * W + 20, y: yRes, width: SF * W - 40, height: 34, rx: 6, style: 'fill:var(--superficie);stroke:var(--acento);stroke-width:3' }, res);
    nodo('text', { x: X0 + b * SF * W + SF * W / 2, y: yRes + 24, 'text-anchor': 'middle', style: 'fill:var(--acento);font-family:var(--f-codigo);font-size:19px;font-weight:700' }, res,
      `${sumas[b] > 0 ? '+' : '−'}${Math.abs(sumas[b])} → bit ${sumas[b] > 0 ? '+1' : '−1'}`);
  });
  const nota = nodo('text', { x: 20, y: 488, style: 'fill:var(--tinta);font-size:18px;font-weight:700' }, svg, '');

  const TEXTOS = [
    'Avanza para ensanchar y desensanchar.',
    'Cada bit de A dura 4 chips; su código es +1 +1 −1 −1.',
    'Ensanchar: cada bit se multiplica chip a chip por el código.',
    'B hace lo mismo con su propio código, +1 −1 +1 −1, en la misma frecuencia.',
    'En el aire las dos señales se suman: nadie puede leer a A a simple vista.',
    'El receptor de A multiplica lo que llega por el código de A.',
    `Sumando los 4 chips de cada bit: ${sumas.map((s) => (s > 0 ? '+' : '−') + Math.abs(s)).join(' y ')}. Recupera los bits de A.`,
    `La parte de B suma ${parteB.join(' y ')} en cada bit: los códigos son ortogonales. Ganancia con SF 4: 4 veces (6 dB).`,
  ];

  function dibujar(paso) {
    const p = Math.max(0, Math.min(7, paso));
    grupos.forEach((g) => { g.g.style.opacity = p >= g.paso ? 1 : 0; });
    res.style.opacity = p >= 6 ? 1 : 0;
    nota.textContent = TEXTOS[p];
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso));
  dibujar(0);
})();
