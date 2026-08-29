import { useCallback, useEffect, useState } from 'react';
import { CalendarCheck, Pencil, Plus, StickyNote, Trash2, X } from 'lucide-react';
import { cn } from './ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { isStaleDate } from '../lib/resources';
import { formatDate, todayISO } from '../lib/format';
import {
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

  if (notes.length === 0 && !canEdit) return null;

  return (
    <div className="border-line bg-surface-1 shrink-0 border-b px-5 py-2">
      <div className="space-y-1.5">
        {notes.map((note) =>
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
              <Plus size={13} /> Ajouter une note
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
            className={cn(
              'cursor-pointer rounded-full border px-2 py-0.5 text-[12px] transition-colors',
              type === t
                ? cn('border-transparent font-medium', TYPES_NOTES[t].classes)
                : 'border-line text-ink-3 hover:text-ink',
            )}
          >
            {TYPES_NOTES[t].label}
          </button>
        ))}
      </div>

      {!modification && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-ink-3 text-[12px]">Porte sur :</span>
          <button
            type="button"
            onClick={() => setCible('produit')}
            className={cn(
              'cursor-pointer rounded-full border px-2 py-0.5 text-[12px]',
              cible === 'produit'
                ? 'border-accent bg-accent text-on-accent'
                : 'border-line text-ink-2',
            )}
          >
            ce produit
          </button>
          {atcCode && (
            <button
              type="button"
              onClick={() => setCible('atc')}
              title={`Tous les produits du code ${atcCode}`}
              className={cn(
                'donnee cursor-pointer rounded-full border px-2 py-0.5 text-[12px]',
                cible === 'atc'
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line text-ink-2',
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
              title={`Tous les produits contenant ${principe}`}
              className={cn(
                'max-w-56 cursor-pointer truncate rounded-full border px-2 py-0.5 text-[12px] italic',
                cible === `sub:${principe}`
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line text-ink-2',
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
