import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * `denied` = authentifié auprès de Supabase mais absent de l'allowlist.
 * En pratique rare : `signInWithOtp({ shouldCreateUser: false })` refuse déjà
 * les inconnus. Ce cas couvre le retrait d'un email après coup.
 */
export type AuthStatus = 'loading' | 'signed-out' | 'denied' | 'ready';

type AuthValue = {
  status: AuthStatus;
  email: string | null;
  canEdit: boolean;
  /** Droit d'administrer les accès — distinct du droit d'éditer. */
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolve(session: Session | null) {
      const address = session?.user.email?.toLowerCase() ?? null;
      if (!address) {
        if (!cancelled) {
          setEmail(null);
          setCanEdit(false);
          setIsAdmin(false);
          setStatus('signed-out');
        }
        return;
      }

      // La policy `allowed_emails_select_self` ne renvoie que sa propre ligne :
      // zéro ligne = email hors allowlist.
      const { data } = await supabase
        .from('allowed_emails')
        .select('can_edit,is_admin')
        .eq('email', address)
        .maybeSingle();

      if (cancelled) return;
      setEmail(address);
      setCanEdit(Boolean(data?.can_edit));
      // Administrer et éditer sont deux droits distincts : rédiger une fiche
      // et donner un accès ne sont pas le même acte.
      setIsAdmin(Boolean(data?.is_admin));
      setStatus(data ? 'ready' : 'denied');
    }

    void supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Appeler le client Supabase directement dans ce callback peut bloquer
      // (le client attend la fin du callback avant de libérer son verrou
      // interne) : on repousse d'un tick.
      setTimeout(() => void resolve(session), 0);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ status, email, canEdit, isAdmin, signOut }),
    [status, email, canEdit, isAdmin, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return value;
}
