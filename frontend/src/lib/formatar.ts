const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const data = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

/** 4299 → "R$ 4.299,00" */
export function formatarMoeda(valor: number | string) {
  return moeda.format(Number(valor));
}

/** "2026-12-12" ou Date → "12/12/2026" */
export function formatarData(valor: string | Date) {
  return data.format(typeof valor === 'string' ? new Date(valor) : valor);
}

/** 1536 → "1,5 KB"; usado na cota de armazenamento */
export function formatarBytes(bytes: number) {
  const unidades = ['B', 'KB', 'MB', 'GB'];
  let valor = bytes;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i++;
  }
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${unidades[i]}`;
}
