// Converte "HH:MM" em minutos desde 00:00
function paraMinutos(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
}

// Minutos até a chegada, comparando o horário da previsão com o horário atual da API
export function minutosAte(chegada, agora) {
  if (!chegada || !agora) return null;
  let diff = paraMinutos(chegada) - paraMinutos(agora);
  if (diff < -120) diff += 24 * 60; // virada da meia-noite
  return Math.max(diff, 0);
}

export function nomeLinha(l) {
  return `${l.lt}-${l.tl}`;
}

// sl: 1 = Terminal Principal -> Secundário, 2 = Secundário -> Principal
export function rotaLinha(l) {
  return l.sl === 1 ? `${l.tp} → ${l.ts}` : `${l.ts} → ${l.tp}`;
}
