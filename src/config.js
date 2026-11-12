// Usa HTTPS (fontes indicam que o HTTP foi descontinuado em 2024). Confirme a base URL e a versão
// na documentação oficial da SPTrans (Olho Vivo); se a API exigir HTTP, troque aqui.
export const BASE_URL = 'https://api.olhovivo.sptrans.com.br/v2.1';

// Token vem do arquivo .env (não versionado). Veja .env.example
export const TOKEN = process.env.EXPO_PUBLIC_SPTRANS_TOKEN;
