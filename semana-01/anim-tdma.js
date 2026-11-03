/* Animación tiempo-frecuencia de GSM (FDMA + TDMA + salto de frecuencia).
   Escucha el evento «paso» de su diapositiva:
     paso 1: portadoras de 200 kHz (FDMA)
     paso 2: 8 timeslots de 576,9 µs por portadora; trama de 4,615 ms (TDMA)
     paso 3: dos llamadas, cada una en su timeslot, siempre en la misma portadora
     paso 4: salto de frecuencia: en cada trama el timeslot cambia de portadora
   En modo lectura muestra el estado final (paso 4).
   Escala: 3 tramas (24 timeslots, 13,846 ms) en el eje horizontal; 4 portadoras de GSM-900
   (enlace descendente, ARFCN 1 a 4: 935,2 + 0,2·(n − 1) MHz) en el vertical. */

(function () {
  'use strict';
  const fig = document.getElementById('anim-tdma');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');
  const NS = 'http://www.w3.org/2000/svg';

  const X0 = 170, X1 = 990, Y0 = 30, ALTO_BANDA = 66, SEP = 74;
  const TRAMAS = 3, SLOTS = 8;
  const anchoSlot = (X1 - X0) / (TRAMAS * SLOTS);
  // De arriba abajo: frecuencia mayor arriba
  const portadoras = ['935,8 MHz', '935,6 MHz', '935,4 MHz', '935,2 MHz'];
  const yBanda = (i) => Y0 + i * SEP;
  const ejeY = Y0 + portadoras.length * SEP + 4;

  // Llamadas: timeslot fijo; portadora por trama sin salto y con salto
  const llamadas = [
    { clase: 'tu', ts: 2, fija: 2, salto: [2, 0, 3] },
    { clase: 'otro', ts: 5, fija: 2, salto: [1, 3, 0] },
  ];

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', {
    viewBox: '0 0 1000 470',
    role: 'img',
    'aria-label': 'Plano tiempo-frecuencia de GSM: cuatro portadoras de 200 kHz, cada una dividida en tramas de 8 timeslots, con dos llamadas que saltan de portadora en cada trama.',
  });

  // Capa 1: portadoras (FDMA)
  const capa1 = nodo('g', { class: 'capa' }, svg);
  portadoras.forEach((f, i) => {
    nodo('rect', { x: X0, y: yBanda(i), width: X1 - X0, height: ALTO_BANDA, class: 'banda' }, capa1);
    nodo('text', { x: X0 - 12, y: yBanda(i) + ALTO_BANDA / 2 + 6, 'text-anchor': 'end', class: 'rot-fuerte' }, capa1, f);
  });
  // Cota de 200 kHz entre dos centros de portadora
  const cx = 24, c1 = yBanda(0) + ALTO_BANDA / 2, c2 = yBanda(1) + ALTO_BANDA / 2;
  nodo('path', { d: `M${cx + 8},${c1} h-8 V${c2} h8`, class: 'cota' }, capa1);
  nodo('text', { x: cx - 6, y: (c1 + c2) / 2 + 6, 'text-anchor': 'start', class: 'rot', transform: `rotate(-90 ${cx - 6} ${(c1 + c2) / 2})` }, capa1, '200 kHz');

  // Capa 2: timeslots y tramas (TDMA)
  const capa2 = nodo('g', { class: 'capa' }, svg);
  portadoras.forEach((_, i) => {
    for (let s = 1; s < TRAMAS * SLOTS; s++) {
      const x = X0 + s * anchoSlot;
      nodo('line', { x1: x, y1: yBanda(i), x2: x, y2: yBanda(i) + ALTO_BANDA, class: s % SLOTS === 0 ? 'limite-trama' : 'rejilla' }, capa2);
    }
  });
  for (let s = 0; s < SLOTS; s++) {
    nodo('text', { x: X0 + (s + 0.5) * anchoSlot, y: Y0 - 8, 'text-anchor': 'middle', class: 'rot' }, capa2, String(s));
  }
  const tiempos = ['0', '4,615', '9,231', '13,846 ms'];
  for (let t = 0; t <= TRAMAS; t++) {
    const x = X0 + t * SLOTS * anchoSlot;
    nodo('line', { x1: x, y1: ejeY, x2: x, y2: ejeY + 10, class: 'eje' }, capa2);
    nodo('text', { x, y: ejeY + 30, 'text-anchor': t === TRAMAS ? 'end' : (t === 0 ? 'start' : 'middle'), class: 'rot' }, capa2, tiempos[t]);
    if (t < TRAMAS) {
      nodo('text', { x: x + (SLOTS * anchoSlot) / 2, y: ejeY + 56, 'text-anchor': 'middle', class: 'rot-fuerte' }, capa2, `Trama ${t + 1}`);
    }
  }
  nodo('path', { d: `M${X0},${ejeY + 70} v8 h${anchoSlot} v-8`, class: 'cota' }, capa2);
  nodo('text', { x: X0, y: ejeY + 100, class: 'rot' }, capa2, '1 timeslot = 576,9 µs');

  // Ejes (siempre visibles)
  nodo('line', { x1: X0, y1: ejeY, x2: X1, y2: ejeY, class: 'eje' }, svg);
  nodo('text', { x: X1, y: ejeY + 100, 'text-anchor': 'end', class: 'rot' }, svg, 'Tiempo →');

  // Capa 3: llamadas (ráfagas)
  const capa3 = nodo('g', { class: 'capa' }, svg);
  const rafagas = [];
  llamadas.forEach((ll) => {
    for (let t = 0; t < TRAMAS; t++) {
      const r = nodo('rect', {
        x: X0 + (t * SLOTS + ll.ts) * anchoSlot + 3,
        y: yBanda(0) + 6,
        width: anchoSlot - 6,
        height: ALTO_BANDA - 12,
        rx: 4,
        class: `rafaga ${ll.clase}`,
      }, capa3);
      rafagas.push({ r, ll, t });
    }
  });
  const leyenda = nodo('g', {}, capa3);
  nodo('rect', { x: 560, y: ejeY + 84, width: 22, height: 22, rx: 4, class: 'tu' }, leyenda);
  nodo('text', { x: 590, y: ejeY + 101, class: 'rot-fuerte' }, leyenda, 'Tu llamada (TS 2)');
  nodo('rect', { x: 760, y: ejeY + 84, width: 22, height: 22, rx: 4, class: 'otro' }, leyenda);
  nodo('text', { x: 790, y: ejeY + 101, class: 'rot-fuerte' }, leyenda, 'Otra (TS 5)');

  fig.insertBefore(svg, fig.firstChild);

  function dibujar(paso) {
    [capa1, capa2, capa3].forEach((c, i) => c.classList.toggle('on', paso >= i + 1));
    rafagas.forEach(({ r, ll, t }) => {
      const banda = paso >= 4 ? ll.salto[t] : ll.fija;
      r.style.transform = `translateY(${banda * SEP}px)`;
    });
  }

  dibujar(0);
  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.lectura ? 4 : e.detail.paso));
})();
