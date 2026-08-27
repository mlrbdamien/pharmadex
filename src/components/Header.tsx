import { Link } from 'react-router-dom';
import { ListX, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function Header() {
  const { email, canEdit, signOut } = useAuth();

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-2">
      <Link to="/" className="text-sm font-semibold tracking-tight text-teal-800">
        Pharmadex
      </Link>

      <div className="flex-1" />

      {canEdit && (
        <>
          <Link
            to="/recherches-vides"
            title="Recherches sans résultat"
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            <ListX className="size-4" />
            <span className="hidden sm:inline">Recherches vides</span>
          </Link>
          <Link
            to="/nouveau"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-2.5 py-1.5 text-sm
                       font-medium text-white hover:bg-teal-800"
          >
            <Plus className="size-4" />
            Ajouter
          </Link>
        </>
      )}

      <span className="hidden text-xs text-slate-400 md:inline">{email}</span>
      <button
        type="button"
        onClick={() => void signOut()}
        title="Se déconnecter"
        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <LogOut className="size-4" />
      </button>
    </header>
  );
}
