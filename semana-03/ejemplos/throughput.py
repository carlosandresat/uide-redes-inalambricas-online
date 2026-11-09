"""Velocidad de bajada de una portadora LTE a partir de la cuadrícula de recursos.

Uso:
  python throughput.py                   ejemplo resuelto y casos de la clínica
  python throughput.py 10 16QAM 2        un caso: 10 MHz, 16QAM, 2 capas MIMO

Cuadrícula (prefijo cíclico normal):
  - Bloque de recursos (RB): 12 subportadoras de 15 kHz = 180 kHz.
  - Subtrama de 1 ms = 2 ranuras de 0,5 ms = 14 símbolos OFDM.
  - Un par de RB en una subtrama tiene 12 x 14 = 168 elementos de recurso (RE).
  - Ancho de banda -> RB: 1,4 -> 6 · 3 -> 15 · 5 -> 25 · 10 -> 50 · 15 -> 75 · 20 -> 100
    (se ocupa cerca del 90 % del canal; el resto es banda de guarda).

Sobrecarga que se descuenta (supuestos de la clase):
  - 3 símbolos de control (PDCCH) al inicio de cada subtrama: 36 RE.
  - Señales de referencia (CRS) fuera de la región de control, según el número de antenas
    (TS 36.211): 1 antena -> 6 RE, 2 antenas -> 12 RE, 4 antenas -> 16 RE.
  - Se supone tantas antenas como capas. No se descuentan PBCH ni señales de sincronización
    (solo ocupan algunas subtramas), ni la codificación de canal: el resultado es la tasa
    antes de la codificación, un techo que un usuario real no alcanza.
"""
import sys

RB_POR_MHZ = {1.4: 6, 3: 15, 5: 25, 10: 50, 15: 75, 20: 100}
BITS = {"QPSK": 2, "16QAM": 4, "64QAM": 6, "256QAM": 8}
RE_POR_PAR = 12 * 14
CONTROL_SIMBOLOS = 3
CRS_FUERA_CONTROL = {1: 6, 2: 12, 4: 16}


def caso(mhz: float, modulacion: str, capas: int) -> dict:
    rb = RB_POR_MHZ[mhz]
    re_datos = RE_POR_PAR - 12 * CONTROL_SIMBOLOS - CRS_FUERA_CONTROL[capas]
    bits = BITS[modulacion]
    bruta = rb * RE_POR_PAR * 1000 * bits * capas / 1e6       # Mbit/s
    util = rb * re_datos * 1000 * bits * capas / 1e6          # Mbit/s
    return dict(mhz=mhz, mod=modulacion, capas=capas, rb=rb, subp=rb * 12,
                ocupado=rb * 0.18, re_datos=re_datos, bruta=bruta, util=util)


def imprimir(c: dict) -> None:
    print(f"  {c['mhz']:>4g} MHz {c['mod']:>6} {c['capas']} capa(s) | {c['rb']:>3} RB = {c['subp']:>4} subportadoras "
          f"({c['ocupado']:.2f} MHz ocupados) | sin descontar: {c['bruta']:6.1f} Mbit/s | "
          f"RE de datos {c['re_datos']}/168 -> {c['util']:6.1f} Mbit/s | 10 usuarios: {c['util'] / 10:5.1f} c/u")


def main() -> None:
    if len(sys.argv) == 4:
        imprimir(caso(float(sys.argv[1].replace(",", ".")), sys.argv[2].upper(), int(sys.argv[3])))
        return
    print("Pregunta del Forms: RB en 10 MHz")
    print(f"  10 MHz / 180 kHz = {10000 / 180:.1f} en teoría; LTE usa {RB_POR_MHZ[10]} RB = {RB_POR_MHZ[10] * 0.18:.0f} MHz\n")
    print("Ejemplo resuelto en la presentación")
    imprimir(caso(20, "64QAM", 2))
    print("\nEjercicio de la clínica (según el último dígito de tu cédula)")
    for args in ((5, "QPSK", 1), (10, "16QAM", 2), (15, "64QAM", 2), (3, "16QAM", 1), (10, "64QAM", 4)):
        imprimir(caso(*args))


if __name__ == "__main__":
    main()
