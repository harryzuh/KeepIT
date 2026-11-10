/**
 * Guarda o token de login no navegador. O M1 (Autenticação) é o dono deste arquivo:
 * se a forma de guardar a sessão mudar, muda só aqui.
 */
const CHAVE = 'keepit.token';

export function obterToken(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function salvarToken(token: string) {
  try {
    localStorage.setItem(CHAVE, token);
  } catch {
    // navegação privada ou armazenamento bloqueado: a sessão dura só esta aba
  }
}

export function apagarToken() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // nada a fazer
  }
}
