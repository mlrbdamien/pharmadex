import { useState } from 'react';
import { Loader2, MailCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Les messages de Supabase sont en anglais et techniques. Au comptoir, un
 * message incompréhensible fait abandonner : on traduit les cas connus et on
 * dit quoi faire, pas seulement ce qui a échoué.
 */
function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (/rate limit|too many/.test(m)) {
    return "Trop de liens demandés ces dernières minutes. Patientez avant de réessayer, ou demandez à un collègue déjà connecté d'ouvrir Pharmadex sur ce poste.";
  }
  if (/signup|not found|not allowed|disabled/.test(m)) {
    return "Cette adresse n'a pas accès à Pharmadex.";
  }
  if (/invalid|malformed/.test(m)) {
    return 'Adresse e-mail invalide.';
  }
  if (/network|fetch|failed to/.test(m)) {
    return 'Connexion impossible. Vérifiez le réseau du poste.';
  }
  return `Échec de l'envoi : ${message}`;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState('sending');
    setError(null);

    const { error: cause } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // L'application ne crée JAMAIS de compte : une adresse inconnue est
        // refusée ici même, et aucun compte fantôme ne s'accumule.
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });

    if (cause) {
      setState('idle');
      setError(traduireErreur(cause.message));
      return;
    }
    setState('sent');
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Pharmadex</h1>
      <p className="mt-1 text-sm text-slate-500">Références du comptoir</p>

      {state === 'sent' ? (
        <div className="mt-8 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
          <MailCheck className="mb-2 size-5" />
          Lien de connexion envoyé à <strong>{email}</strong>.
          <p className="mt-2 text-teal-700">
            Ouvrez-le depuis ce poste pour y rester connecté.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-3">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:ring-0"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4
                       py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {state === 'sending' && <Loader2 className="size-4 animate-spin" />}
            Recevoir le lien de connexion
          </button>
        </form>
      )}
    </main>
  );
}
