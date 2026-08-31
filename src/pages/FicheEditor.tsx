import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { Card, cn } from '../components/ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import {
  creerFiche,
  enregistrerFiche,
  idDepuisCode,
  lireFiche,
  LIBELLES_VOLET,
  supprimerFiche,
  type Section,
  type Triage,
  type Volet,
} from '../lib/fiches';
import {
  depuisLignes,
  enLignes,
  tableauEnTexte,
  texteEnTableau,
} from '../lib/fiches-texte';

const CHAMP =
  'border-line bg-surface-1 focus:border-accent rounded-control border px-2.5 py-1.5 text-[14px] w-full';
const ZONE = cn(CHAMP, 'font-[inherit] leading-relaxed');

/* -------------------------------------------------------------------------- */

/**
 * L'éditeur de fiche. Le modèle rend les blocs dans un ordre fixe — texte,
 * listes, tableau, checklist, triage, interdits, avertissements — donc
 * l'éditeur est un formulaire à huit champs facultatifs, pas un agenceur de
 * blocs : l'ordre n'a jamais été une décision de rédaction.
 */
export function FicheEditor() {
  const { id } = useParams<{ id: string }>();
  const nouvelle = id === undefined;
  const navigate = useNavigate();
  const ouvrirMenu = useMenu();
  const { canEdit } = useAuth();
  const { refresh } = useStore();

  const [chargement, setChargement] = useState(!nouvelle);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);

  const [code, setCode] = useState('');
  const [titre, setTitre] = useState('');
  const [sous, setSous] = useState('');
  const [groupe, setGroupe] = useState('');
  const [volet, setVolet] = useState<Volet>('otc');
  const [remise, setRemise] = useState('');
  const [atc, setAtc] = useState('');
  const [verifieLe, setVerifieLe] = useState(new Date().toISOString().slice(0, 10));
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!id) return;
    void lireFiche(id).then((f) => {
      if (f) {
        setCode(f.code);
        setTitre(f.titre);
        setSous(f.sous);
        setGroupe(f.groupe);
        setVolet(f.volet);
        setRemise(f.remise ?? '');
        setAtc((f.atc ?? []).join(', '));
        setVerifieLe(f.verifie_le);
        setSections(f.sections ?? []);
      }
      setChargement(false);
    });
  }, [id]);

  const majSection = useCallback((index: number, patch: Partial<Section>) => {
    setSections((actuelles) =>
      actuelles.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }, []);

  function deplacer(index: number, delta: number) {
    setSections((actuelles) => {
      const cible = index + delta;
      if (cible < 0 || cible >= actuelles.length) return actuelles;
      const copie = [...actuelles];
      [copie[index], copie[cible]] = [copie[cible], copie[index]];
      return copie;
    });
  }

  async function enregistrer() {
    setEnregistrement(true);
    setErreur(null);
    const champs = {
      code: code.trim(),
      titre: titre.trim(),
      sous: sous.trim(),
      groupe: groupe.trim(),
      volet,
      remise: remise.trim() || null,
      atc: atc.split(',').map((a) => a.trim().toUpperCase()).filter(Boolean),
      verifie_le: verifieLe,
      sections,
    };
    try {
      if (nouvelle) {
        const identifiant = idDepuisCode(champs.code);
        await creerFiche({ ...champs, id: identifiant });
        await refresh();
        navigate(`/f/${identifiant}`, { replace: true });
      } else {
        await enregistrerFiche(id!, champs);
        await refresh();
        navigate(`/f/${id}`);
      }
    } catch (cause) {
      setErreur(cause instanceof Error ? cause.message : 'Enregistrement impossible');
      setEnregistrement(false);
    }
  }

  async function supprimer() {
    if (!id) return;
    if (!confirm(`Supprimer définitivement la fiche « ${titre} » et ses amendements ?`)) return;
    await supprimerFiche(id);
    await refresh();
    navigate('/fiches', { replace: true });
  }

  if (!canEdit) {
    return (
      <>
        <EnteteEcran titre="Édition" onMenu={ouvrirMenu} />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-ink-3 text-sm">
            Réservé aux éditeurs.{' '}
            <Link to="/fiches" className="text-accent underline">
              Retour à l’aide-mémoire
            </Link>
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <EnteteEcran
        titre={nouvelle ? 'Nouvelle fiche' : 'Modifier la fiche'}
        contexte={LIBELLES_VOLET[volet]}
        onMenu={ouvrirMenu}
        actions={
          <div className="flex items-center gap-2">
            {!nouvelle && (
              <button
                type="button"
                onClick={() => void supprimer()}
                className="border-line text-ink-3 hover:text-critical-text hover:border-critical
                           rounded-control inline-flex cursor-pointer items-center gap-1.5 border px-2.5 py-1.5 text-[13px]"
              >
                <Trash2 size={13} strokeWidth={1.75} aria-hidden />
                Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={() => void enregistrer()}
              disabled={enregistrement || !code.trim() || !titre.trim()}
              className="bg-accent text-on-accent hover:bg-accent-hover rounded-control inline-flex
                         cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium disabled:opacity-50"
            >
              {enregistrement ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} strokeWidth={2} aria-hidden />
              )}
              Enregistrer
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-ink-3 hover:text-ink -ml-1 mb-3 inline-flex cursor-pointer items-center gap-1.5 text-[13px]"
          >
            <ArrowLeft size={14} /> Retour
          </button>

          {chargement ? (
            <div className="flex justify-center py-10">
              <Loader2 className="text-ink-3 size-5 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {erreur && (
                <p className="bg-critical-soft text-critical-text rounded-control px-3 py-2 text-[13.5px]">
                  {erreur}
                </p>
              )}

              <Card>
                <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
                  <Etiquette texte="Code">
                    <input value={code} onChange={(e) => setCode(e.target.value)} className={CHAMP} />
                  </Etiquette>
                  <Etiquette texte="Volet">
                    <select
                      value={volet}
                      onChange={(e) => setVolet(e.target.value as Volet)}
                      className={CHAMP}
                    >
                      {(Object.keys(LIBELLES_VOLET) as Volet[]).map((v) => (
                        <option key={v} value={v}>
                          {LIBELLES_VOLET[v]}
                        </option>
                      ))}
                    </select>
                  </Etiquette>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  <Etiquette texte="Titre">
                    <input value={titre} onChange={(e) => setTitre(e.target.value)} className={CHAMP} />
                  </Etiquette>
                  <Etiquette texte="Sous-titre">
                    <textarea
                      value={sous}
                      onChange={(e) => setSous(e.target.value)}
                      rows={2}
                      className={ZONE}
                    />
                  </Etiquette>
                  <Etiquette texte="Groupe">
                    <input value={groupe} onChange={(e) => setGroupe(e.target.value)} className={CHAMP} />
                  </Etiquette>
                  <Etiquette
                    texte="Préfixes ATC"
                    aide="Séparés par des virgules. Un produit dont le code commence par l’un d’eux fera remonter la fiche."
                  >
                    <input
                      value={atc}
                      onChange={(e) => setAtc(e.target.value)}
                      placeholder="N05BA, N05CD"
                      className={cn(CHAMP, 'donnee')}
                    />
                  </Etiquette>
                  <Etiquette
                    texte="Bandeau de remise"
                    aide="Affiché en tête de fiche quand elle cite un produit de liste B. Vide sinon."
                  >
                    <input value={remise} onChange={(e) => setRemise(e.target.value)} className={CHAMP} />
                  </Etiquette>
                  <Etiquette
                    texte="Vérifié le"
                    aide="Date de dernière vérification des sources — pas celle de la dernière retouche."
                  >
                    <input
                      type="date"
                      value={verifieLe}
                      onChange={(e) => setVerifieLe(e.target.value)}
                      className={cn(CHAMP, 'tabular')}
                    />
                  </Etiquette>
                </div>
              </Card>

              {sections.map((section, i) => (
                <EditeurSection
                  key={i}
                  index={i}
                  total={sections.length}
                  section={section}
                  onChange={(patch) => majSection(i, patch)}
                  onDeplacer={(d) => deplacer(i, d)}
                  onSupprimer={() =>
                    setSections((a) => a.filter((_, j) => j !== i))
                  }
                />
              ))}

              <button
                type="button"
                onClick={() => setSections((a) => [...a, { t: 'Nouvelle section', open: false }])}
                className="border-line text-ink-2 hover:text-accent hover:border-accent rounded-card
                           flex cursor-pointer items-center justify-center gap-2 border border-dashed py-3 text-[14px]"
              >
                <Plus size={15} strokeWidth={2} aria-hidden />
                Ajouter une section
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Etiquette({
  texte,
  aide,
  children,
}: {
  texte: string;
  aide?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="etiquette">{texte}</span>
      <div className="mt-1">{children}</div>
      {aide && <span className="text-ink-3 mt-1 block text-[12px]">{aide}</span>}
    </label>
  );
}

function EditeurSection({
  index,
  total,
  section,
  onChange,
  onDeplacer,
  onSupprimer,
}: {
  index: number;
  total: number;
  section: Section;
  onChange: (patch: Partial<Section>) => void;
  onDeplacer: (delta: number) => void;
  onSupprimer: () => void;
}) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <Card padded={false}>
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        >
          <ChevronDown
            size={15}
            className={cn('text-ink-3 shrink-0 transition-transform', !ouvert && '-rotate-90')}
            aria-hidden
          />
          <span className="text-ink truncate text-[14.5px] font-medium">{section.t}</span>
        </button>
        <span className="donnee text-ink-3 shrink-0 text-[11px]">{index + 1}/{total}</span>
        <button
          type="button"
          onClick={() => onDeplacer(-1)}
          disabled={index === 0}
          aria-label="Monter"
          className="text-ink-3 hover:text-ink hover:bg-surface-2 cursor-pointer rounded px-1.5 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onDeplacer(1)}
          disabled={index === total - 1}
          aria-label="Descendre"
          className="text-ink-3 hover:text-ink hover:bg-surface-2 cursor-pointer rounded px-1.5 disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onSupprimer}
          aria-label="Supprimer la section"
          className="text-ink-3 hover:text-critical-text hover:bg-critical-soft cursor-pointer rounded p-1"
        >
          <Trash2 size={14} strokeWidth={1.75} />
        </button>
      </div>

      {ouvert && (
        <div className="border-line flex flex-col gap-3 border-t px-4 py-4">
          <Etiquette texte="Titre de section">
            <input value={section.t} onChange={(e) => onChange({ t: e.target.value })} className={CHAMP} />
          </Etiquette>
          <label className="flex cursor-pointer items-center gap-2 text-[13.5px]">
            <input
              type="checkbox"
              checked={section.open === true}
              onChange={(e) => onChange({ open: e.target.checked || undefined })}
              className="accent-accent"
            />
            Dépliée à l’ouverture de la fiche
          </label>

          <Liste texte="Paragraphes" aide="Un paragraphe par ligne." valeur={section.p} sur={(v) => onChange({ p: v })} />
          <Liste texte="Liste à puces" valeur={section.ul} sur={(v) => onChange({ ul: v })} />
          <Liste texte="Liste numérotée" valeur={section.ol} sur={(v) => onChange({ ol: v })} />

          <Etiquette texte="Tableau" aide="Première ligne : les en-têtes. Cellules séparées par « | ».">
            <textarea
              value={tableauEnTexte(section.table)}
              onChange={(e) => onChange({ table: texteEnTableau(e.target.value) })}
              rows={4}
              className={cn(ZONE, 'donnee text-[13px]')}
            />
          </Etiquette>

          <Liste texte="Checklist" aide="Cases à cocher au comptoir. Un point par ligne." valeur={section.check} sur={(v) => onChange({ check: v })} />
          <EditeurTriage triage={section.triage} sur={(v) => onChange({ triage: v })} />
          <EditeurStop stop={section.stop} sur={(v) => onChange({ stop: v })} />
          <Liste texte="Avertissements" aide="Filet ambre. Un avertissement par ligne." valeur={section.warn} sur={(v) => onChange({ warn: v })} />
        </div>
      )}
    </Card>
  );
}

function Liste({
  texte,
  aide,
  valeur,
  sur,
}: {
  texte: string;
  aide?: string;
  valeur?: string[];
  sur: (v: string[] | undefined) => void;
}) {
  return (
    <Etiquette texte={texte} aide={aide}>
      <textarea
        value={enLignes(valeur)}
        onChange={(e) => sur(depuisLignes(e.target.value))}
        rows={Math.min(10, Math.max(2, (valeur?.length ?? 0) + 1))}
        className={ZONE}
      />
    </Etiquette>
  );
}

function EditeurTriage({
  triage,
  sur,
}: {
  triage?: Triage[];
  sur: (v: Triage[] | undefined) => void;
}) {
  const entrees = triage ?? [];
  const maj = (i: number, patch: Partial<Triage>) =>
    sur(entrees.map((t, j) => (j === i ? { ...t, ...patch } : t)));

  return (
    <div>
      <span className="etiquette">Orientation N1–N4</span>
      <div className="mt-1 flex flex-col gap-2">
        {entrees.map((t, i) => (
          <div key={i} className="border-line rounded-control flex flex-col gap-2 border p-2.5">
            <div className="flex items-center gap-2">
              <select
                value={t.n}
                onChange={(e) => maj(i, { n: Number(e.target.value) as Triage['n'] })}
                className={cn(CHAMP, 'w-20')}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    N{n}
                  </option>
                ))}
              </select>
              <input
                value={t.quand}
                onChange={(e) => maj(i, { quand: e.target.value })}
                placeholder="Quand — « Aujourd’hui »"
                className={CHAMP}
              />
              <button
                type="button"
                onClick={() => sur(entrees.filter((_, j) => j !== i) as Triage[])}
                aria-label="Retirer ce niveau"
                className="text-ink-3 hover:text-critical-text cursor-pointer rounded p-1"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
            <input
              value={t.ou}
              onChange={(e) => maj(i, { ou: e.target.value })}
              placeholder="Où — destination et numéro"
              className={CHAMP}
            />
            <textarea
              value={enLignes(t.items)}
              onChange={(e) => maj(i, { items: depuisLignes(e.target.value) ?? [] })}
              rows={2}
              placeholder="Critères, un par ligne"
              className={ZONE}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => sur([...entrees, { n: 2, quand: '', ou: '', items: [] }])}
          className="border-line text-ink-3 hover:text-accent hover:border-accent rounded-control
                     cursor-pointer border border-dashed py-1.5 text-[13px]"
        >
          Ajouter un niveau
        </button>
      </div>
    </div>
  );
}

function EditeurStop({
  stop,
  sur,
}: {
  stop?: { t?: string | null; p?: string[]; ul?: string[] };
  sur: (v: { t?: string | null; p?: string[]; ul?: string[] } | undefined) => void;
}) {
  const vide = !stop;
  const maj = (patch: Partial<NonNullable<typeof stop>>) => {
    const suivant = { ...(stop ?? {}), ...patch };
    const rien = !suivant.t && !suivant.p?.length && !suivant.ul?.length;
    sur(rien ? undefined : suivant);
  };

  return (
    <div>
      <span className="etiquette">Ne pas délivrer</span>
      {vide ? (
        <button
          type="button"
          onClick={() => sur({ t: 'Ne pas délivrer', ul: [] })}
          className="border-line text-ink-3 hover:text-critical-text hover:border-critical rounded-control
                     mt-1 w-full cursor-pointer border border-dashed py-1.5 text-[13px]"
        >
          Ajouter un bloc d’interdits
        </button>
      ) : (
        <div className="border-critical rounded-control mt-1 flex flex-col gap-2 border-l-[3px] p-2.5">
          <input
            value={stop.t ?? ''}
            onChange={(e) => maj({ t: e.target.value })}
            placeholder="Titre du bloc"
            className={CHAMP}
          />
          <textarea
            value={enLignes(stop.p)}
            onChange={(e) => maj({ p: depuisLignes(e.target.value) })}
            rows={2}
            placeholder="Paragraphes, un par ligne"
            className={ZONE}
          />
          <textarea
            value={enLignes(stop.ul)}
            onChange={(e) => maj({ ul: depuisLignes(e.target.value) })}
            rows={3}
            placeholder="Interdits, un par ligne"
            className={ZONE}
          />
          <button
            type="button"
            onClick={() => sur(undefined)}
            className="text-ink-3 hover:text-critical-text cursor-pointer self-start text-[12.5px]"
          >
            Retirer le bloc
          </button>
        </div>
      )}
    </div>
  );
}
