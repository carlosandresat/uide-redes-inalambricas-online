"""Balance de enlace de subida (móvil -> eNodeB) y radio de la celda.

Uso:
  python balance.py          caso base y las variantes de la consigna

Pérdida máxima permitida (MAPL, en dB):
  MAPL = potencia del móvil + ganancia de antena del eNodeB - pérdida de cables
         - sensibilidad del eNodeB - margen de sombra - margen de interferencia - pérdida por penetración
Sensibilidad = -174 dBm/Hz + 10·log10(ancho de banda en Hz) + figura de ruido + SINR requerida

Radio con el modelo de 3GPP para macroceldas urbanas a 2 GHz (TR 36.942):
  L = 128,1 + 37,6·log10(R en km)  ->  R = 10^((MAPL - 128,1) / 37,6)

Los valores del caso base son típicos de un ejercicio de dimensionamiento, no de un operador real.
"""
import math

BASE = dict(
    potencia_dbm=23.0,      # móvil de clase 3: 200 mW
    ganancia_dbi=18.0,      # antena sectorial del eNodeB
    cables_db=2.0,
    rb=2,                   # 2 bloques de recursos = 360 kHz
    figura_ruido_db=3.0,
    sinr_db=-1.0,           # SINR requerida para una modulación robusta (QPSK con mucha protección)
    sombra_db=8.0,
    interferencia_db=2.0,
    penetracion_db=15.0,    # usuario dentro de un edificio
)


def calcular(p: dict) -> dict:
    ancho_hz = p["rb"] * 180e3
    ruido = -174 + 10 * math.log10(ancho_hz)
    sensibilidad = ruido + p["figura_ruido_db"] + p["sinr_db"]
    mapl = (p["potencia_dbm"] + p["ganancia_dbi"] - p["cables_db"] - sensibilidad
            - p["sombra_db"] - p["interferencia_db"] - p["penetracion_db"])
    radio = 10 ** ((mapl - 128.1) / 37.6)
    return dict(ruido=ruido, sensibilidad=sensibilidad, mapl=mapl, radio=radio)


def imprimir(nombre: str, p: dict) -> None:
    r = calcular(p)
    print(f"  {nombre:<38} ruido {r['ruido']:7.2f} dBm | sensibilidad {r['sensibilidad']:7.2f} dBm | "
          f"MAPL {r['mapl']:6.2f} dB | radio {r['radio']:.3f} km")


def main() -> None:
    print("Caso base (usuario dentro de un edificio, 2 RB)")
    imprimir("base", BASE)
    print("\nVariantes de la consigna (según el último dígito de tu cédula)")
    variantes = [
        ("0-1: usuario en la calle (sin penetración)", dict(penetracion_db=0.0)),
        ("2-3: 10 RB en lugar de 2", dict(rb=10)),
        ("4-5: margen de sombra de 12 dB", dict(sombra_db=12.0)),
        ("6-7: móvil de 20 dBm (100 mW)", dict(potencia_dbm=20.0)),
        ("8-9: figura de ruido de 5 dB", dict(figura_ruido_db=5.0)),
    ]
    for nombre, cambio in variantes:
        imprimir(nombre, {**BASE, **cambio})


if __name__ == "__main__":
    main()
