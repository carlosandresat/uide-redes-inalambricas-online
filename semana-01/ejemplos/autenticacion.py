"""Autenticación de GSM como desafío y respuesta (simulación didáctica).

Uso:  python autenticacion.py

Qué muestra:
  1. La SIM y el AuC comparten una clave secreta Ki que nunca viaja por la red.
  2. El AuC genera un triplete (RAND, SRES, Kc) y la red solo envía RAND al móvil.
  3. La SIM calcula su SRES con Ki y RAND; la red compara las dos SRES.
  4. Una SIM clonada sin la Ki correcta no pasa la comparación.

Importante: los algoritmos reales A3 y A8 los elige cada operador (COMP128 fue el más conocido).
Aquí se usa HMAC-SHA256 solo como sustituto con la misma forma:
entra Ki (128 bits) y RAND (128 bits); salen SRES (32 bits) y Kc (64 bits).
"""
import hashlib
import hmac
import secrets


def a3_a8(ki: bytes, rand: bytes) -> tuple[bytes, bytes]:
    """Sustituto de A3/A8: devuelve (SRES de 32 bits, Kc de 64 bits)."""
    salida = hmac.new(ki, rand, hashlib.sha256).digest()
    return salida[:4], salida[4:12]


def main() -> None:
    # Se graba en la SIM al fabricarla y se guarda en el AuC del operador.
    ki = secrets.token_bytes(16)

    # --- En la red: el AuC genera el triplete y se lo entrega al MSC/VLR ---
    rand = secrets.token_bytes(16)
    sres_esperada, kc_red = a3_a8(ki, rand)
    print("Triplete que el AuC entrega al MSC/VLR")
    print(f"  RAND = {rand.hex()}  ({len(rand) * 8} bits)")
    print(f"  SRES = {sres_esperada.hex()}  ({len(sres_esperada) * 8} bits)")
    print(f"  Kc   = {kc_red.hex()}  ({len(kc_red) * 8} bits)")

    # --- Por la interfaz de radio solo viaja RAND ---
    print("\nLa red envía al móvil solo RAND. Ki nunca sale de la SIM ni del AuC.")

    # --- En la SIM: calcula SRES y Kc con su propia Ki ---
    sres_sim, kc_sim = a3_a8(ki, rand)
    print(f"La SIM responde SRES = {sres_sim.hex()}")
    print("¿Coincide con la esperada?", hmac.compare_digest(sres_sim, sres_esperada))
    print("¿Móvil y red tienen la misma Kc para cifrar?", kc_sim == kc_red)

    # --- Una SIM clonada sin la Ki correcta ---
    ki_falsa = secrets.token_bytes(16)
    sres_falsa, _ = a3_a8(ki_falsa, rand)
    print(f"\nSIM con otra Ki responde SRES = {sres_falsa.hex()}")
    print("¿Coincide con la esperada?", hmac.compare_digest(sres_falsa, sres_esperada))


if __name__ == "__main__":
    main()
