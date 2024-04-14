
export function toFixedHex(
  number: number | Buffer | string | bigint | Uint8Array,
  length = 32
) {
  let result =
    "0x" +
    (number instanceof Buffer || number instanceof Uint8Array
      ? number.toString("hex")
      : BigInt(number).toString(16)
    ).padStart(length * 2, "0");
  if (result.indexOf("-") > -1) {
    result = "-" + result.replace("-", "");
  }
  return result;
}
