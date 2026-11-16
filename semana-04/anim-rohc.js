/* Animación · Qué comprime RoHC en una llamada VoLTE
   Ejemplo resuelto de esta semana (AMR-WB de 12,65 kbit/s sobre IPv6, un paquete cada 20 ms):
     voz 32 B (12 650 bit/s × 0,020 s = 253 bits → 32 bytes enteros) + RTP 12 B + UDP 8 B + IPv6 40 B = 92 B
     sin RoHC: 92 × 8 × 50 = 36,8 kbit/s · con RoHC (cabeceras ≈ 3 B): 35 × 8 × 50 = 14,0 kbit/s · ahorro 62 %
   Escala: 6 px por byte. RoHC actúa en el PDCP, solo en la radio; en el núcleo la cabecera viaja completa.
   Pasos: 1 un paquete · 2 cinco paquetes en 100 ms · 3 RoHC comprime las cabeceras · 4 ancho de banda · 5 dónde actúa.
   En modo lectura se dibuja el estado final (paso 5). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-rohc');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const PARTES = [['IPv6', 40, '#3B6BD6'], ['UDP', 8, 'var(--tinta-suave)'], ['RTP', 12, 'var(--acento)'], ['voz', 32, 'var(--dorado)']];
  const PX = 6; // px por byte
  const svg = nodo('svg', { viewBox: '0 0 1000 460', role: 'img',
    'aria-label': 'Cada paquete de voz tiene 32 bytes de voz y 60 de cabeceras IPv6, UDP y RTP. RoHC reduce las cabeceras a unos 3 bytes en la radio: el ancho de banda baja de 36,8 a 14,0 kilobits por segundo.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 62);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    texto: 'fill:var(--tinta-suave);font-size:15px',
    rotulo: 'fill:#FFFFFF;font-size:14px;font-weight:800',
    rotuloOscuro: 'fill:var(--tinta-sobre-dorado);font-size:14px;font-weight:800',
    valor: 'fill:var(--acento);font-family:var(--f-codigo);font-size:30px;font-weight:700',
    nota: 'fill:var(--tinta);font-size:20px;font-weight:700',
  };

  function paquete(padre, x, y, comprimido, conRotulos) {
    let xi = x;
    const g = nodo('g', {}, padre);
    if (comprimido) {
      nodo('rect', { x: xi, y, width: 3 * PX, height: 40, style: 'fill:var(--guinda)' }, g);
      xi += 3 * PX;
      nodo('rect', { x: xi, y, width: 32 * PX, height: 40, style: 'fill:var(--dorado)' }, g);
      if (conRotulos) {
        nodo('text', { x: x + 1.5 * PX, y: y - 8, 'text-anchor': 'middle', style: estilo.texto }, g, 'RoHC 3 B');
        nodo('text', { x: xi + 16 * PX, y: y + 26, 'text-anchor': 'middle', style: estilo.rotuloOscuro }, g, 'voz 32 B');
      }
      return g;
    }
    PARTES.forEach(([n, b, c]) => {
      nodo('rect', { x: xi, y, width: b * PX, height: 40, style: `fill:${c};stroke:var(--fondo);stroke-width:1` }, g);
      if (conRotulos) nodo('text', { x: xi + (b * PX) / 2, y: y + 26, 'text-anchor': 'middle', style: n === 'voz' ? estilo.rotuloOscuro : estilo.rotulo }, g, `${n} ${b}`);
      xi += b * PX;
    });
    return g;
  }

  // Paso 1: un paquete grande con rótulos
  const uno = nodo('g', {}, svg);
  uno.style.transition = 'opacity 400ms ease';
  nodo('text', { x: 20, y: 40, style: 'fill:var(--tinta);font-size:18px;font-weight:700' }, uno, 'Un paquete de voz (bytes a escala, 6 px por byte): 92 B');
  paquete(uno, 20, 60, false, true);
  nodo('text', { x: 20 + 92 * PX + 12, y: 86, style: estilo.texto }, uno, '60 B de cabeceras (65 %)');

  // Pasos 2–3: cinco paquetes en 100 ms (escala de tiempo: 100 ms = 900 px), sin y con RoHC
  const T0 = 60, TW = 900, yA = 160, yB = 250;
  const flujo = nodo('g', {}, svg);
  flujo.style.transition = 'opacity 400ms ease';
  nodo('text', { x: T0, y: yA - 12, style: estilo.texto }, flujo, 'sin RoHC: un paquete de 92 B cada 20 ms');
  for (let i = 0; i < 5; i++) {
    const g = paquete(flujo, T0 + (i * TW) / 5, yA, false, false);
    g.setAttribute('transform', `translate(${T0 + (i * TW) / 5} ${yA}) scale(0.3 1) translate(${-(T0 + (i * TW) / 5)} ${-yA})`);
  }
  [0, 20, 40, 60, 80, 100].forEach((ms) => nodo('text', { x: T0 + (ms / 100) * TW, y: yB + 70, 'text-anchor': 'middle', style: estilo.texto }, flujo, `${ms} ms`));
  const comp = nodo('g', {}, svg);
  comp.style.transition = 'opacity 400ms ease';
  nodo('text', { x: T0, y: yB - 12, style: estilo.texto }, comp, 'con RoHC en la radio: 3 + 32 = 35 B cada 20 ms');
  for (let i = 0; i < 5; i++) {
    const g = paquete(comp, T0 + (i * TW) / 5, yB, true, false);
    g.setAttribute('transform', `translate(${T0 + (i * TW) / 5} ${yB}) scale(0.3 1) translate(${-(T0 + (i * TW) / 5)} ${-yB})`);
  }
  nodo('text', { x: T0, y: yB + 92, style: 'fill:var(--tinta-suave);font-size:13px' }, flujo, 'En esta fila el ancho de cada paquete está al 30 % de la escala de arriba, para que quepan 5 en 100 ms.');

  // Paso 4: anchos de banda
  const bw = nodo('g', {}, svg);
  bw.style.transition = 'opacity 400ms ease';
  nodo('text', { x: 520, y: 40, style: estilo.texto }, bw, 'sin RoHC: 92 × 8 × 50');
  nodo('text', { x: 520, y: 76, style: estilo.valor }, bw, '36,8 kbit/s');
  nodo('text', { x: 780, y: 40, style: estilo.texto }, bw, 'con RoHC: 35 × 8 × 50');
  nodo('text', { x: 780, y: 76, style: estilo.valor }, bw, '14,0 kbit/s');

  const nota = nodo('text', { x: 20, y: 410, style: estilo.nota }, svg, '');
  const nota2 = nodo('text', { x: 20, y: 440, style: 'fill:var(--tinta-suave);font-size:17px' }, svg, '');
  const TEXTOS = [
    ['Avanza para abrir un paquete de voz.', ''],
    ['De 92 bytes, solo 32 son voz: IPv6 (40), UDP (8) y RTP (12) suman 60.', ''],
    ['Un paquete cada 20 ms: 50 paquetes por segundo, cada uno con sus 60 bytes de cabecera.', 'Las cabeceras casi no cambian de un paquete a otro: direcciones y puertos son siempre los mismos.'],
    ['RoHC envía solo lo que cambia (número de secuencia, marca de tiempo): unos 3 bytes.', 'El receptor reconstruye la cabecera completa.'],
    ['Ancho de banda: de 36,8 a 14,0 kbit/s, un ahorro del 62 %.', 'A nivel IP y en un sentido.'],
    ['RoHC trabaja en el PDCP, solo entre el teléfono y la estación base.', 'En el núcleo la cabecera viaja completa: allí el ancho de banda sobra; en la radio, no.'],
  ];

  function dibujar(paso) {
    const p = Math.max(0, Math.min(5, paso));
    uno.style.opacity = p >= 1 && p <= 1 ? 1 : (p >= 4 ? 0 : (p >= 2 ? 0 : 0.25));
    flujo.style.opacity = p >= 2 ? 1 : 0;
    comp.style.opacity = p >= 3 ? 1 : 0;
    bw.style.opacity = p >= 4 ? 1 : 0;
    nota.textContent = TEXTOS[p][0];
    nota2.textContent = TEXTOS[p][1];
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso));
  dibujar(0);
})();
