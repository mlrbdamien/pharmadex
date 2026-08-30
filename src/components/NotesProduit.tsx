import { useCallback, useEffect, useState } from 'react';
import {
  CalendarCheck,
  Check,
  Copy,
  Pencil,
  Plus,
  Ruler,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from './ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { isStaleDate } from '../lib/resources';
import { formatDate, todayISO } from '../lib/format';
import {
  copier,
  createNote,
  deleteNote,
  notesPour,
  TYPES_NOTES,
  updateNote,
  type NoteType,
  type ProductNote,
} from '../lib/notes';

/**
 * Les notes maison d'un médicament : bandeaux sous l'en-tête de la fiche,
 * impossibles à manquer. Une note de classe s'affiche sur tous les produits
 * de la classe, avec son préfixe en évidence.
 */
export function NotesProduit({
  authorizationNr,
  atcCode,
  substances,
}: {
  authorizationNr: string;
  atcCode: string | null;
  substances: string | null;
}) {
  const { canEdit } = useAuth();
  const { refresh } = useStore();
  const [notes, setNotes] = useState<ProductNote[]>([]);
  const [edition, setEdition] = useState<'nouvelle' | string | null>(null);
  const [copiee, setCopiee] = useState<string | null>(null);

  async function copierNote(note: ProductNote) {
    if (await copier(note.body)) {
      setCopiee(note.id);
      setTimeout(() => setCopiee(null), 2000);
    }
  }

  const charger = useCallback(async () => {
    setNotes(await notesPour(authorizationNr, atcCode, substances));
  }, [authorizationNr, atcCode, substances]);

  useEffect(() => {
    setEdition(null);
    void charger();
  }, [charger]);

  async function agir(action: () => Promise<void>) {
    await action();
    setEdition(null);
    await charger();
    void refresh(); // l'index du rail (compteurs, marqueurs) suit
  }

  const posologies = notes.filter((n) => n.note_type === 'posologie');
  const autres = notes.filter((n) => n.note_type !== 'posologie');

  if (notes.length === 0 && !canEdit) return null;

  return (
    <div className="border-line bg-surface-1 shrink-0 border-b px-5 py-2">
      {/* Les posologies maison occupent leur propre bloc, en tête : c'est
          la question numéro un au comptoir, et le texte est fait pour être
          copié — dans le logiciel de caisse, sur une étiquette. */}
      {posologies.length > 0 && (
        <div className="mb-2 space-y-1.5">
          {posologies.map((note) =>
            edition === note.id ? (
              <EditeurNote
                key={note.id}
                initial={note}
                authorizationNr={authorizationNr}
                atcCode={atcCode}
                substances={substances}
                onAnnuler={() => setEdition(null)}
                onEnregistrer={(champ) => agir(() => updateNote(note.id, champ))}
              />
            ) : (
              <div
                key={note.id}
                className="border-dose bg-dose-soft rounded-control flex items-start gap-3 border px-3 py-2.5"
              >
                <Ruler size={16} className="text-dose-text mt-0.5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-dose-text text-[15px] leading-snug font-medium whitespace-pre-wrap">
                    {note.body}
                  </p>
                  <p className="text-dose-text mt-1 flex flex-wrap items-center gap-x-2 text-[11px] opacity-70">
                    <span className="font-semibold">Posologie maison</span>
                    {note.atc_prefix && <span className="donnee">classe {note.atc_prefix}</span>}
                    {note.substance && <span className="italic">{note.substance}</span>}
                    <span>
                      {note.created_by.split('@')[0]} · vérifiée le {formatDate(note.verified_on)}
                    </span>
                    {isStaleDate(note.verified_on) && (
                      <span className="font-semibold">à revérifier</span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copierNote(note)}
                  title="Copier la posologie"
                  className={cn(
                    'rounded-control inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                    copiee === note.id
                      ? 'bg-good-soft text-good-text'
                      : 'bg-dose text-on-accent hover:opacity-90',
                  )}
                >
                  {copiee === note.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiee === note.id ? 'Copiée' : 'Copier'}
                </button>
                {canEdit && (
                  <span className="flex shrink-0 gap-0.5">
                    <button
                      type="button"
                      title="Vérifiée aujourd'hui"
                      onClick={() => void agir(() => updateNote(note.id, { verified_on: todayISO() }))}
                      className="text-dose-text cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                    >
                      <CalendarCheck size={13} />
                    </button>
                    <button
                      type="button"
                      title="Modifier"
                      onClick={() => setEdition(note.id)}
                      className="text-dose-text cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => {
                        if (window.confirm('Supprimer cette posologie ?')) {
                          void agir(() => deleteNote(note.id));
                        }
                      }}
                      className="text-dose-text cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}

      <div className="space-y-1.5">
        {autres.map((note) =>
          edition === note.id ? (
            <EditeurNote
              key={note.id}
              initial={note}
              authorizationNr={authorizationNr}
              atcCode={atcCode}
              substances={substances}
              onAnnuler={() => setEdition(null)}
              onEnregistrer={(champ) => agir(() => updateNote(note.id, champ))}
            />
          ) : (
            <div
              key={note.id}
              className={cn(
                'flex items-start gap-2.5 rounded-control px-3 py-2',
                TYPES_NOTES[note.note_type].classes,
              )}
            >
              <StickyNote size={14} className="mt-0.5 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] leading-snug whitespace-pre-wrap">{note.body}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] opacity-75">
                  <span className="font-semibold">{TYPES_NOTES[note.note_type].label}</span>
                  {note.atc_prefix && (
                    <span className="donnee bg-info-soft text-info-text rounded px-1 py-px">
                      classe {note.atc_prefix}
                    </span>
                  )}
                  {note.substance && (
                    <span className="bg-good-soft text-good-text rounded px-1 py-px italic">
                      {note.substance}
                    </span>
                  )}
                  <span>
                    {note.created_by.split('@')[0]} · vérifiée le {formatDate(note.verified_on)}
                  </span>
                  {isStaleDate(note.verified_on) && (
                    <span className="font-semibold">à revérifier</span>
                  )}
                </p>
              </div>
              <span className="flex shrink-0 gap-0.5">
                <button
                  type="button"
                  onClick={() => void copierNote(note)}
                  title="Copier le texte"
                  className="cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                >
                  {copiee === note.id ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </span>
              {canEdit && (
                <span className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    title="Vérifiée aujourd'hui"
                    onClick={() => void agir(() => updateNote(note.id, { verified_on: todayISO() }))}
                    className="cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                  >
                    <CalendarCheck size={13} />
                  </button>
                  <button
                    type="button"
                    title="Modifier"
                    onClick={() => setEdition(note.id)}
                    className="cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    title="Supprimer"
                    onClick={() => {
                      if (window.confirm('Supprimer cette note ?')) {
                        void agir(() => deleteNote(note.id));
                      }
                    }}
                    className="cursor-pointer rounded p-1 opacity-60 hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              )}
            </div>
          ),
        )}

        {edition === 'nouvelle' ? (
          <EditeurNote
            authorizationNr={authorizationNr}
            atcCode={atcCode}
            substances={substances}
            onAnnuler={() => setEdition(null)}
            onEnregistrer={(note) => agir(() => createNote(note))}
          />
        ) : (
          canEdit && (
            <button
              type="button"
              onClick={() => setEdition('nouvelle')}
              className="text-ink-3 hover:text-accent inline-flex cursor-pointer items-center gap-1.5
                         px-1 py-0.5 text-[12.5px] transition-colors"
            >
              <Plus size={13} /> Ajouter une posologie ou une note
            </button>
          )
        )}
      </div>
    </div>
  );
}

function EditeurNote({
  initial,
  authorizationNr,
  atcCode,
  substances,
  onAnnuler,
  onEnregistrer,
}: {
  initial?: ProductNote;
  authorizationNr: string;
  atcCode: string | null;
  substances: string | null;
  onAnnuler: () => void;
  onEnregistrer: (note: {
    authorization_nr: string | null;
    atc_prefix: string | null;
    substance: string | null;
    note_type: NoteType;
    body: string;
  }) => void;
}) {
  const [type, setType] = useState<NoteType>(initial?.note_type ?? 'conseil');
  const [body, setBody] = useState(initial?.body ?? '');
  /** 'produit' | 'atc' | 'sub:<principe>' */
  const [cible, setCible] = useState<string>('produit');
  // Trois portées : le produit, son code ATC complet, chacun de ses principes
  // actifs — pas les niveaux intermédiaires, sources de rayonnement involontaire.
  const principes = (substances ?? '')
    .split(/[;,]/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x.length > 2)
    .slice(0, 4);
  const modification = Boolean(initial);

  return (
    <div className="border-line bg-surface-2 rounded-control border p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {(Object.keys(TYPES_NOTES) as NoteType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={cn(
              'cursor-pointer rounded-full px-2 py-0.5 text-[12px] transition-all',
              TYPES_NOTES[t].classes,
              type === t
                ? 'ring-accent font-semibold ring-2'
                : 'opacity-55 hover:opacity-100',
            )}
          >
            {TYPES_NOTES[t].label}
          </button>
        ))}
      </div>

      {!modification && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-ink-3 text-[12px]">Porte sur :</span>
          {/* Trois teintes, une par nature de portée : produit teal,
              classe ATC bleue, principe actif vert — même code couleur
              que les badges des bandeaux. */}
          <button
            type="button"
            onClick={() => setCible('produit')}
            aria-pressed={cible === 'produit'}
            className={cn(
              'bg-accent-soft text-accent cursor-pointer rounded-full px-2 py-0.5 text-[12px] transition-all',
              cible === 'produit' ? 'ring-accent font-semibold ring-2' : 'opacity-55 hover:opacity-100',
            )}
          >
            ce produit
          </button>
          {atcCode && (
            <button
              type="button"
              onClick={() => setCible('atc')}
              aria-pressed={cible === 'atc'}
              title={`Tous les produits du code ${atcCode}`}
              className={cn(
                'donnee bg-info-soft text-info-text cursor-pointer rounded-full px-2 py-0.5 text-[12px] transition-all',
                cible === 'atc' ? 'ring-info font-semibold ring-2' : 'opacity-55 hover:opacity-100',
              )}
            >
              ATC {atcCode}
            </button>
          )}
          {principes.map((principe) => (
            <button
              key={principe}
              type="button"
              onClick={() => setCible(`sub:${principe}`)}
              aria-pressed={cible === `sub:${principe}`}
              title={`Tous les produits contenant ${principe}`}
              className={cn(
                'bg-good-soft text-good-text max-w-56 cursor-pointer truncate rounded-full px-2 py-0.5 text-[12px] italic transition-all',
                cible === `sub:${principe}`
                  ? 'ring-good font-semibold ring-2'
                  : 'opacity-55 hover:opacity-100',
              )}
            >
              {principe}
            </button>
          ))}
        </div>
      )}

      <textarea
        autoFocus
        rows={2}
        maxLength={1000}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Consigne sur le MÉDICAMENT — jamais d'information sur un patient."
        className="border-line-strong bg-surface-1 focus:border-accent mt-2 w-full rounded-control
                   border px-2.5 py-1.5 text-[13.5px]"
      />

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          disabled={!body.trim()}
          onClick={() =>
            onEnregistrer({
              authorization_nr: cible === 'produit' ? authorizationNr : null,
              atc_prefix: cible === 'atc' ? atcCode : null,
              substance: cible.startsWith('sub:') ? cible.slice(4) : null,
              note_type: type,
              body: body.trim(),
            })
          }
          className="bg-accent text-on-accent hover:bg-accent-hover cursor-pointer rounded-control
                     px-3 py-1 text-[13px] font-medium disabled:opacity-50"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          className="text-ink-3 hover:text-ink inline-flex cursor-pointer items-center gap-1 text-[13px]"
        >
          <X size={13} /> Annuler
        </button>
      </div>
    </div>
  );
}
