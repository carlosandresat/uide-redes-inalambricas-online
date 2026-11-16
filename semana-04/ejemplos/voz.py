"""Ancho de banda de una llamada de voz sobre IP, con y sin compresión de cabeceras (RoHC).

Uso:
  python voz.py                     ejemplo resuelto y casos del «Tu turno»
  python voz.py 12.65 6             un caso: códec de 12,65 kbit/s sobre IPv6 (usa 4 para IPv4)

Supuestos (los mismos de la clase):
  - Un paquete cada 20 ms (50 paquetes por segundo), con una trama de voz.
  - Carga útil = tasa del códec x 20 ms, redondeada hacia arriba al byte.
    Se ignora la pequeña cabecera de carga útil del códec (1 a 2 bytes).
  - Cabeceras: RTP 12 bytes + UDP 8 bytes + IP (IPv4 20 bytes, IPv6 40 bytes).
  - Con RoHC, las tres cabeceras quedan en unos 3 bytes (en régimen estable; el valor real varía de 1 a 6).
  - Es el ancho de banda a nivel IP en un sentido. No incluye las cabeceras de radio (PDCP, RLC, MAC),
    que suman unos pocos bytes más por paquete, ni las de Ethernet o 802.11 en una red local.
"""
import math
import sys

PAQUETES_POR_S = 50
RTP, UDP = 12, 8
IP = {4: 20, 6: 40}
ROHC = 3


def llamada(kbps: float, version_ip: int) -> dict:
    carga = math.ceil(kbps * 1000 * 0.020 / 8)          # bytes de voz por paquete
    cabeceras = RTP + UDP + IP[version_ip]
    sin = (carga + cabeceras) * 8 * PAQUETES_POR_S / 1000  # kbit/s
    con = (carga + ROHC) * 8 * PAQUETES_POR_S / 1000
    return dict(kbps=kbps, ip=version_ip, carga=carga, cabeceras=cabeceras,
                fraccion=cabeceras / (carga + cabeceras), sin=sin, con=con)


def imprimir(c: dict) -> None:
    print(f"  {c['kbps']:>6g} kbit/s IPv{c['ip']} | voz {c['carga']:>3} B + cabeceras {c['cabeceras']} B "
          f"({c['fraccion'] * 100:4.1f} % del paquete) | sin RoHC {c['sin']:5.1f} kbit/s | "
          f"con RoHC {c['con']:5.1f} kbit/s | ahorro {100 * (1 - c['con'] / c['sin']):4.1f} %")


def main() -> None:
    if len(sys.argv) == 3:
        imprimir(llamada(float(sys.argv[1].replace(",", ".")), int(sys.argv[2])))
        return
    print("Ejemplo resuelto: AMR-WB 12,65 kbit/s sobre IPv6")
    imprimir(llamada(12.65, 6))
    print("\n«Tu turno» (según el último dígito de tu cédula)")
    casos = [(12.2, 4, "AMR 12,2"), (23.85, 6, "AMR-WB 23,85"), (13.2, 6, "EVS 13,2"),
             (8.85, 6, "AMR-WB 8,85"), (24.4, 4, "EVS 24,4")]
    for kbps, ip, nombre in casos:
        print(f" {nombre}:")
        imprimir(llamada(kbps, ip))


if __name__ == "__main__":
    main()
