# Fundamentos de Redes Inalámbricas

Recorremos la evolución de las redes inalámbricas, de GSM a 5G, WLAN, Bluetooth y lo que viene, entendiendo cómo funcionan por dentro: arquitectura, acceso radio, calidad de servicio y movilidad.

**Sesiones en vivo:** martes a las 19:00 por Microsoft Teams, del 26 de octubre al 13 de diciembre de 2026. Todas se graban.

**Sitio del curso:** abre `index.html` (o la página de GitHub Pages de este repositorio) para ver las presentaciones y copiar los tutores con un clic.

## Cómo aprovechar cada semana

1. **Antes de la sesión, repasa con el tutor** (20–30 minutos). Copia el `tutor.md` de la semana y pégalo completo en ChatGPT, Gemini, Claude o el asistente que uses. Te hará preguntas, no te dará respuestas, y al final te entregará un ticket de entrada con tu duda para la clase: envíalo en el [formulario de tickets de entrada](https://forms.cloud.microsoft/r/h4WBZUxVVN) hasta las 12:00 del día de la sesión.
2. **Ven a la sesión.** Empezamos en punto con una pista para el Aprendizaje Práctico de la semana, practicamos con casos reales y resolvemos dudas en vivo.
3. **¿No pudiste asistir?** Mira la grabación (los bloques se anuncian en voz alta para que puedas saltar entre ellos) y haz el ejercicio individual que aparece al cierre de la presentación.

## Sesiones

| Semana | Sesión |
|---|---|
| 1 | 27 oct |
| 2 | 3 nov |
| 3 | 10 nov |
| 4 | 17 nov |
| 5 | 24 nov |
| 6 | 1 dic |
| 7 | 8 dic |

La presentación y el tutor de cada semana se publican a medida que avanza el curso. Encuéntralos en el sitio del curso (`index.html` o la página de GitHub Pages de este repositorio), o en las carpetas `semana-01/`, `semana-02/`, etc.

## Evaluación (todo es individual)

| Componente | Qué es | Cubre | Puntos | Fecha límite | Guía |
|---|---|---|---|---|---|
| Aprendizaje Práctico (quiz) | Quiz semanal | Tema de la semana | — | Domingo de cada semana | — |
| Aprendizaje Autónomo 1 | Informe de 3–4 páginas sobre la arquitectura GSM (APA 7) | U1 (GSM) | 12 | Domingo 15 nov | [Guía](entregas/aa1.md) |
| Aprendizaje Autónomo 2 | Informe técnico de 5–6 páginas: LTE vs. 5G y convergencia con WiFi (APA 7) | U2–U3 | 12 | Domingo 6 dic | [Guía](entregas/aa2.md) |
| Evaluación en Contacto con el Docente | Simulación en Packet Tracer de VoIP sobre WLAN para una PYME, con reporte técnico | U2–U3 (+ IoT opcional) | 34 | Domingo 13 dic | [Guía](entregas/ecd.md) |

Las guías en `entregas/` aclaran lo que pide cada trabajo y **cómo se califica**. Si el enunciado de la plataforma dice algo distinto (por ejemplo, «grupal»), vale lo que dice la guía.

## Temario por semana

| Sem. | Fecha | Unidad · Tema | Subtemas | Vence el domingo |
|---|---|---|---|---|
| 01 | 26 oct – 1 nov | U1 · T1 Fundamentos de comunicaciones GSM | 1.1 Organización y arquitectura de redes celulares · 1.2 Componentes e interfaces del sistema GSM · 1.3 Gestión de identidad de estaciones móviles y suscriptores | Aprendizaje Práctico |
| 02 | 2 – 8 nov | U1 · T2 Sistema Universal de Comunicaciones Móviles (UMTS) | 2.1 Arquitectura UMTS y componentes de red central · 2.2 Interfaz aérea WCDMA y red de acceso radio · 2.3 Gestión de movilidad y sesiones en UMTS | Aprendizaje Práctico |
| 03 | 9 – 15 nov | U2 · T1 LTE | 1.1 Arquitectura de red LTE y componentes EPC · 1.2 Interfaz aérea OFDM y gestión de recursos · 1.3 Pila de protocolos LTE y gestión de portadoras | Aprendizaje Práctico · **Aprendizaje Autónomo 1** |
| 04 | 16 – 22 nov | U2 · T2 Voz sobre LTE y WiFi | 2.1 Arquitectura IMS e implementación VoLTE · 2.2 Gestión de calidad de servicio de voz · 2.3 Integración WiFi y mecanismos de traspaso | Aprendizaje Práctico |
| 05 | 23 – 29 nov | U3 · T1 5G | 1.1 Arquitectura de red 5G y componentes centrales · 1.2 Interfaz Nueva Radio y MIMO masivo · 1.3 División de red y arquitectura basada en servicios | Aprendizaje Práctico |
| 06 | 30 nov – 6 dic | U3 · T2 WLAN | 2.1 Estándares IEEE 802.11 y arquitectura · 2.2 Seguridad WLAN y mecanismos QoS · 2.3 Diseño y gestión de WLAN empresarial | Aprendizaje Práctico · **Aprendizaje Autónomo 2** |
| 07 | 7 – 13 dic | U4 · T1 Tecnología Bluetooth **+** T2 6G | 1.1 Arquitectura y protocolos Bluetooth · 1.2 Seguridad y emparejamiento · 1.3 Aplicaciones BLE · 2.1 Comunicaciones terahertz y radio avanzada · 2.2 IA en redes inalámbricas · 2.3 Comunicaciones cuánticas y QKD | Aprendizaje Práctico · **Evaluación en Contacto con el Docente** |

## Unidades: resumen y resultados de aprendizaje

**U1 · Fundamentos de GSM y UMTS.** Arquitectura celular GSM (MS, BTS, NSS), protocolos, identidad con la SIM, paso de conmutación de circuitos a paquetes, TDMA y salto de frecuencia.
- RA1: Gestión de identidad de estaciones móviles y suscriptores.
- RA2: Diseñar configuraciones básicas de red UMTS y evaluar mecanismos de calidad de servicio UMTS.

**U2 · LTE y voz sobre LTE y WiFi.** IMS (CSCF, HSS, MRF) y VoLTE; SR-VCC para traspaso a 2G/3G; RoHC y DRX para ahorrar recursos y energía; PCRF para QoS; comparación con soluciones OTT.
- RA1: Diseñar configuraciones y optimizaciones de red LTE implementando mecanismos de calidad de servicio LTE.
- RA2: Implementar soluciones de llamadas WiFi mediante el diseño de transiciones fluidas de servicio de voz entre redes.

**U3 · 5G y WLAN.** 5G con arquitectura basada en servicios (AMF, UPF), MIMO masivo, *network slicing*, y eMBB, URLLC y mMTC. WLAN IEEE 802.11 (Wi-Fi 6), WPA3, QoS y diseño empresarial. Comparación de cómo se complementan.
- RA1: Diseñar soluciones de red 5G para diferentes casos de uso implementando conceptos de división de red.
- RA2: Diseñar soluciones WLAN empresariales optimizando el rendimiento y la cobertura WLAN.

**U4 · Bluetooth y tecnologías emergentes.** Arquitectura Bluetooth en capas (L2CAP, RFCOMM), seguridad y emparejamiento, BLE para IoT. 6G en terahertz, IA para automatizar la gestión de redes, comunicaciones cuánticas y QKD.
- RA1: Diseñar aplicaciones y soluciones BLE analizando técnicas de rendimiento y optimización.
- RA2: Evaluar tecnologías inalámbricas emergentes y su impacto.
