import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_FAVORITOS = '@onibus:favoritos';
const KEY_HISTORICO = '@onibus:historico';
const LIMITE_HISTORICO = 20;

async function ler(chave) {
  try {
    const raw = await AsyncStorage.getItem(chave);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function gravar(chave, valor) {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

/* ---------- Favoritos (linhas e paradas) ---------- */
// item: { id: 'linha:123' | 'parada:456', tipo: 'linha' | 'parada', dados: {...} }

export function idLinha(linha) {
  return `linha:${linha.cl}`;
}
export function idParada(parada) {
  return `parada:${parada.cp}`;
}

export function listarFavoritos() {
  return ler(KEY_FAVORITOS);
}

export async function ehFavorito(id) {
  const lista = await listarFavoritos();
  return lista.some((f) => f.id === id);
}

// Adiciona ou remove. Retorna true se ficou favoritado.
export async function alternarFavorito(item) {
  const lista = await listarFavoritos();
  const existe = lista.some((f) => f.id === item.id);
  const nova = existe ? lista.filter((f) => f.id !== item.id) : [item, ...lista];
  await gravar(KEY_FAVORITOS, nova);
  return !existe;
}

export async function removerFavorito(id) {
  const lista = await listarFavoritos();
  await gravar(KEY_FAVORITOS, lista.filter((f) => f.id !== id));
}

/* ---------- Histórico de buscas ---------- */

export function listarHistorico() {
  return ler(KEY_HISTORICO);
}

export async function adicionarHistorico(termo) {
  const t = termo.trim();
  if (!t) return;
  const lista = await listarHistorico();
  const nova = [t, ...lista.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, LIMITE_HISTORICO);
  await gravar(KEY_HISTORICO, nova);
}

export async function limparHistorico() {
  await AsyncStorage.removeItem(KEY_HISTORICO);
}
