"""Dimensionamiento básico de una celda GSM y tiempos de la trama TDMA.

Uso:
  python dimensionamiento.py              tabla con los anchos de banda del ejercicio
  python dimensionamiento.py 6 7          un caso: 6 MHz con reúso K = 7

Supuestos (los mismos de la clínica):
  - Todo el bloque del operador se divide en portadoras de 200 kHz (sin bandas de guarda).
  - Reúso de frecuencias K: las portadoras se reparten entre las K celdas del clúster
    y cada celda recibe la parte entera (las sobrantes quedan de reserva).
  - Cada portadora tiene 8 timeslots.
  - En cada celda se reservan 2 timeslots para señalización (uno para BCCH y canales comunes,
    otro para SDCCH). Es un supuesto típico de dimensionamiento, no una regla fija del estándar.
"""
import sys
from fractions import Fraction

PORTADORA_KHZ = 200
TIMESLOTS = 8
SENALIZACION = 2


def tiempos() -> None:
    periodo_bit_us = Fraction(48, 13)          # duración de un bit en GSM
    bits_por_slot = Fraction(625, 4)           # 156,25 periodos de bit por timeslot
    slot_us = periodo_bit_us * bits_por_slot
    trama_ms = slot_us * TIMESLOTS / 1000
    tasa_kbps = 1000 / periodo_bit_us          # bits por milisegundo = kbit/s
    print("Tiempos de la trama TDMA de GSM")
    print(f"  Periodo de bit:        48/13 µs = {float(periodo_bit_us):.3f} µs")
    print(f"  Timeslot:              156,25 bits × 48/13 µs = {float(slot_us):.2f} µs")
    print(f"  Trama TDMA:            8 timeslots = {float(trama_ms):.3f} ms")
    print(f"  Multitrama de 26:      26 × trama = {float(trama_ms * 26):.1f} ms")
    print(f"  Tasa bruta por portadora: {float(tasa_kbps):.3f} kbit/s")
    print(f"  Un usuario transmite 1 timeslot de cada 8: activo el {100 / TIMESLOTS:.1f} % del tiempo")


def celda(mhz: float, k: int) -> dict:
    portadoras = int(round(mhz * 1000) // PORTADORA_KHZ)
    por_celda = portadoras // k
    timeslots = por_celda * TIMESLOTS
    trafico = timeslots - SENALIZACION
    return dict(mhz=mhz, k=k, portadoras=portadoras, por_celda=por_celda,
                sobran=portadoras - por_celda * k, timeslots=timeslots,
                trafico=trafico, cluster=trafico * k, sin_reuso=portadoras * TIMESLOTS)


def imprimir(c: dict) -> None:
    print(f"  {c['mhz']:>5} MHz | K={c['k']} | {c['portadoras']:>3} portadoras | "
          f"{c['por_celda']} por celda (sobran {c['sobran']}) | {c['timeslots']:>3} timeslots | "
          f"{c['trafico']:>3} canales de tráfico por celda | {c['cluster']:>4} en el clúster | "
          f"sin reúso: {c['sin_reuso']}")


def main() -> None:
    tiempos()
    print()
    if len(sys.argv) == 3:
        imprimir(celda(float(sys.argv[1]), int(sys.argv[2])))
        return
    print("Ejemplo resuelto en la presentación")
    imprimir(celda(6, 7))
    imprimir(celda(6, 4))
    print("\nEjercicio de la clínica (según el último dígito de tu cédula)")
    for mhz in (5, 7.4, 8.6, 10, 12.4):
        imprimir(celda(mhz, 7))


if __name__ == "__main__":
    main()
