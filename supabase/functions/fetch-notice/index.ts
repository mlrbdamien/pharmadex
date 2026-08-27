// Relais de notices AIPS.
//
// files.refdata.ch sert les notices HTML avec Content-Type:
// application/octet-stream — un navigateur refuse donc de les RENDRE dans une
// iframe (il voudrait les télécharger). Ce relais re-sert le même document
// avec le bon type. Il ne relaie RIEN d'autre : le chemin est validé par une
// expression stricte, et ces documents sont de toute façon publics.
//
// verify_jwt = false (config.toml) : une iframe ne peut pas envoyer de jeton.

const ALLOWED = /^[a-f0-9]{16,64}-(de|fr|it|en)\.html$/;
const BASE = 'https://files.refdata.ch/simis-public-prod/MedicinalDocuments/';

Deno.serve(async (request) => {
  const doc = new URL(request.url).searchParams.get('doc') ?? '';
  if (!ALLOWED.test(doc)) {
    return new Response('document non autorisé', { status: 400 });
  }

  const upstream = await fetch(BASE + doc, {
    headers: { 'User-Agent': 'Pharmadex/1.0 (+relais de notices)' },
  });
  if (!upstream.ok) {
    return new Response('notice indisponible', { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Une notice change rarement : un jour de cache évite de re-traverser
      // le relais à chaque consultation au comptoir.
      'Cache-Control': 'public, max-age=86400',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data: https://files.refdata.ch",
    },
  });
});
