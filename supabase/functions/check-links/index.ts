// Vérificateur hebdomadaire des liens, déclenché par la GitHub Action
// `check-links.yml`.
//
// verify_jwt = false (voir supabase/config.toml) : l'appelant est une machine,
// pas un utilisateur. L'authentification se fait par un secret partagé.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 5;

type Row = { id: string; url: string; broken: boolean };

async function probe(url: string): Promise<{ status: number | null; broken: boolean }> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  const headers = { 'User-Agent': 'Pharmadex/1.0 (+vérificateur de liens)' };

  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: abort.signal, headers });

    // Beaucoup de sites officiels refusent HEAD (405) ou l'implémentent mal.
    if (response.status === 405 || response.status === 501 || response.status === 403) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: abort.signal, headers });
    }

    // Seules les disparitions franches comptent. Un 403 ou un 429 signale un
    // pare-feu ou une limitation de débit, pas un lien mort : marquer la
    // ressource « cassée » pour ça ferait crier au loup et l'équipe finirait
    // par ignorer le badge.
    const broken = response.status === 404 || response.status === 410;
    return { status: response.status, broken };
  } catch {
    return { status: null, broken: true };
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (request) => {
  const secret = Deno.env.get('CHECK_LINKS_SECRET');
  if (!secret || request.headers.get('x-pharmadex-secret') !== secret) {
    return new Response(JSON.stringify({ error: 'non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    // Injectée automatiquement par Supabase : contourne la RLS, ce qui est
    // nécessaire ici puisqu'aucun utilisateur n'est connecté.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase
    .from('resources')
    .select('id,url,broken')
    .not('url', 'is', null);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rows = (data ?? []) as Row[];
  const checkedAt = new Date().toISOString();
  let broken = 0;
  let repaired = 0;

  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    await Promise.all(
      rows.slice(i, i + CONCURRENCY).map(async (row) => {
        const result = await probe(row.url);
        if (result.broken) broken += 1;
        if (row.broken && !result.broken) repaired += 1;
        await supabase
          .from('resources')
          .update({
            broken: result.broken,
            last_status: result.status,
            last_checked_at: checkedAt,
          })
          .eq('id', row.id);
      }),
    );
  }

  return new Response(
    JSON.stringify({ checked: rows.length, broken, repaired, at: checkedAt }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
