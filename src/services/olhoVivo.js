import { BASE_URL, TOKEN } from '../config';

let autenticado = false;

async function autenticar() {
  if (!TOKEN) {
    throw new Error('Token da SPTrans não configurado. Crie o arquivo .env (veja .env.example).');
  }
  const res = await fetch(`${BASE_URL}/Login/Autenticar?token=${TOKEN}`, {
    method: 'POST',
    credentials: 'include', // mantém o cookie de sessão devolvido pela API
  });
  const ok = await res.json();
  autenticado = ok === true;
  if (!autenticado) {
    throw new Error('Não foi possível autenticar na API. Verifique o token.');
  }
}

async function get(path, params = {}, tentativa = 0) {
  if (!autenticado) await autenticar();

  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}?${qs}`, { credentials: 'include' });
  } catch (e) {
    throw new Error('Sem conexão com a API da SPTrans. Verifique sua internet.');
  }

  // Sessão expirada: autentica de novo uma vez
  if (res.status === 401 && tentativa < 1) {
    autenticado = false;
    return get(path, params, tentativa + 1);
  }
  if (!res.ok) throw new Error(`Erro ${res.status} ao consultar a API.`);
  return res.json();
}

// Retorna [{ cl, lt, tl, sl, tp, ts }]
export function buscarLinhas(termo) {
  return get('/Linha/Buscar', { termosBusca: termo });
}

// Retorna [{ cp, np, ed, py, px }]
export function paradasDaLinha(codigoLinha) {
  return get('/Parada/BuscarParadasPorLinha', { codigoLinha });
}

// Retorna { hr, vs: [{ p, a, ta, py, px }] }
export function posicaoDaLinha(codigoLinha) {
  return get('/Posicao/Linha', { codigoLinha });
}

// Retorna { hr, p: { cp, np, py, px, l: [{ c, cl, sl, lt0, lt1, qv, vs: [{ p, t, a }] }] } }
export function previsaoDaParada(codigoParada) {
  return get('/Previsao/Parada', { codigoParada });
}
