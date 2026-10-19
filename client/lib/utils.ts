export { cn } from "cn";

export function formatCrore(pkr: number): string {
  if (isNaN(pkr) || pkr === 0) return '0.00';
  return (pkr / 10000000).toFixed(2);
}

export function formatLakhs(pkr: number): string {
  if (isNaN(pkr) || pkr === 0) return '0.00';
  return (pkr / 100000).toFixed(2);
}

export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-PK').format(Math.round(num));
}
