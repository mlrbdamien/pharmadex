import { createContext, useContext, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ListX,
  Lock,
  LogOut,
  Menu,
  Pill,
  Plus,
  Search,
  BookMarked,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCompteurs, type Compteurs } from '../lib/compteurs';
import { cn } from './ui';

/**
 * La coquille de l'application : rail latéral, en-tête d'écran.
 *
 * Transposée de vetements-p24 (direction « Console ») : groupes nommés,
 * compteurs qui font du rail un tableau de bord permanent, bloc d'état en
 * pied. Adaptations : navigation par routes (NavLink), accent teal, et le
 * bloc d'état montre l'inventaire de Pharmadex.
 */

type Entree = {
  to: string;
  libelle: string;
  icone: LucideIcon;
  editeur?: boolean;
  compteur?: (c: Compteurs) => number | null;
  alerte?: (c: Compteurs) => boolean;
  /** `end` de NavLink : actif seulement sur correspondance exacte. */
  exact?: boolean;
};

const GROUPES: { titre: string; entrees: Entree[] }[] = [
  {
    titre: 'Comptoir',
    entrees: [
      { to: '/', libelle: 'Recherche', icone: Search, exact: true },
      {
        to: '/medicaments',
        libelle: 'Médicaments',
        icone: Pill,
        compteur: (c) => c.produits,
      },
      {
        to: '/ressources',
        libelle: 'Ressources',
        icone: BookMarked,
        compteur: (c) => c.ressources || null,
        alerte: (c) => c.liensCasses > 0,
      },
    ],
  },
  {
    titre: 'Édition',
    entrees: [
      { to: '/nouveau', libelle: 'Ajouter', icone: Plus, editeur: true },
      {
        to: '/recherches-vides',
        libelle: 'Recherches vides',
        icone: ListX,
        editeur: true,
        compteur: (c) => c.recherchesVides,
        alerte: (c) => (c.recherchesVides ?? 0) > 0,
      },
    ],
  },
];

export function Rail({ ouvert = false, onFermer }: { ouvert?: boolean; onFermer?: () => void }) {
  const { email, canEdit, signOut } = useAuth();
  const compteurs = useCompteurs();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        'rail-navigation bg-rail border-line flex shrink-0 flex-col border-r',
        // En dessous de 768 px le rail sort du flux et se superpose.
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-[264px]',
        'max-md:transition-transform max-md:duration-200 motion-reduce:transition-none',
        ouvert ? 'max-md:translate-x-0 max-md:shadow-modal' : 'max-md:-translate-x-full',
        'md:w-[72px] xl:w-[248px]',
      )}
      aria-label="Navigation principale"
    >
      <div className="border-line border-b px-5 py-5 md:px-4 xl:px-5">
        <p className="text-accent text-[17px] leading-tight font-semibold tracking-[-0.015em] md:hidden xl:block">
          Pharmadex
        </p>
        <p aria-hidden className="text-accent hidden text-center text-[17px] font-semibold md:block xl:hidden">
          P
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-3">
        {GROUPES.map((groupe) => (
          <div key={groupe.titre} className="px-2.5">
            <p className="etiquette mb-1.5 px-2 md:hidden xl:block">{groupe.titre}</p>
            <div className="flex flex-col gap-0.5">
              {groupe.entrees.map((entree) => {
                const verrouille = entree.editeur && !canEdit;
                const n = entree.compteur ? entree.compteur(compteurs) : null;
                const alerte = entree.alerte ? entree.alerte(compteurs) : false;
                return (
                  <NavLink
                    key={entree.to}
                    to={verrouille ? '#' : entree.to}
                    end={entree.exact}
                    onClick={(event) => {
                      if (verrouille) event.preventDefault();
                      else onFermer?.();
                    }}
                    aria-disabled={verrouille || undefined}
                    className={({ isActive }) =>
                      cn(
                        'group rounded-control flex cursor-pointer items-center gap-2.5 px-2.5 py-2.5 text-left text-[15px] transition-colors',
                        'md:justify-center md:px-0 xl:justify-start xl:px-2.5',
                        isActive && !verrouille
                          ? 'bg-surface-1 text-ink shadow-rail font-semibold'
                          : verrouille
                            ? 'text-ink-3 cursor-not-allowed'
                            : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <entree.icone
                          size={17}
                          strokeWidth={isActive ? 2 : 1.75}
                          className={cn('shrink-0', isActive && !verrouille ? 'text-accent' : 'text-ink-3')}
                        />
                        <span className="flex-1 truncate md:hidden xl:block">{entree.libelle}</span>
                        {alerte && !verrouille && (
                          <span
                            className="bg-critical h-[6px] w-[6px] shrink-0 rounded-full"
                            aria-label="demande votre attention"
                          />
                        )}
                        {n !== null && !verrouille && (
                          <span
                            className="donnee text-ink-3 shrink-0 text-[13px] md:hidden xl:inline"
                            aria-label={`${n} éléments`}
                          >
                            {n}
                          </span>
                        )}
                        {verrouille && (
                          <Lock
                            size={11}
                            strokeWidth={2}
                            className="text-ink-3 shrink-0 opacity-60 md:hidden xl:block"
                            aria-label="réservé aux éditeurs"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <EtatGeneral compteurs={compteurs} />

      <div className="border-line border-t px-5 py-3 md:px-2 xl:px-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-ink-3 min-w-0 truncate text-[12.5px] md:hidden xl:block" title={email ?? ''}>
            {email}
          </span>
          <button
            type="button"
            onClick={() => void signOut().then(() => navigate('/'))}
            title="Se déconnecter"
            className="rounded-control text-ink-3 hover:bg-surface-2 hover:text-ink inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center transition-colors"
          >
            <LogOut size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </nav>
  );
}

/** Le pied du rail : l'inventaire, toujours visible. */
function EtatGeneral({ compteurs }: { compteurs: Compteurs }) {
  const lignes: { l: string; n: number | null; mal: boolean }[] = [
    { l: 'Ressources', n: compteurs.ressources, mal: false },
    { l: 'Liens cassés', n: compteurs.liensCasses, mal: compteurs.liensCasses > 0 },
    { l: 'Médicaments', n: compteurs.produits, mal: false },
  ];

  return (
    <div className="border-line border-t px-5 py-4 md:hidden xl:block">
      <p className="etiquette mb-2">État</p>
      <dl className="flex flex-col gap-1">
        {lignes.map(
          (ligne) =>
            ligne.n !== null && (
              <div key={ligne.l} className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-2 text-[14px]">{ligne.l}</dt>
                <dd className={cn('donnee text-[16px] font-semibold', ligne.mal && 'text-critical-text')}>
                  {ligne.n}
                </dd>
              </div>
            ),
        )}
      </dl>
      {compteurs.liensCasses > 0 && (
        <p className="text-critical-text mt-2 text-[12.5px] leading-snug">
          {compteurs.liensCasses} lien{compteurs.liensCasses > 1 ? 's' : ''} à revérifier
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */

export function EnteteEcran({
  titre,
  contexte,
  actions,
  onMenu,
}: {
  titre: string;
  contexte?: ReactNode;
  actions?: ReactNode;
  /** Ouvre le rail sur écran étroit, où il est masqué. */
  onMenu?: () => void;
}) {
  return (
    <header className="border-line bg-surface-1 flex h-[56px] shrink-0 items-center justify-between gap-6 border-b px-6">
      <div className="flex min-w-0 items-baseline gap-3">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="Ouvrir la navigation"
            className="rounded-control text-ink-2 hover:bg-surface-2 -ml-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center self-center transition-colors md:hidden"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
        )}
        <h1 className="shrink-0 text-[17px] font-semibold tracking-[-0.02em]">{titre}</h1>
        {contexte && <span className="text-ink-3 truncate text-[14px]">{contexte}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </header>
  );
}


/* ------------------------------------------------------------------------- */

const MenuContext = createContext<() => void>(() => {});

/** À appeler depuis un EnteteEcran pour ouvrir le rail sur écran étroit. */
export function useMenu(): () => void {
  return useContext(MenuContext);
}

/** Le gabarit commun : rail à gauche, écran courant à droite. */
export function CoquilleLayout() {
  const [railOuvert, setRailOuvert] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Rail ouvert={railOuvert} onFermer={() => setRailOuvert(false)} />
      {railOuvert && (
        <button
          type="button"
          aria-label="Fermer la navigation"
          onClick={() => setRailOuvert(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <MenuContext.Provider value={() => setRailOuvert(true)}>
          <Outlet />
        </MenuContext.Provider>
      </div>
    </div>
  );
}
