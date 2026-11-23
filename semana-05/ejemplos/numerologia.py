"""Numerología de 5G NR: espaciado de subportadoras, ranuras, bloques de recursos y tasa bruta.
También calcula el tamaño de un arreglo de antenas de MIMO masivo.

Uso:
  python numerologia.py                 tabla de numerologías, ejemplo resuelto, «Tu turno» y antenas
  python numerologia.py 1 50 64QAM 4    un caso: mu = 1, 50 MHz, 64QAM, 4 capas

Reglas de NR (3GPP TS 38.211):
  - Espaciado de subportadoras: 15 kHz x 2^mu.
  - Subtrama de 1 ms; ranura de 14 símbolos (prefijo cíclico normal) que dura 1 / 2^mu ms.
  - Bloque de recursos: 12 subportadoras.
  - Duración útil de un símbolo: 1 / espaciado. Prefijo cíclico normal: unos 4,69 µs / 2^mu.
Bloques de recursos máximos por ancho de banda: TS 38.101-1 (FR1, hasta 7,125 GHz) y 38.101-2 (FR2).
La tasa bruta no descuenta control, señales de referencia ni codificación: es un techo teórico.
"""
import sys

BITS = {"QPSK": 2, "16QAM": 4, "64QAM": 6, "256QAM": 8}
RB_MAX = {  # (mu, MHz) -> bloques de recursos
    (0, 20): 106, (0, 50): 270,
    (1, 20): 51, (1, 40): 106, (1, 50): 133, (1, 100): 273,
    (2, 50): 65, (2, 100): 135,           # FR1
    (3, 100): 66, (3, 400): 264,          # FR2
}
C = 299_792_458  # m/s


def numerologia(mu: int) -> dict:
    df = 15 * 2 ** mu                      # kHz
    ranura = 1 / 2 ** mu                   # ms
    simbolo = 1000 / df                    # µs (parte útil)
    cp = 4.6875 / 2 ** mu                  # µs, prefijo cíclico normal (aprox.)
    return dict(mu=mu, df=df, ranura=ranura, por_subtrama=2 ** mu, simbolo=simbolo, cp=cp)


def tasa(mu: int, mhz: int, mod: str, capas: int) -> dict:
    n = numerologia(mu)
    rb = RB_MAX[(mu, mhz)]
    ocupado = rb * 12 * n["df"] / 1000     # MHz
    ranuras_s = 1000 * 2 ** mu
    bruta = rb * 12 * 14 * ranuras_s * BITS[mod] * capas / 1e6
    return dict(**n, mhz=mhz, rb=rb, ocupado=ocupado, ranuras_s=ranuras_s, bruta=bruta, mod=mod, capas=capas)


def imprimir(t: dict) -> None:
    print(f"  mu={t['mu']} ({t['df']} kHz), {t['mhz']} MHz: {t['rb']} RB = {t['ocupado']:.2f} MHz ocupados "
          f"({100 * t['ocupado'] / t['mhz']:.1f} %) | ranura {t['ranura'] * 1000:g} µs, {t['ranuras_s']} ranuras/s | "
          f"{t['mod']} x {t['capas']} capas: {t['bruta']:,.1f} Mbit/s brutos")


def antenas(ghz: float, filas: int, columnas: int) -> None:
    lam = C / (ghz * 1e9) * 100            # cm
    d = lam / 2
    print(f"  {ghz:>4} GHz: lambda = {lam:5.2f} cm, separación lambda/2 = {d:5.2f} cm, "
          f"arreglo de {filas}x{columnas} = {filas * columnas} elementos: unos {filas * d:.1f} x {columnas * d:.1f} cm")


def main() -> None:
    if len(sys.argv) == 5:
        imprimir(tasa(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3].upper(), int(sys.argv[4])))
        return
    print("Numerologías de NR")
    for mu in range(5):
        n = numerologia(mu)
        print(f"  mu={mu}: {n['df']:>3} kHz | ranura {n['ranura'] * 1000:6.1f} µs | {n['por_subtrama']:>2} ranuras por subtrama | "
              f"símbolo útil {n['simbolo']:6.2f} µs | prefijo cíclico ~{n['cp']:.2f} µs")
    print("\nEjemplo resuelto: mu = 1, 50 MHz, 64QAM, 4 capas")
    imprimir(tasa(1, 50, "64QAM", 4))
    print("\n«Tu turno»: el mismo ancho de 100 MHz, 64QAM y 4 capas con tu numerología")
    for mu in (1, 2, 3):
        imprimir(tasa(mu, 100, "64QAM", 4))
    print("\nOtras portadoras para practicar")
    for args in ((0, 20, "64QAM", 2), (1, 100, "256QAM", 4), (1, 40, "64QAM", 2), (3, 400, "64QAM", 2)):
        imprimir(tasa(*args))
    print("\nComparación con LTE (semana 3): 20 MHz, 64QAM, 2 capas -> 201,6 Mbit/s brutos")
    print("\nTamaño de un arreglo de MIMO masivo")
    antenas(3.5, 8, 8)
    antenas(28, 8, 8)
    antenas(0.7, 8, 8)


if __name__ == "__main__":
    main()
