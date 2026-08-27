// Récupération d'une notice AIPS pour affichage dans l'application.
//
// files.refdata.ch n'expose pas de CORS : le navigateur ne peut pas y accéder
// directement. Cette fonction rapporte le document ; l'application le rend
// elle-même (iframe srcdoc) — la passerelle Supabase interdisant de servir du
// text/html rendu depuis son domaine, le Content-Type importe peu ici.
//
// verify_jwt = true : appelée via supabase.functions.invoke, JWT fourni.

const ALLOWED = /^[a-f0-9]{16,64}-(de|fr|it|en)\.html$/;
const BASE = 'https://files.refdata.ch/simis-public-prod/MedicinalDocuments/';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  let doc = '';
  try {
    doc = String((await request.json()).doc ?? '');
  } catch {
    /* corps absent */
  }
  if (!ALLOWED.test(doc)) {
    return new Response(JSON.stringify({ error: 'document non autorisé' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const upstream = await fetch(BASE + doc, {
    headers: { 'User-Agent': 'Pharmadex/1.0 (+relais de notices)' },
  });
  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: 'notice indisponible' }), {
      status: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(await upstream.text(), {
    headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' },
  });
});
