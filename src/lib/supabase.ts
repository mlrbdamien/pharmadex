import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Contrairement à d'autres projets locaux-first, Pharmadex n'a rien à afficher
// sans Supabase : mieux vaut échouer bruyamment au démarrage qu'afficher une
// page vide inexplicable au comptoir.
if (!url || !key) {
  throw new Error(
    'Pharmadex : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis. ' +
      'Copiez .env.example vers .env et renseignez-les.',
  );
}

export const supabase = createClient<Database>(url, key, {
  auth: {
    // Postes partagés au comptoir : la session doit survivre aux redémarrages.
    persistSession: true,
    autoRefreshToken: true,
    // Aucun jeton ne transite jamais par une URL : l'authentification se fait
    // par mot de passe, sans lien envoyé par e-mail.
    detectSessionInUrl: false,
  },
});
