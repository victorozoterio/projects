export function formatDecimalBR(value: number): string {
  return value.toFixed(2).replace('.', ',');
}
