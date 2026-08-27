import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import { StoreProvider } from './lib/store';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ResourceForm } from './pages/ResourceForm';
import { Misses } from './pages/Misses';

/** Les routes d'édition n'existent pas pour le compte comptoir (lecture seule). */
function EditorsOnly({ children }: { children: React.ReactElement }) {
  const { canEdit } = useAuth();
  return canEdit ? children : <Navigate to="/" replace />;
}

function Gate() {
  const { status, email, signOut } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center text-slate-400">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (status === 'signed-out') return <Login />;

  if (status === 'denied') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Accès refusé</h1>
        <p className="mt-2 text-sm text-slate-600">
          L'adresse <strong>{email}</strong> ne figure pas dans la liste des accès autorisés.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Se déconnecter
        </button>
      </main>
    );
  }

  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/nouveau"
          element={
            <EditorsOnly>
              <ResourceForm />
            </EditorsOnly>
          }
        />
        <Route
          path="/r/:id"
          element={
            <EditorsOnly>
              <ResourceForm />
            </EditorsOnly>
          }
        />
        <Route
          path="/recherches-vides"
          element={
            <EditorsOnly>
              <Misses />
            </EditorsOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  );
}
