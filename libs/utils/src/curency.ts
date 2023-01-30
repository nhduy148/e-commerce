import numeral from "numeral";

export function toCurrency(value: string | number = 0) {
  return numeral(value).format("0,[00]$");
}
