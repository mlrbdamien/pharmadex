// Récupère le titre d'une page web. Cette fonction existe uniquement parce que
// le CORS interdit au navigateur de lire le HTML d'un site tiers.
//
// verify_jwt = true (défaut) : sans cela, ce serait un proxy HTTP ouvert.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Le titre est toujours dans le <head> : lire 128 Ko suffit largement, et
// évite d'attendre sur une page lourde.
const MAX_BYTES = 128 * 1024;
// 10 s et non 5 : au premier appel de la journée, la fonction démarre à froid
// et l'initialisation réseau (DNS, TLS) s'ajoute au temps de réponse du site.
// Le coût d'attendre est nul — la récupération tourne en arrière-plan pendant
// que l'utilisateur saisit ses tags.
const TIMEOUT_MS = 10_000;

/**
 * Garde-fou anti-SSRF : la fonction tourne dans l'infrastructure Supabase, une
 * URL interne pourrait servir à sonder des services non exposés.
 */
function isForbiddenHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true;
  }
  // Adresses IPv4 littérales dans les plages privées ou de service.
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // dont 169.254.169.254 (métadonnées)
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  if (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80')) return true;
  return false;
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  eacute: 'é',
  egrave: 'è',
  agrave: 'à',
  ccedil: 'ç',
  ecirc: 'ê',
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function extractTitle(html: string): string | null {
  const og = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );
  const tag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const raw = og?.[1] ?? tag?.[1];
  if (!raw) return null;
  return decodeEntities(raw).replace(/\s+/g, ' ').trim().slice(0, 200) || null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  let target: URL;
  try {
    const { url } = await request.json();
    target = new URL(String(url));
  } catch {
    return json({ error: 'URL manquante ou invalide' }, 400);
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return json({ error: 'Seuls http et https sont acceptés' }, 400);
  }
  if (isForbiddenHost(target.hostname)) {
    return json({ error: 'Hôte non autorisé' }, 400);
  }

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(target, {
      signal: abort.signal,
      redirect: 'follow',
      headers: {
        // Certains sites officiels renvoient une page vide sans User-Agent.
        'User-Agent': 'Pharmadex/1.0 (+outil interne d\'officine)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok || !response.body) {
      return json({ title: null, status: response.status });
    }

    // Décodage au fil de l'eau, en s'arrêtant dès que </title> est passé.
    //
    // Le décodeur est réutilisé avec `stream: true` : sans cela, une balise à
    // cheval sur deux morceaux du flux passerait inaperçue et on avalerait la
    // page entière — et un caractère accentué coupé en deux serait mal décodé.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = '';
    let size = 0;

    while (size < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      html += decoder.decode(value, { stream: true });
      if (html.includes('</title>')) break;
    }
    html += decoder.decode();
    await reader.cancel().catch(() => {});

    return json({ title: extractTitle(html) });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'échec';
    return json({ title: null, error: message });
  } finally {
    clearTimeout(timer);
  }
});
