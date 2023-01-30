export function ratioToPercentage(
  x: number,
  y: number,
  orientation: "x" | "y" = "y",
) {
  if (orientation === "x") {
    return (x / y) * 100 + "%";
  }
  return (y / x) * 100 + "%";
}
