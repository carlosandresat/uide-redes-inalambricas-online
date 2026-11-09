/* Animación · Por qué las subportadoras OFDM se solapan sin interferir
   Cada subportadora, observada durante un símbolo útil de duración T = 1/Δf, tiene un espectro
   |sinc((f − k·Δf)·T)|. Con Δf = 15 kHz (LTE), T = 1/15 000 s ≈ 66,7 µs.
   El pico de una subportadora cae exactamente donde las demás valen cero: el receptor, al muestrear en el
   centro de la subportadora k, solo ve a k (ortogonalidad). Si el receptor se desfasa en frecuencia
   (por ejemplo, Doppler o un oscilador impreciso), las demás ya no valen cero: interferencia entre subportadoras.
   Escalas: eje horizontal en kHz respecto de la subportadora central (de −45 a +45 kHz); eje vertical, amplitud normalizada.
   Pasos: 1 una subportadora · 2 cinco subportadoras solapadas · 3 muestreo en el centro de una: las demás valen 0
          4 desfase de 3 kHz (20 % de Δf): aparece interferencia · 5 comparación con FDM con bandas de guarda.
   En modo lectura se dibuja el paso 3 (la idea principal) y el texto del paso 5. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-ofdm');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const DF = 15;                 // kHz
  const K = [-2, -1, 0, 1, 2];   // subportadoras dibujadas
  const FMIN = -45, FMAX = 45;   // kHz
  const sinc = (x) => (Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));

  const svg = nodo('svg', { viewBox: '0 0 1000 470', role: 'img',
    'aria-label': 'Cinco subportadoras OFDM separadas 15 kHz. Sus espectros se solapan, pero en el centro de cada una las demás valen cero. Con un desfase de 3 kHz, las demás dejan de valer cero y aparece interferencia.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 62);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const G = { x: 70, y: 30, w: 880, h: 300 };
  const fx = (f) => G.x + ((f - FMIN) / (FMAX - FMIN)) * G.w;
  const ay = (a) => G.y + G.h * 0.78 - a * G.h * 0.7; // a = 1 → pico; a = 0 → línea base; admite negativos
  const estilo = {
    eje: 'stroke:var(--tinta-suave);stroke-width:2',
    rejilla: 'stroke:var(--regla);stroke-width:1',
    texto: 'fill:var(--tinta-suave);font-size:16px',
    curva: 'fill:none;stroke-width:3',
    muestra: 'stroke:var(--acento);stroke-width:3;stroke-dasharray:8 6',
    punto: 'fill:var(--dorado);stroke:var(--fondo);stroke-width:2',
    nota: 'fill:var(--tinta);font-size:20px;font-weight:700',
    nota2: 'fill:var(--tinta-suave);font-size:17px',
  };
  const COLORES = ['var(--caja-diagrama)', 'var(--tinta-suave)', 'var(--guinda)', 'var(--tinta-suave)', 'var(--caja-diagrama)'];

  // Ejes y marcas cada 15 kHz
  for (let f = FMIN; f <= FMAX; f += DF) {
    nodo('line', { x1: fx(f), y1: G.y, x2: fx(f), y2: G.y + G.h, style: estilo.rejilla }, svg);
    nodo('text', { x: fx(f), y: G.y + G.h + 22, 'text-anchor': 'middle', style: estilo.texto }, svg, (f > 0 ? '+' : '') + f);
  }
  nodo('line', { x1: G.x, y1: ay(0), x2: G.x + G.w, y2: ay(0), style: estilo.eje }, svg);
  nodo('text', { x: G.x + G.w / 2, y: G.y + G.h + 46, 'text-anchor': 'middle', style: estilo.texto }, svg, 'frecuencia respecto de la subportadora central (kHz) · separación Δf = 15 kHz');

  function trazo(k, desfase) {
    let d = '';
    for (let i = 0; i <= 600; i++) {
      const f = FMIN + (i / 600) * (FMAX - FMIN);
      const a = sinc((f - k * DF - desfase) / DF);
      d += (i ? 'L' : 'M') + fx(f).toFixed(1) + ',' + ay(a).toFixed(1);
    }
    return d;
  }
  const curvas = K.map((k, i) => {
    const p = nodo('path', { style: estilo.curva + ';stroke:' + COLORES[i] }, svg);
    p.style.transition = 'opacity 400ms ease';
    return p;
  });

  // FDM con bandas de guarda (paso 5): tres portadoras más angostas y separadas
  const fdm = nodo('g', {}, svg);
  fdm.style.transition = 'opacity 400ms ease';

  const linea = nodo('line', { y1: G.y, y2: ay(0), style: estilo.muestra }, svg);
  const puntos = K.map(() => nodo('circle', { r: 7, style: estilo.punto }, svg));
  const nota = nodo('text', { x: G.x, y: 410, style: estilo.nota }, svg, '');
  const nota2 = nodo('text', { x: G.x, y: 442, style: estilo.nota2 }, svg, '');

  function dibujar(paso, lectura) {
    const p = lectura ? 3 : Math.max(0, Math.min(5, paso));
    const desfase = p === 4 ? 3 : 0; // kHz
    K.forEach((k, i) => {
      curvas[i].setAttribute('d', trazo(k, desfase));
      const visible = p === 1 ? k === 0 : p >= 2 && p <= 4;
      curvas[i].style.opacity = visible ? 1 : 0;
    });
    // FDM: tres portadoras de 10 kHz de lóbulo principal con guarda (solo ilustrativo, no LTE)
    fdm.replaceChildren();
    if (p === 5) {
      [-30, 0, 30].forEach((c) => {
        let d = '';
        for (let i = 0; i <= 300; i++) {
          const f = c - 15 + (i / 300) * 30;
          const a = Math.max(0, sinc((f - c) / 7.5));
          d += (i ? 'L' : 'M') + fx(f).toFixed(1) + ',' + ay(a).toFixed(1);
        }
        nodo('path', { d, style: estilo.curva + ';stroke:var(--caja-diagrama)' }, fdm);
      });
      [-15, 15].forEach((c) => nodo('text', { x: fx(c), y: ay(0.5), 'text-anchor': 'middle', style: estilo.texto }, fdm, 'guarda'));
    }
    fdm.style.opacity = p === 5 ? 1 : 0;

    const muestreo = p === 3 || p === 4;
    linea.style.opacity = muestreo ? 1 : 0;
    linea.setAttribute('x1', fx(0)); linea.setAttribute('x2', fx(0));
    // Valor de cada subportadora en la frecuencia de muestreo f = 0 (centro de la subportadora 0)
    K.forEach((k, i) => {
      const a = sinc((0 - k * DF - desfase) / DF);
      puntos[i].setAttribute('cx', fx(0));
      puntos[i].setAttribute('cy', ay(a));
      puntos[i].style.opacity = muestreo ? 1 : 0;
    });

    const TEXTOS = [
      ['Avanza para construir la señal OFDM.', ''],
      ['Una subportadora durante un símbolo de 66,7 µs: su espectro es una sinc.', 'Su primer cero está a 15 kHz del centro: por eso la separación es Δf = 1/T = 15 kHz.'],
      ['Cinco subportadoras separadas 15 kHz: los espectros se solapan.', '¿No deberían interferir entre sí?'],
      ['En el centro de una subportadora, todas las demás valen exactamente 0.', 'Eso es la ortogonalidad: el receptor separa cada subportadora aunque se solapen.'],
      ['Con un desfase de 3 kHz (20 % de Δf), las vecinas ya no valen 0.', `En f = 0 la propia baja a ${sinc(-3 / DF).toFixed(2).replace('.', ',')} y las vecinas valen ${Math.abs(sinc((DF - 3) / DF)).toFixed(2).replace('.', ',')} y ${Math.abs(sinc((-DF - 3) / DF)).toFixed(2).replace('.', ',')}: interferencia entre subportadoras.`],
      ['FDM clásico: portadoras separadas con bandas de guarda que no transportan datos.', 'OFDM las solapa sin interferir: mucho mejor uso del espectro.'],
    ];
    nota.textContent = lectura ? TEXTOS[3][0] : TEXTOS[p][0];
    nota2.textContent = lectura ? TEXTOS[3][1] : TEXTOS[p][1];
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso, e.detail.lectura));
  dibujar(0, false);
})();
