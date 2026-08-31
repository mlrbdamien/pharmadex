import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronsDownUp,
  ChevronsUpDown,
  Loader2,
  Pencil,
  Pill,
  Plus,
  Trash2,
} from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { FicheView } from '../components/Fiche';
import { cn } from '../components/ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { lireFiche, LIBELLES_VOLET, type Fiche } from '../lib/fiches';
import {
  createNote,
  deleteNote,
  notesPourFiche,
  TYPES_NOTES,
  type NoteType,
  type ProductNote,
} from '../lib/notes';

type Depliage = 'fiche' | 'ouvert' | 'ferme';

/**
 * Une fiche de l'aide-mémoire, avec ses amendements en tête.
 *
 * Deux façons de la corriger, qui ne répondent pas à la même question :
 * l'édition réécrit le texte de référence (éditeurs, écran dédié) ;
 * l'amendement y ajoute une remarque datée et signée sans y toucher. Au
 * comptoir, c'est presque toujours le second qu'on veut.
 */
export function FichePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ouvrirMenu = useMenu();
  const { canEdit } = useAuth();
  const { refresh } = useStore();

  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [chargement, setChargement] = useState(true);
  const [amendements, setAmendements] = useState<ProductNote[]>([]);
  const [depliage, setDepliage] = useState<Depliage>('fiche');
  // Forcer le dépliage remonte les sections avec un nouveau défaut, plutôt
  // que de piloter chacune depuis le parent.
  const [cle, setCle] = useState(0);

  const chargerAmendements = useCallback(async () => {
    if (id) setAmendements(await notesPourFiche(id));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let vivant = true;
    setChargement(true);
    setFiche(null);
    setDepliage('fiche');
    void lireFiche(id).then((f) => {
      if (!vivant) return;
      setFiche(f);
      setChargement(false);
    });
    void chargerAmendements();
    return () => {
      vivant = false;
    };
  }, [id, chargerAmendements]);

  function deplier(mode: Depliage) {
    setDepliage(mode);
    setCle((n) => n + 1);
  }

  if (chargement) {
    return (
      <>
        <EnteteEcran titre="Aide-mémoire" onMenu={ouvrirMenu} />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="text-ink-3 size-5 animate-spin" />
        </main>
      </>
    );
  }

  if (!fiche) {
    return (
      <>
        <EnteteEcran titre="Aide-mémoire" onMenu={ouvrirMenu} />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-ink-3 text-sm">
            Fiche inconnue.{' '}
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
        titre="Aide-mémoire"
        contexte={LIBELLES_VOLET[fiche.volet]}
        onMenu={ouvrirMenu}
        actions={
          <div className="flex items-center gap-2">
            {canEdit && (
              <Link
                to={`/f/${fiche.id}/editer`}
                className="border-line text-ink-2 hover:text-ink hover:bg-surface-2 rounded-control
                           inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[13px]"
              >
                <Pencil size={13} strokeWidth={1.75} aria-hidden />
                Modifier
              </Link>
            )}
            <button
              type="button"
              onClick={() => deplier(depliage === 'ouvert' ? 'ferme' : 'ouvert')}
              className="border-line text-ink-2 hover:text-ink hover:bg-surface-2 rounded-control
                         inline-flex cursor-pointer items-center gap-1.5 border px-2.5 py-1.5 text-[13px]"
            >
              {depliage === 'ouvert' ? (
                <ChevronsDownUp size={13} strokeWidth={1.75} aria-hidden />
              ) : (
                <ChevronsUpDown size={13} strokeWidth={1.75} aria-hidden />
              )}
              {depliage === 'ouvert' ? 'Tout replier' : 'Tout déplier'}
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Retour"
              className="rounded-control text-ink-3 hover:bg-surface-2 hover:text-ink -ml-1 inline-flex
                         h-8 w-8 shrink-0 cursor-pointer items-center justify-center transition-colors"
            >
              <ArrowLeft size={17} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="donnee text-accent text-[13px] font-semibold">{fiche.code}</p>
              <h1 className="text-ink mt-0.5 text-[22px] leading-tight font-semibold tracking-[-0.02em]">
                {fiche.titre}
              </h1>
              <p className="text-ink-2 mt-1 text-[14px] leading-relaxed">{fiche.sous}</p>
              <p className="text-ink-3 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
                <span className="tabular">
                  Sources vérifiées le {enSuisse(fiche.verifie_le)}
                </span>
                {fiche.updated_by && <span>· dernière retouche {fiche.updated_by}</span>}
              </p>
              {fiche.atc.length > 0 && (
                <p className="text-ink-3 mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px]">
                  <Pill size={12} strokeWidth={1.75} aria-hidden />
                  Remonte au scan des classes
                  {fiche.atc.map((prefixe) => (
                    <Link
                      key={prefixe}
                      to={`/medicaments?atc=${prefixe}`}
                      className="donnee border-line hover:border-accent hover:text-accent rounded border px-1.5"
                    >
                      {prefixe}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </div>

          <Amendements
            ficheId={fiche.id}
            notes={amendements}
            canEdit={canEdit}
            onChange={async () => {
              await chargerAmendements();
              await refresh();
            }}
          />

          <div className="mt-5">
            <FicheView key={cle} entree={fiche} sections={fiche.sections} defaut={depliage} />
          </div>
        </div>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function enSuisse(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

/**
 * Les amendements : ce qu'on ajoute à une fiche sans la réécrire. Datés,
 * signés, et visibles avant le contenu — un errata se lit d'abord.
 */
function Amendements({
  ficheId,
  notes,
  canEdit,
  onChange,
}: {
  ficheId: string;
  notes: ProductNote[];
  canEdit: boolean;
  onChange: () => Promise<void>;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<NoteType>('conseil');
  const [corps, setCorps] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function ajouter() {
    if (!corps.trim()) return;
    setEnvoi(true);
    try {
      await createNote({ fiche_id: ficheId, note_type: type, body: corps.trim() });
      setCorps('');
      setOuvert(false);
      await onChange();
    } finally {
      setEnvoi(false);
    }
  }

  async function retirer(note: ProductNote) {
    if (!confirm('Supprimer cet amendement ?')) return;
    await deleteNote(note.id);
    await onChange();
  }

  return (
    <div className="mt-5">
      {notes.length > 0 && (
        <div className="flex flex-col gap-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn('rounded-control px-3 py-2.5', TYPES_NOTES[note.note_type].classes)}
            >
              <div className="flex items-baseline gap-2">
                <span className="etiquette shrink-0 text-current">
                  {TYPES_NOTES[note.note_type].label}
                </span>
                <span className="tabular ml-auto shrink-0 text-[12px] opacity-80">
                  {note.created_by} · {enSuisse(note.verified_on)}
                </span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => void retirer(note)}
                    aria-label="Supprimer l’amendement"
                    className="shrink-0 cursor-pointer rounded p-0.5 opacity-60 hover:opacity-100"
                  >
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                )}
              </div>
              <p className="mt-1 text-[14px] leading-relaxed whitespace-pre-wrap">{note.body}</p>
            </div>
          ))}
        </div>
      )}

      {canEdit &&
        (ouvert ? (
          <div className="border-line bg-surface-1 rounded-card mt-2 border p-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={type}
                onChange={(event) => setType(event.target.value as NoteType)}
                className="border-line bg-surface-1 rounded-control border px-2 py-1 text-[13px]"
              >
                {(Object.keys(TYPES_NOTES) as NoteType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPES_NOTES[t].label}
                  </option>
                ))}
              </select>
              <span className="text-ink-3 text-[12.5px]">
                L’amendement s’ajoute à la fiche, il ne la modifie pas.
              </span>
            </div>
            <textarea
              value={corps}
              onChange={(event) => setCorps(event.target.value)}
              rows={3}
              autoFocus
              placeholder="Ce qu’il faut savoir en plus — et depuis quelle source."
              className="border-line bg-surface-1 focus:border-accent rounded-control mt-2 w-full
                         border px-2.5 py-1.5 text-[14px] leading-relaxed"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => void ajouter()}
                disabled={envoi || !corps.trim()}
                className="bg-accent text-on-accent hover:bg-accent-hover rounded-control cursor-pointer
                           px-3 py-1.5 text-[13px] font-medium disabled:opacity-50"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setOuvert(false)}
                className="text-ink-3 hover:text-ink cursor-pointer text-[13px]"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOuvert(true)}
            className="border-line text-ink-3 hover:text-accent hover:border-accent rounded-control
                       mt-2 inline-flex cursor-pointer items-center gap-1.5 border border-dashed px-2.5 py-1.5 text-[13px]"
          >
            <Plus size={13} strokeWidth={2} aria-hidden />
            Amender cette fiche
          </button>
        ))}
    </div>
  );
}
