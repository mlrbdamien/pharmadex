import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Search, SearchX } from 'lucide-react';
import { TagFilter } from '../components/TagFilter';
import { ResourceCard } from '../components/ResourceCard';
import { ListeResultats } from '../components/ListeResultats';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { logSearchMiss, shouldLogMiss } from '../lib/resources';
import { useRecherche, useSelection } from '../lib/useRecherche';
import type { Resultat } from '../lib/recherche';
import type { Resource } from '../lib/types';

/**
 * L'écran de recherche — et le point de départ d'un service.
 *
 * Une seule barre, des résultats fusionnés et classés : médicaments, fiches
 * du Sémaphore, ressources et notes dans la même liste. Avant, chaque
 * source avait son bloc et son ordre fixe, ce qui noyait la fiche « toux »
 * sous les antitussifs.
 *
 * À vide, l'écran montre ce qu'on ouvre sans chercher : les ressources
 * épinglées. C'est la vue de début de service.
 */
export function Home() {
  const { canEdit } = useAuth();
  const { resources, tags, loading, error, refresh } = useStore();
  const navigate = useNavigate();

  const [requete, setRequete] = useState('');
  const [tagActif, setTagActif] = useState<string | null>(null);
  const champ = useRef<HTMLInputElement>(null);
  const dernierConsigne = useRef<string | null>(null);

  const q = requete.trim();
  const { resultats, scan, cherche, distant } = useRecherche(requete);
  const { selection, setSelection, surTouche } = useSelection(resultats.length, q);

  // Un scan reconnu ouvre la fiche : le code-barre ne demande pas d'arbitrage.
  useEffect(() => {
    if (scan) navigate(`/p/${scan.product.authorization_nr}`);
  }, [scan, navigate]);

  /**
   * Journal des recherches vides. Deux conditions : la réponse serveur est
   * arrivée ET rien n'a été trouvé nulle part — un produit, une fiche ou une
   * note trouvés SONT des réponses. Puis deux secondes sans frappe : une
   * hésitation au milieu d'un mot en dure quelques centaines, pas deux.
   */
  useEffect(() => {
    if (!q || distant === null || resultats.length > 0 || scan !== null) return;
    const minuteur = setTimeout(() => {
      if (shouldLogMiss(q, dernierConsigne.current)) {
        dernierConsigne.current = q;
        void logSearchMiss(q);
      }
    }, 2000);
    return () => clearTimeout(minuteur);
  }, [q, distant, resultats.length, scan]);

  useEffect(() => {
    document.querySelector('[data-resultats] [data-actif]')?.scrollIntoView({ block: 'nearest' });
  }, [selection]);

  const ouvrir = (r: Resultat) => navigate(r.vers);

  const epinglees = resources.filter(
    (r) => r.pinned && (!tagActif || r.tags.includes(tagActif)),
  );

  return (
    <>
      <EnteteEcran titre="Recherche" onMenu={useMenu()} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="border-line bg-surface-1 shadow-card focus-within:border-accent rounded-card flex items-center gap-2.5 border px-3.5">
            <Search className="text-ink-3 size-4 shrink-0" aria-hidden />
            <input
              ref={champ}
              value={requete}
              onChange={(event) => setRequete(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const cible = resultats[selection];
                  if (cible) ouvrir(cible);
                  return;
                }
                if (surTouche(event) === 'ferme') setRequete('');
              }}
              placeholder="Médicament, fiche, ressource, note — ou scan de la boîte"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="champ-nu placeholder:text-ink-3 flex-1 bg-transparent py-3 text-[16px] outline-none"
            />
            {cherche && <Loader2 className="text-ink-3 size-4 shrink-0 animate-spin" />}
            {q && !cherche && (
              <span className="donnee text-ink-3 shrink-0 text-[12px]">
                {resultats.length}
              </span>
            )}
          </div>

          {error && (
            <p className="border-critical-soft bg-critical-soft text-critical-text mt-4 rounded-lg border px-4 py-3 text-sm">
              {error}
            </p>
          )}

          {q ? (
            <div className="mt-4">
              {resultats.length > 0 ? (
                <div
                  data-resultats
                  className="border-line bg-surface-1 shadow-card rounded-card overflow-hidden border"
                >
                  <ListeResultats
                    resultats={resultats}
                    selection={selection}
                    onSurvol={setSelection}
                    onOuvrir={ouvrir}
                  />
                </div>
              ) : cherche || distant === null ? null : (
                <div className="mt-10 text-center">
                  <SearchX className="text-ink-3 mx-auto size-8" />
                  <p className="text-ink-3 mt-2 text-sm">Aucun résultat pour « {q} »</p>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => navigate(`/nouveau?titre=${encodeURIComponent(q)}`)}
                      className="border-line text-ink-2 hover:text-accent hover:border-accent
                                 rounded-control mt-4 inline-flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-[13.5px]"
                    >
                      <Plus size={14} strokeWidth={2} aria-hidden />
                      Créer une ressource « {q} »
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : loading ? (
            <p className="text-ink-3 mt-10 flex items-center justify-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" /> Chargement…
            </p>
          ) : (
            <>
              {tags.length > 0 && (
                <div className="mt-3">
                  <TagFilter tags={tags} active={tagActif} onSelect={setTagActif} />
                </div>
              )}
              {epinglees.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <p className="etiquette">Épinglées</p>
                  {epinglees.map((resource: Resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      canEdit={canEdit}
                      onTagClick={setTagActif}
                      onChanged={() => void refresh()}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-ink-3 mt-10 text-center text-sm">
                  Tapez pour chercher — ou scannez une boîte.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
