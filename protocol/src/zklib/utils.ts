export function toFixedHex(
  number: number | string | bigint | Uint8Array,
  length = 32
) {
  let result =
    "0x" +
    (number instanceof Uint8Array
      ? Array.from(number)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      : BigInt(number).toString(16)
    ).padStart(length * 2, "0");
  if (result.indexOf("-") > -1) {
    result = "-" + result.replace("-", "");
  }
  return result;
}
