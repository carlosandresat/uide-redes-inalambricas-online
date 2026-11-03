"""Árbol de códigos OVSF (códigos de canalización de WCDMA).

Uso:
  python ovsf.py        muestra el árbol hasta SF = 8, comprueba la ortogonalidad
                        y el bloqueo de códigos

Regla de construcción: cada código c de SF = n genera dos hijos de SF = 2n: (c, c) y (c, -c).
Dos códigos del mismo SF son ortogonales: su producto punto es 0.
Un código y sus descendientes NO son ortogonales: si un usuario usa un código, sus
descendientes quedan bloqueados.
Con la tasa de chips fija (3,84 Mchip/s), la tasa de símbolos de un canal es 3,84 M / SF.
"""
TASA_CHIPS = 3.84e6


def hijos(c: list[int]) -> list[list[int]]:
    return [c + c, c + [-x for x in c]]


def arbol(sf_max: int) -> dict[int, list[list[int]]]:
    niveles = {1: [[1]]}
    sf = 1
    while sf < sf_max:
        niveles[sf * 2] = [h for c in niveles[sf] for h in hijos(c)]
        sf *= 2
    return niveles


def punto(a: list[int], b: list[int]) -> int:
    # Para comparar códigos de distinto SF, el corto se repite hasta el largo del otro
    if len(a) < len(b):
        a = a * (len(b) // len(a))
    elif len(b) < len(a):
        b = b * (len(a) // len(b))
    return sum(x * y for x, y in zip(a, b))


def texto(c: list[int]) -> str:
    return " ".join("+1" if x > 0 else "-1" for x in c)


def main() -> None:
    niveles = arbol(8)
    for sf, codigos in niveles.items():
        print(f"SF = {sf} · {len(codigos)} códigos · {TASA_CHIPS / sf / 1000:,.0f} ksímbolos/s cada uno")
        for k, c in enumerate(codigos):
            print(f"  C({sf},{k}) = {texto(c)}")
    print()
    c4 = niveles[4]
    print("Mismo SF: producto punto entre C(4,0) y los demás:",
          [punto(c4[0], c) for c in c4[1:]])
    c41, c82, c84 = niveles[4][1], niveles[8][2], niveles[8][4]
    print("C(4,1) con su hijo C(8,2):", punto(c41, c82), "-> no ortogonales: C(8,2) queda bloqueado")
    print("C(4,1) con C(8,4), de otra rama:", punto(c41, c84), "-> ortogonales: se pueden usar a la vez")


if __name__ == "__main__":
    main()
