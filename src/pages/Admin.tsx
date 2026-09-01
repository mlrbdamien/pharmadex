import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  Database,
  History,
  Loader2,
  Plus,
  ScanBarcode,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { Card, CardHeader, cn } from '../components/ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { isStale, STALE_MONTHS } from '../lib/resources';
import { deleteMiss, listMisses } from '../lib/misses';
import { resolveCodes } from '../lib/products';
import type { SearchMiss } from '../lib/types';
import {
  ajouterAcces,
  lireEtatDonnees,
  lireJournal,
  listerAcces,
  majAcces,
  retirerAcces,
  type Acces,
  type EtatDonnees,
  type LigneJournal,
} from '../lib/admin';

const ONGLETS = [
  { id: 'acces', libelle: 'Accès et droits', icone: Users },
  { id: 'donnees', libelle: 'État des données', icone: Database },
  { id: 'qualite', libelle: 'Qualité', icone: AlertTriangle },
  { id: 'journal', libelle: 'Journal', icone: History },
] as const;

type Onglet = (typeof ONGLETS)[number]['id'];

/**
 * Le panneau d'administration.
 *
 * Rassemble ce qui obligeait à ouvrir le tableau de bord Supabase — donner
 * un accès — et ce qui n'existait nulle part : la fraîcheur des données, la
 * dette de vérification, et qui a modifié quoi.
 */
export function Admin() {
  const { isAdmin } = useAuth();
  const ouvrirMenu = useMenu();
  const [onglet, setOnglet] = useState<Onglet>('acces');

  if (!isAdmin) {
    return (
      <>
        <EnteteEcran titre="Administration" onMenu={ouvrirMenu} />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-ink-3 text-sm">
            Réservé aux administrateurs.{' '}
            <Link to="/" className="text-accent underline">
              Retour à la recherche
            </Link>
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <EnteteEcran titre="Administration" onMenu={ouvrirMenu} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-1.5">
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOnglet(o.id)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[13.5px] transition-colors',
                  o.id === onglet
                    ? 'border-accent bg-accent text-on-accent font-medium'
                    : 'border-line bg-surface-1 text-ink-2 hover:text-ink',
                )}
              >
                <o.icone size={13} strokeWidth={1.75} aria-hidden />
                {o.libelle}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {onglet === 'acces' && <PanneauAcces />}
            {onglet === 'donnees' && <PanneauDonnees />}
            {onglet === 'qualite' && <PanneauQualite />}
            {onglet === 'journal' && <PanneauJournal />}
          </div>
        </div>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function PanneauAcces() {
  const { email: moi } = useAuth();
  const [acces, setAcces] = useState<Acces[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState({ email: '', label: '', can_edit: false, is_admin: false });
  const [envoi, setEnvoi] = useState(false);

  const charger = useCallback(async () => {
    try {
      setAcces(await listerAcces());
      setErreur(null);
    } catch (cause) {
      setErreur(cause instanceof Error ? cause.message : 'Lecture impossible');
      setAcces([]);
    }
  }, []);

  useEffect(() => void charger(), [charger]);

  async function ajouter() {
    if (!nouveau.email.trim()) return;
    setEnvoi(true);
    try {
      await ajouterAcces({ ...nouveau, label: nouveau.label.trim() || null });
      setNouveau({ email: '', label: '', can_edit: false, is_admin: false });
      await charger();
    } catch (cause) {
      setErreur(cause instanceof Error ? cause.message : 'Ajout impossible');
    } finally {
      setEnvoi(false);
    }
  }

  async function basculer(ligne: Acces, champ: 'can_edit' | 'is_admin') {
    await majAcces(ligne.email, { [champ]: !ligne[champ] });
    await charger();
  }

  if (!acces) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-ink-3 size-5 animate-spin" />
      </div>
    );
  }

  const CHAMP =
    'border-line bg-surface-1 focus:border-accent rounded-control border px-2.5 py-1.5 text-[14px]';

  return (
    <div className="flex flex-col gap-4">
      {erreur && (
        <p className="bg-critical-soft text-critical-text rounded-control px-3 py-2 text-[13.5px]">
          {erreur}
        </p>
      )}

      <Card padded={false}>
        <div className="px-4 pt-4">
          <CardHeader icon={Users} title={`${acces.length} comptes autorisés`} />
        </div>
        <div className="border-line border-t">
          {acces.map((ligne) => {
            const soi = ligne.email === moi;
            return (
              <div
                key={ligne.email}
                className="border-line flex flex-wrap items-center gap-3 border-b px-4 py-2.5 last:border-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-ink block truncate text-[14px] font-medium">
                    {ligne.label || ligne.email}
                  </span>
                  {ligne.label && (
                    <span className="text-ink-3 block truncate text-[12.5px]">{ligne.email}</span>
                  )}
                </span>

                <Bascule
                  actif={ligne.can_edit}
                  libelle="Édition"
                  onClick={() => void basculer(ligne, 'can_edit')}
                />
                <Bascule
                  actif={ligne.is_admin}
                  libelle="Admin"
                  icone={ShieldCheck}
                  onClick={() => void basculer(ligne, 'is_admin')}
                  // Se retirer soi-même l'administration ferme la porte de
                  // l'intérieur : c'est la seule action qu'on ne peut pas
                  // défaire depuis cet écran.
                  desactive={soi}
                />
                <button
                  type="button"
                  disabled={soi}
                  onClick={() => {
                    if (confirm(`Retirer l’accès de ${ligne.email} ?`))
                      void retirerAcces(ligne.email).then(charger);
                  }}
                  aria-label={`Retirer ${ligne.email}`}
                  className="text-ink-3 hover:text-critical-text hover:bg-critical-soft cursor-pointer
                             rounded p-1 disabled:cursor-default disabled:opacity-30"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader icon={Plus} title="Ajouter un accès" />
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[220px] flex-1">
            <span className="etiquette">Adresse e-mail</span>
            <input
              value={nouveau.email}
              onChange={(e) => setNouveau({ ...nouveau, email: e.target.value })}
              type="email"
              placeholder="prenom@officine.ch"
              className={cn(CHAMP, 'mt-1 w-full')}
            />
          </label>
          <label className="min-w-[150px] flex-1">
            <span className="etiquette">Nom affiché</span>
            <input
              value={nouveau.label}
              onChange={(e) => setNouveau({ ...nouveau, label: e.target.value })}
              className={cn(CHAMP, 'mt-1 w-full')}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 pb-2 text-[13.5px]">
            <input
              type="checkbox"
              checked={nouveau.can_edit}
              onChange={(e) => setNouveau({ ...nouveau, can_edit: e.target.checked })}
              className="accent-accent"
            />
            Édition
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 pb-2 text-[13.5px]">
            <input
              type="checkbox"
              checked={nouveau.is_admin}
              onChange={(e) => setNouveau({ ...nouveau, is_admin: e.target.checked })}
              className="accent-accent"
            />
            Admin
          </label>
          <button
            type="button"
            onClick={() => void ajouter()}
            disabled={envoi || !nouveau.email.trim()}
            className="bg-accent text-on-accent hover:bg-accent-hover rounded-control mb-0.5
                       cursor-pointer px-3 py-1.5 text-[13.5px] font-medium disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
        <p className="text-ink-3 mt-3 text-[12.5px] leading-relaxed">
          L’adresse doit ensuite créer son mot de passe côté Supabase — Pharmadex
          n’envoie aucun e-mail. Autoriser ici ne crée pas le compte, cela lui ouvre
          la porte.
        </p>
      </Card>
    </div>
  );
}

function Bascule({
  actif,
  libelle,
  icone: Icone,
  onClick,
  desactive = false,
}: {
  actif: boolean;
  libelle: string;
  icone?: typeof ShieldCheck;
  onClick: () => void;
  desactive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      aria-pressed={actif}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[12.5px] transition-colors',
        actif
          ? 'border-accent bg-accent-soft text-accent font-medium'
          : 'border-line text-ink-3 hover:text-ink',
        desactive && 'cursor-default opacity-50',
      )}
    >
      {Icone && <Icone size={11} strokeWidth={2} aria-hidden />}
      {libelle}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function PanneauDonnees() {
  const [etat, setEtat] = useState<EtatDonnees | null>(null);

  useEffect(() => void lireEtatDonnees().then(setEtat), []);

  if (!etat) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-ink-3 size-5 animate-spin" />
      </div>
    );
  }

  const importLe = etat.importLe ? new Date(etat.importLe) : null;
  const jours = importLe
    ? Math.floor((Date.now() - importLe.getTime()) / 86_400_000)
    : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader icon={Database} title="Catalogue Swissmedic" />
        <dl className="flex flex-col gap-1.5">
          <Ligne terme="Médicaments" valeur={etat.produits} />
          <Ligne terme="Emballages" valeur={etat.emballages} />
          <Ligne terme="Notices indexées" valeur={etat.notices} />
          <Ligne
            terme="Noms français officiels"
            valeur={
              etat.nomsFr !== null && etat.produits
                ? `${etat.nomsFr} · ${Math.round((etat.nomsFr / etat.produits) * 100)} %`
                : etat.nomsFr
            }
          />
        </dl>
        {jours !== null && (
          <p className="text-ink-3 mt-3 text-[12.5px]">
            Dernier import il y a <b className="tabular">{jours}</b> jour{jours > 1 ? 's' : ''}.
            Swissmedic publie le premier jour ouvrable du mois ; l’import tourne le 3.
          </p>
        )}
      </Card>

      <Card>
        <CardHeader icon={BookOpen} title="Contenu maison" />
        <dl className="flex flex-col gap-1.5">
          <Ligne terme="Fiches de l’aide-mémoire" valeur={etat.fiches} />
        </dl>
        <p className="text-ink-3 mt-3 text-[12.5px] leading-relaxed">
          Le catalogue Swissmedic se reconstruit tout seul chaque mois. Le contenu
          maison — fiches, notes, ressources — ne se répare pas tout seul : voir
          l’onglet Qualité.
        </p>
      </Card>
    </div>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur: number | string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-2 text-[13.5px]">{terme}</dt>
      <dd className="tabular text-ink shrink-0 text-[15px] font-semibold">
        {valeur ?? '—'}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PanneauQualite() {
  const { resources, notes, fiches } = useStore();
  const [vides, setVides] = useState<SearchMiss[] | null>(null);
  const [noms, setNoms] = useState<Map<string, { name: string; nr: string }>>(new Map());
  const [masquerCodes, setMasquerCodes] = useState(true);

  useEffect(() => {
    void listMisses()
      .then(async (lignes) => {
        setVides(lignes);
        // Un code résolu transforme le journal en liste de liaisons à créer :
        // le produit existe, c'est la ressource qui manquait.
        setNoms(await resolveCodes(lignes.filter((m) => m.is_code).map((m) => m.term)));
      })
      .catch(() => setVides([]));
  }, []);

  const casses = resources.filter((r) => r.broken);
  const ressourcesVieilles = resources.filter((r) => !r.broken && isStale(r));
  const limite = new Date();
  limite.setMonth(limite.getMonth() - STALE_MONTHS);
  const notesVieilles = notes.filter((n) => new Date(n.verified_on) < limite);
  const fichesVieilles = fiches.filter((f) => new Date(f.verifie_le) < limite);
  const codes = (vides ?? []).filter((m) => m.is_code).length;
  const visibles = masquerCodes ? (vides ?? []).filter((m) => !m.is_code) : (vides ?? []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Compteur libelle="Liens cassés" n={casses.length} mauvais={casses.length > 0} />
        <Compteur libelle="Ressources à revérifier" n={ressourcesVieilles.length} />
        <Compteur libelle="Notes à revérifier" n={notesVieilles.length} />
        <Compteur libelle="Fiches à revérifier" n={fichesVieilles.length} />
      </div>

      {casses.length > 0 && (
        <Card padded={false}>
          <div className="px-4 pt-4">
            <CardHeader icon={AlertTriangle} title="Liens cassés" />
          </div>
          <div className="border-line border-t">
            {casses.map((r) => (
              <Link
                key={r.id}
                to={`/r/${r.id}`}
                className="border-line hover:bg-surface-2 block border-b px-4 py-2 last:border-0"
              >
                <span className="text-ink block truncate text-[14px]">{r.title}</span>
                <span className="text-ink-3 block truncate text-[12px]">{r.url}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {fichesVieilles.length > 0 && (
        <Card padded={false}>
          <div className="px-4 pt-4">
            <CardHeader icon={BookOpen} title="Fiches dont les sources datent" />
          </div>
          <div className="border-line border-t">
            {fichesVieilles.map((f) => (
              <Link
                key={f.id}
                to={`/f/${f.id}`}
                className="border-line hover:bg-surface-2 flex items-baseline gap-3 border-b px-4 py-2 last:border-0"
              >
                <span className="donnee text-accent w-8 shrink-0 text-[12px] font-semibold">
                  {f.code}
                </span>
                <span className="text-ink min-w-0 flex-1 truncate text-[14px]">{f.titre}</span>
                <span className="tabular text-ink-3 shrink-0 text-[12px]">{f.verifie_le}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card padded={false}>
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <CardHeader
            icon={AlertTriangle}
            title={`Recherches sans réponse${vides ? ` (${visibles.length})` : ''}`}
          />
          {codes > 0 && (
            <button
              type="button"
              onClick={() => setMasquerCodes((m) => !m)}
              className="text-ink-3 hover:text-ink mb-3 shrink-0 cursor-pointer text-[12.5px]"
            >
              {masquerCodes ? `Afficher les ${codes} codes` : 'Masquer les codes'}
            </button>
          )}
        </div>
        <div className="border-line border-t">
          {vides === null ? (
            <p className="text-ink-3 px-4 py-4 text-[13.5px]">Chargement…</p>
          ) : visibles.length === 0 ? (
            <p className="text-ink-3 px-4 py-4 text-[13.5px]">
              Rien à signaler — tout ce qu’on a cherché, on l’a trouvé.
            </p>
          ) : (
            visibles.slice(0, 40).map((m) => (
              <div
                key={m.term}
                className="border-line group flex items-baseline gap-3 border-b px-4 py-2 last:border-0"
              >
                <span className="text-ink min-w-0 flex-1 truncate text-[14px]">
                  {m.term}
                  {m.is_code && (
                    <ScanBarcode
                      className="text-ink-3 ml-1.5 inline size-3.5"
                      aria-label="code-barres"
                    />
                  )}
                  {noms.has(m.term) && (
                    <Link
                      to={`/p/${noms.get(m.term)!.nr}`}
                      className="text-accent ml-2 font-normal hover:underline"
                    >
                      {noms.get(m.term)!.name}
                    </Link>
                  )}
                </span>
                <span className="tabular text-ink-3 shrink-0 text-[12.5px]">{m.hits}×</span>
                <span className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <Link
                    to={`/nouveau?titre=${encodeURIComponent(m.term)}`}
                    title="Créer la ressource manquante"
                    className="text-ink-3 hover:bg-surface-2 hover:text-accent rounded p-1"
                  >
                    <Plus className="size-4" />
                  </Link>
                  <button
                    type="button"
                    title="Retirer du journal"
                    onClick={() => {
                      void deleteMiss(m.term);
                      setVides((v) => (v ?? []).filter((x) => x.term !== m.term));
                    }}
                    className="text-ink-3 hover:bg-surface-2 hover:text-critical-text cursor-pointer rounded p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Compteur({
  libelle,
  n,
  mauvais = false,
}: {
  libelle: string;
  n: number;
  mauvais?: boolean;
}) {
  return (
    <Card>
      <p
        className={cn(
          'tabular text-[26px] leading-none font-semibold',
          mauvais && n > 0 ? 'text-critical-text' : 'text-ink',
        )}
      >
        {n}
      </p>
      <p className="text-ink-2 mt-1 text-[13px]">{libelle}</p>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */

const ACTIONS: Record<string, string> = {
  creation: 'création',
  modification: 'modification',
  suppression: 'suppression',
};

function PanneauJournal() {
  const [lignes, setLignes] = useState<LigneJournal[] | null>(null);

  useEffect(() => void lireJournal(150).then(setLignes), []);

  if (!lignes) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-ink-3 size-5 animate-spin" />
      </div>
    );
  }

  return (
    <Card padded={false}>
      <div className="px-4 pt-4">
        <CardHeader icon={History} title="150 dernières écritures" />
      </div>
      {lignes.length === 0 ? (
        <p className="text-ink-3 border-line border-t px-4 py-4 text-[13.5px] leading-relaxed">
          Le journal est vide. Il ne consigne que ce qui a été écrit après la
          migration 0013 — l’histoire antérieure des fiches est dans le dépôt git de
          <span className="donnee"> comptoir-otc</span>.
        </p>
      ) : (
        <div className="border-line border-t">
          {lignes.map((l) => (
            <div
              key={l.id}
              className="border-line flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b px-4 py-2 last:border-0"
            >
              <span className="tabular text-ink-3 w-[112px] shrink-0 text-[12px]">
                {new Date(l.at).toLocaleString('fr-CH', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span
                className={cn(
                  'shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium',
                  l.action === 'suppression'
                    ? 'bg-critical-soft text-critical-text'
                    : l.action === 'creation'
                      ? 'bg-good-soft text-good-text'
                      : 'bg-surface-2 text-ink-2',
                )}
              >
                {ACTIONS[l.action] ?? l.action}
              </span>
              <span className="text-ink-3 shrink-0 text-[12.5px]">{l.cible}</span>
              <span className="text-ink min-w-0 flex-1 truncate text-[13.5px]">
                {l.resume || '—'}
              </span>
              <span className="text-ink-3 shrink-0 text-[12px]">{l.acteur ?? '—'}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
