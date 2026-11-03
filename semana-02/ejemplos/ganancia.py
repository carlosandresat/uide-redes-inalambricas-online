"""Ganancia de procesamiento de WCDMA, capacidad aproximada de una celda y respiración celular.

Uso:
  python ganancia.py            ejemplo resuelto (144 kbit/s) y las tasas de la clínica
  python ganancia.py 64         un caso: un servicio de 64 kbit/s

Supuestos (los mismos de la clínica; son simplificaciones de dimensionamiento, no reglas del estándar):
  - Tasa de chips de UMTS: 3,84 Mchip/s (constante para todos los servicios).
  - Ganancia de procesamiento: Gp = tasa de chips / tasa de bits del usuario.
  - Eb/No requerido: 5 dB para todos los servicios (en la realidad depende del servicio y del entorno).
  - Capacidad de polo del enlace ascendente (carga del 100 %), todos los usuarios con el mismo servicio:
        N = 1 + Gp / ((Eb/No) · v · (1 + i))
    con v = 1 (transmisión continua) e i = 0,55 (interferencia de otras celdas / interferencia propia).
  - Elevación del ruido con la carga η: 10·log10(1 / (1 - η)) dB.
  - Respiración celular: con un exponente de pérdidas n = 3,5, el radio se multiplica por
        10^(-elevación / (10 · n)).
"""
import math
import sys

TASA_CHIPS = 3.84e6          # chip/s
EBNO_DB = 5.0                # dB
I_OTRAS = 0.55               # interferencia de otras celdas, relativa a la propia
V_ACTIVIDAD = 1.0            # factor de actividad
N_PERDIDAS = 3.5             # exponente de pérdidas de propagación


def db(x: float) -> float:
    return 10 * math.log10(x)


def lineal(x_db: float) -> float:
    return 10 ** (x_db / 10)


def servicio(kbps: float) -> dict:
    gp = TASA_CHIPS / (kbps * 1000)
    ci = EBNO_DB - db(gp)                       # C/I requerido en dB
    polo_aislada = 1 + gp / (lineal(EBNO_DB) * V_ACTIVIDAD)
    polo = 1 + gp / (lineal(EBNO_DB) * V_ACTIVIDAD * (1 + I_OTRAS))
    return dict(kbps=kbps, gp=gp, gp_db=db(gp), ci=ci,
                polo_aislada=polo_aislada, polo=polo)


def imprimir(s: dict) -> None:
    print(f"  {s['kbps']:>6g} kbit/s | Gp = {s['gp']:7.2f} = {s['gp_db']:5.2f} dB | "
          f"C/I requerido = {s['ci']:6.2f} dB | usuarios (celda aislada) = {s['polo_aislada']:6.1f} "
          f"| usuarios (con otras celdas) = {s['polo']:6.1f} -> {math.floor(s['polo'])}")


def respiracion() -> None:
    print("Respiración celular (la carga eleva el ruido y achica la celda)")
    for carga in (0.0, 0.25, 0.5, 0.75, 0.9):
        elevacion = db(1 / (1 - carga))
        radio = 10 ** (-elevacion / (10 * N_PERDIDAS))
        print(f"  carga {carga * 100:4.0f} % | elevación del ruido {elevacion:5.2f} dB | "
              f"radio × {radio:.3f} | área × {radio ** 2:.3f}")


def main() -> None:
    print(f"Supuestos: {TASA_CHIPS / 1e6:.2f} Mchip/s · Eb/No = {EBNO_DB} dB · i = {I_OTRAS} · v = {V_ACTIVIDAD}\n")
    if len(sys.argv) == 2:
        imprimir(servicio(float(sys.argv[1].replace(",", "."))))
        return
    print("Ejemplo resuelto en la presentación")
    imprimir(servicio(144))
    print("\nEjercicio de la clínica (según el último dígito de tu cédula)")
    for kbps in (12.2, 32, 64, 128, 384):
        imprimir(servicio(kbps))
    print("\nPregunta del Forms: de 12,2 a 384 kbit/s")
    a, b = servicio(12.2), servicio(384)
    print(f"  Gp baja {a['gp'] / b['gp']:.1f} veces ({a['gp_db'] - b['gp_db']:.1f} dB)")
    print()
    respiracion()


if __name__ == "__main__":
    main()
