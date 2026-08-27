import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Les messages de Supabase sont en anglais et techniques. Au comptoir, un
 * message incompréhensible fait abandonner : on traduit les cas connus et on
 * dit quoi faire, pas seulement ce qui a échoué.
 */
function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (/invalid login credentials|invalid credentials/.test(m)) {
    return 'Adresse ou mot de passe incorrect.';
  }
  if (/email not confirmed/.test(m)) {
    return "Ce compte n'est pas encore activé. Demandez son activation au responsable de l'outil.";
  }
  if (/rate limit|too many/.test(m)) {
    return 'Trop de tentatives. Patientez une minute avant de réessayer.';
  }
  if (/network|fetch|failed to/.test(m)) {
    return 'Connexion impossible. Vérifiez le réseau du poste.';
  }
  return `Échec de la connexion : ${message}`;
}

const FIELD =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:ring-0';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    // Mot de passe et non lien magique : au comptoir, aller chercher un e-mail
    // au milieu d'un conseil est rédhibitoire. Les comptes sont créés à la main
    // depuis le dashboard Supabase — l'application n'en crée jamais, et aucun
    // e-mail n'intervient à aucun moment.
    const { error: cause } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (cause) {
      setBusy(false);
      setPassword('');
      setError(traduireErreur(cause.message));
    }
    // En cas de succès, onAuthStateChange bascule l'application : rien à faire.
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Pharmadex</h1>
      <p className="mt-1 text-sm text-slate-500">Références du comptoir</p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={FIELD}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={FIELD}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4
                     py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-xs text-slate-400">
        Mot de passe oublié ? Il se redéfinit depuis le tableau de bord Supabase — aucun
        e-mail n'est envoyé par Pharmadex.
      </p>
    </main>
  );
}
