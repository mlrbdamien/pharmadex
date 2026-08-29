import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Loader2, Pill, StickyNote, Trash2 } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { cn } from '../components/ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { isStaleDate } from '../lib/resources';
import { formatDate, todayISO } from '../lib/format';
import {
  deleteNote,
  listAllNotes,
  TYPES_NOTES,
  updateNote,
  type NoteType,
  type ProductNote,
} from '../lib/notes';

/**
 * Toutes les notes maison, triées fraîcheur d'abord : c'est la vue d'ensemble
 * de l'équipe et le point d'entrée du ménage périodique.
 */
export function Notes() {
  const { canEdit } = useAuth();
  const { refresh } = useStore();
  const ouvrirMenu = useMenu();
  const [notes, setNotes] = useState<ProductNote[]>([]);
  const [noms, setNoms] = useState<Map<string, string>>(new Map());
  const [type, setType] = useState<NoteType | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    const rows = await listAllNotes();
    setNotes(rows);
    const auths = [...new Set(rows.map((n) => n.authorization_nr).filter(Boolean))] as string[];
    if (auths.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('authorization_nr,name,name_fr')
        .in('authorization_nr', auths);
      setNoms(new Map((data ?? []).map((p) => [p.authorization_nr, p.name_fr || p.name])));
    }
    setChargement(false);
  }, []);

  useEffect(() => {
    void charger();
  }, [charger]);

  const visibles = useMemo(
    () => (type ? notes.filter((n) => n.note_type === type) : notes),
    [notes, type],
  );

  async function agir(action: () => Promise<void>) {
    await action();
    await charger();
    void refresh();
  }

  return (
    <>
      <EnteteEcran
        titre="Notes"
        contexte={`${notes.length} note${notes.length > 1 ? 's' : ''} maison`}
        onMenu={ouvrirMenu}
      />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(TYPES_NOTES) as NoteType[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(type === t ? null : t)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[13px] transition-colors',
                  type === t
                    ? cn('border-transparent font-medium', TYPES_NOTES[t].classes)
                    : 'border-line bg-surface-1 text-ink-2 hover:text-ink',
                )}
              >
                {TYPES_NOTES[t].label}
              </button>
            ))}
          </div>

          {chargement ? (
            <p className="text-ink-3 mt-10 flex items-center justify-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" /> Chargement…
            </p>
          ) : visibles.length === 0 ? (
            <p className="text-ink-3 mt-10 text-center text-sm">
              Aucune note{type ? ' de ce type' : ''}. Elles se créent depuis les fiches
              médicaments.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {visibles.map((note) => {
                const stale = isStaleDate(note.verified_on);
                return (
                  <div
                    key={note.id}
                    className="border-line bg-surface-1 shadow-card rounded-card border px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <StickyNote size={15} className="text-warning mt-0.5 shrink-0" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[11px] font-semibold',
                              TYPES_NOTES[note.note_type].classes,
                            )}
                          >
                            {TYPES_NOTES[note.note_type].label}
                          </span>
                          {note.authorization_nr ? (
                            <Link
                              to={`/p/${note.authorization_nr}`}
                              className="text-ink hover:text-accent inline-flex min-w-0 items-center
                                         gap-1 truncate text-[14px] font-medium hover:underline"
                            >
                              <Pill size={13} className="text-accent shrink-0" />
                              {noms.get(note.authorization_nr) ?? note.authorization_nr}
                            </Link>
                          ) : (
                            <span className="donnee bg-accent-soft text-accent rounded px-1.5 py-0.5 text-[12px]">
                              classe {note.atc_prefix}
                            </span>
                          )}
                          {stale && (
                            <span className="bg-warning-soft text-warning-text rounded px-1.5 py-0.5 text-[11px] font-medium">
                              à revérifier
                            </span>
                          )}
                        </div>
                        <p className="text-ink-2 mt-1 text-[13.5px] whitespace-pre-wrap">{note.body}</p>
                        <p className="text-ink-3 mt-1 text-[11.5px]">
                          {note.created_by.split('@')[0]} · vérifiée le {formatDate(note.verified_on)}
                        </p>
                      </div>
                      {canEdit && (
                        <span className="flex shrink-0 gap-0.5">
                          <button
                            type="button"
                            title="Vérifiée aujourd'hui"
                            onClick={() =>
                              void agir(() => updateNote(note.id, { verified_on: todayISO() }))
                            }
                            className="text-ink-3 hover:text-accent cursor-pointer rounded p-1"
                          >
                            <CalendarCheck size={14} />
                          </button>
                          <button
                            type="button"
                            title="Supprimer"
                            onClick={() => {
                              if (window.confirm('Supprimer cette note ?')) {
                                void agir(() => deleteNote(note.id));
                              }
                            }}
                            className="text-ink-3 hover:text-critical-text cursor-pointer rounded p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
