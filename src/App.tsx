import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import { StoreProvider } from './lib/store';
import { CoquilleLayout } from './components/Coquille';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Medicaments } from './pages/Medicaments';
import { Dispensation } from './pages/Dispensation';
import { Fiches } from './pages/Fiches';
import { FichePage } from './pages/FichePage';
import { FicheEditor } from './pages/FicheEditor';
import { Ressources } from './pages/Ressources';
import { Notes } from './pages/Notes';
import { ResourceForm } from './pages/ResourceForm';
import { ResourcePage } from './pages/ResourcePage';
import { ProductPage } from './pages/ProductPage';
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
      <div className="text-ink-3 flex min-h-dvh items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (status === 'signed-out') return <Login />;

  if (status === 'denied') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="text-ink text-lg font-semibold">Accès refusé</h1>
        <p className="text-ink-2 mt-2 text-sm">
          L'adresse <strong>{email}</strong> ne figure pas dans la liste des accès autorisés.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="border-line-strong hover:bg-surface-2 mt-6 rounded-control border px-4 py-2 text-sm"
        >
          Se déconnecter
        </button>
      </main>
    );
  }

  return (
    <StoreProvider>
      <Routes>
        <Route element={<CoquilleLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/medicaments" element={<Medicaments />} />
          <Route path="/dispensation" element={<Dispensation />} />
          <Route path="/fiches" element={<Fiches />} />
          <Route path="/f/:id" element={<FichePage />} />
          <Route path="/fiches/nouvelle" element={<FicheEditor />} />
          <Route path="/f/:id/editer" element={<FicheEditor />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/r/:id" element={<ResourcePage />} />
          <Route path="/p/:nr" element={<ProductPage />} />
          <Route
            path="/nouveau"
            element={
              <EditorsOnly>
                <ResourceForm />
              </EditorsOnly>
            }
          />
          <Route
            path="/r/:id/modifier"
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
        </Route>
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
