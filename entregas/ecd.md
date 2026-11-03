# Evaluación en Contacto con el Docente · Implementación de VoIP en redes WLAN con simulaciones y reporte técnico

**Fundamentos de Redes Inalámbricas** · Vence el **domingo 13 de diciembre de 2026** · 34 puntos · **Individual** · Integra VoLTE y WiFi (semana 4) con WLAN (semana 6); el IoT opcional conecta con la semana 7

## En resumen

Una PYME de 20 empleados (TechSolutions S.A.) quiere telefonía IP sobre su red inalámbrica sin que la voz se degrade cuando la red se congestiona. Tienes que:
- **Diseñar y simular la red en Packet Tracer**: WLAN con 3 puntos de acceso, telefonía IP, VLAN de voz y QoS.
- **Probarla en tres escenarios.**
- **Investigar los protocolos de VoIP.**
- **Escribir un reporte técnico** de unas 9 páginas.

## Aclaraciones sobre el enunciado de la plataforma

| La plataforma dice | Qué hacer |
|---|---|
| Servidor **Asterisk**, punto de acceso **Cisco CAP3502**, teléfonos **Yealink T46S** | Packet Tracer no incluye esos equipos. Usa sus equivalentes en el simulador; por ejemplo, la telefonía IP se configura en un *router* con `telephony-service` y los teléfonos IP de Packet Tracer. |
| Resultados ya escritos: «MOS 4.3, latencia 35 ms, *jitter* 12 ms», «sin QoS MOS 2.8, con WMM 3.9», «impacto IoT < 3 %» | Son **valores de referencia, no resultados para copiar**. Packet Tracer no mide MOS ni *jitter*. Reporta lo que el simulador sí muestra (llamadas establecidas, tiempos de *ping*, cómo se priorizan los paquetes en el modo simulación, tus configuraciones). Si das cifras de MOS o *jitter*, preséntalas como **estimación justificada** y explica cómo la obtuviste. |
| WPA2-Enterprise (enunciado) frente a WPA3-Enterprise, 5 GHz y SIP con TLS (rúbrica) | Basta con **WPA2-Enterprise con servidor RADIUS**. Lo demás suma solo si el simulador lo permite. |
| «Escala: 31–34 Excelente…» | La nota es la suma de los criterios de la tabla de abajo. |
| *Handover* entre puntos de acceso con pérdida menor a 1 paquete; análisis en Wireshark | Opcionales. |

## Paso a paso recomendado

1. **Topología**:
   - 3 puntos de acceso en los canales **1, 6 y 11** de 2,4 GHz.
   - *Switch* y *router* con telefonía IP.
   - Servidor RADIUS.
   - Teléfonos IP y PC con *softphone*.
   - Opcional: un sensor IoT.
2. **VLAN**: una para voz (VLAN 10) y otra para datos, con *trunk* 802.1Q.
3. **Seguridad**: SSID con WPA2-Enterprise autenticando contra el servidor RADIUS.
4. **Telefonía**: registra las extensiones y comprueba llamadas entre teléfonos conectados a puntos de acceso distintos.
5. **QoS**: marca o confía en DSCP EF para la voz.
6. **Tres escenarios**:
   1. Condiciones normales.
   2. Congestión **sin** QoS.
   3. Congestión **con** QoS (opcional: IoT funcionando junto con la voz).
   
   Para cada uno, guarda **evidencia** (capturas) y explica las diferencias con la teoría.
7. **Investigación**:
   - SIP, RTP y RTCP, con un flujo de ejemplo (INVITE → 200 OK → ACK → audio RTP).
   - Al menos 3 problemas reales de VoIP en WiFi, con datos o fuentes.
   - Al menos 3 soluciones (WMM, banda de 5 GHz, plan de canales, 802.11r), indicando qué problema resuelve cada una.
8. **Reporte**:
   - Introducción (1 página).
   - Diseño de red con diagrama topológico propio (2 páginas).
   - Simulaciones (3 páginas).
   - Investigación (2 páginas).
   - Conclusiones y recomendaciones (1 página), incluida una tabla G.711 vs. G.729 (tasa, calidad, ancho de banda con cabeceras).

## Cómo se califica

| Criterio | Excelente | Aceptable | Deficiente |
|---|---|---|---|
| **Configuración WLAN/VoIP** (6 / 3 / 1) | 3 puntos de acceso en canales 1, 6 y 11 (o 5 GHz justificado); WPA2-Enterprise con RADIUS; VLAN de voz y datos con *trunk*; QoS para voz (DSCP EF); extensiones registradas y llamadas entre puntos de acceso distintos. | Llamadas funcionando, pero con WPA2-Personal, sin VLAN separadas o sin QoS. | Red abierta, o las llamadas no funcionan. |
| **Simulaciones de red** (8 / 5 / 2) | Los tres escenarios con evidencia del simulador y análisis que explica las diferencias con la teoría; las métricas que el simulador no mide se presentan como estimación justificada. | 2–3 escenarios con poca evidencia o análisis superficial. | Un solo escenario, o cifras sin evidencia (por ejemplo, copiadas del enunciado). |
| **Reporte técnico** (10 / 7 / 4) | Estructura completa, diagrama propio, tablas comparativas (incluida G.711 vs. G.729), formato profesional. | Falta una sección, o el análisis es básico. | Solo describe, sin diagrama ni tablas. |
| **Investigación VoIP** (6 / 4 / 2) | SIP, RTP y RTCP con un flujo de ejemplo; 3+ problemas con datos o fuentes; 3+ soluciones conectadas con cada problema. | Protocolos sin ejemplo; problemas genéricos; soluciones poco detalladas. | Sin explicación clara, o problemas y soluciones ausentes. |
| **Presentación del informe** (3 / 2 / 1) | Diseño profesional, estructura clara, citas y referencias en APA 7. | Organización regular o citas incompletas. | Desorganizado, sin citas. |
| **Dispositivo IoT** (opcional, 1) | Sensor IoT funcionando en la misma red sin interrumpir las llamadas, con evidencia. | — | — |
