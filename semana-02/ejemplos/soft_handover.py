"""Soft handover frente a hard handover con las mediciones de un recorrido.

Uso:
  python soft_handover.py

Mediciones: Ec/No del canal piloto (CPICH) de tres celdas, en dB, una por segundo,
mientras el usuario va de la celda A a la celda C pasando por B.

Reglas simplificadas (las mismas de la sesión; los valores reales los configura el operador):
  - Soft handover (UMTS). El conjunto activo (active set) son las celdas con las que el móvil
    se comunica a la vez. Una celda ENTRA si su Ec/No >= mejor - 3 dB (ventana de entrada).
    Una celda del conjunto SALE si su Ec/No < mejor - 5 dB (ventana de salida). Máximo 3 celdas.
    La diferencia entre las dos ventanas (2 dB) evita que una celda entre y salga a cada rato.
  - Hard handover (estilo GSM). El móvil usa una sola celda y cambia cuando una vecina supera a la
    actual por 3 dB o más (histéresis). Cada cambio corta y reconecta.
"""
ENTRADA_DB = 3
SALIDA_DB = 5
MAX_ACTIVO = 3
HISTERESIS_DB = 3

CELDAS = ["A", "B", "C"]
MEDICIONES = [  # segundo: Ec/No de A, B, C (dB)
    (-6, -14, -20),
    (-7, -11, -19),
    (-8, -9, -17),
    (-9, -8, -15),
    (-11, -7, -12),
    (-13, -7, -9),
    (-15, -8, -7),
    (-17, -10, -6),
    (-19, -13, -6),
]


def soft() -> list[str]:
    activo: list[str] = []
    filas = []
    for t, valores in enumerate(MEDICIONES):
        ecno = dict(zip(CELDAS, valores))
        mejor = max(valores)
        eventos = []
        for c in list(activo):
            if ecno[c] < mejor - SALIDA_DB:
                activo.remove(c)
                eventos.append(f"sale {c}")
        candidatas = sorted((c for c in CELDAS if c not in activo and ecno[c] >= mejor - ENTRADA_DB),
                            key=lambda c: -ecno[c])
        for c in candidatas:
            if len(activo) < MAX_ACTIVO:
                activo.append(c)
                eventos.append(f"entra {c}")
        activo.sort()
        filas.append(f"{'+'.join(activo):<6} {', '.join(eventos) or '—'}")
    return filas


def hard() -> list[str]:
    actual = "A"
    filas = []
    for valores in MEDICIONES:
        ecno = dict(zip(CELDAS, valores))
        evento = "—"
        mejor = max(CELDAS, key=lambda c: ecno[c])
        if mejor != actual and ecno[mejor] >= ecno[actual] + HISTERESIS_DB:
            evento = f"corta {actual} -> {mejor}"
            actual = mejor
        filas.append(f"{actual:<3} {evento}")
    return filas


def main() -> None:
    print(f"Soft: entra si >= mejor - {ENTRADA_DB} dB; sale si < mejor - {SALIDA_DB} dB; máximo {MAX_ACTIVO}")
    print(f"Hard: cambia si una vecina supera a la actual por {HISTERESIS_DB} dB o más\n")
    print(" t |   A    B    C | Soft: conjunto activo y eventos | Hard: celda y eventos")
    for t, (valores, s, h) in enumerate(zip(MEDICIONES, soft(), hard())):
        a, b, c = valores
        print(f" {t} | {a:4} {b:4} {c:4} | {s:<31} | {h}")
    cortes = sum("corta" in h for h in hard())
    print(f"\nHard handover: {cortes} cortes. Soft handover: ningún corte (siempre queda al menos una celda).")


if __name__ == "__main__":
    main()
