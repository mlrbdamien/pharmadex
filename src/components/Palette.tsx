import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, SearchX } from 'lucide-react';
import { ListeResultats } from './ListeResultats';
import { useRecherche, useSelection } from '../lib/useRecherche';
import type { Resultat } from '../lib/recherche';

/**
 * La barre de recherche unique, en superposition.
 *
 * Elle s'ouvre depuis n'importe quel écran — une frappe, « / » ou Ctrl+K —
 * et ne fait pas perdre le contexte : on vérifie un dosage depuis une fiche
 * sans quitter la fiche. C'est ce qui la distingue d'une redirection vers
 * l'accueil, qui était le comportement précédent.
 */
export function Palette({
  ouverte,
  saisieInitiale,
  onFermer,
}: {
  ouverte: boolean;
  /** Les premiers caractères d'un scan, arrivés avant l'ouverture. */
  saisieInitiale: string;
  onFermer: () => void;
}) {
  const navigate = useNavigate();
  const [requete, setRequete] = useState('');
  const champ = useRef<HTMLInputElement>(null);
  const { resultats, scan, cherche } = useRecherche(requete);
  const { selection, setSelection, surTouche } = useSelection(resultats.length, requete);

  useEffect(() => {
    if (ouverte) {
      setRequete(saisieInitiale);
      champ.current?.focus();
    }
  }, [ouverte, saisieInitiale]);

  // Un scan reconnu est une réponse sans ambiguïté : inutile de faire choisir.
  useEffect(() => {
    if (ouverte && scan) {
      onFermer();
      navigate(`/p/${scan.product.authorization_nr}`);
    }
  }, [ouverte, scan, navigate, onFermer]);

  // Garder la ligne sélectionnée visible quand on descend au clavier.
  useEffect(() => {
    document
      .querySelector('[data-palette] [data-actif]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [selection]);

  if (!ouverte) return null;

  function ouvrir(r: Resultat) {
    onFermer();
    navigate(r.vers);
  }

  return (
    <div
      data-palette
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche"
    >
      <button
        type="button"
        aria-label="Fermer la recherche"
        onClick={onFermer}
        className="absolute inset-0 bg-black/30"
      />
      <div className="border-line bg-surface-1 shadow-modal rounded-card relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden border">
        <div className="border-line flex items-center gap-2.5 border-b px-3.5">
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
              if (surTouche(event) === 'ferme') onFermer();
            }}
            placeholder="Médicament, fiche, ressource, note — ou scan de la boîte"
            autoComplete="off"
            spellCheck={false}
            className="champ-nu placeholder:text-ink-3 flex-1 bg-transparent py-3.5 text-[16px] outline-none"
          />
          {cherche && <Loader2 className="text-ink-3 size-4 shrink-0 animate-spin" />}
        </div>

        {/* Ni `flex-1`, ni étirement du parent : la palette épouse la
            hauteur de ses résultats au lieu de remplir l'écran. */}
        <div className="min-h-0 overflow-y-auto">
          {resultats.length > 0 ? (
            <ListeResultats
              resultats={resultats}
              selection={selection}
              onSurvol={setSelection}
              onOuvrir={ouvrir}
              compact
            />
          ) : requete.trim() && !cherche ? (
            <p className="text-ink-3 flex items-center justify-center gap-2 py-8 text-[14px]">
              <SearchX size={16} aria-hidden /> Aucun résultat pour « {requete.trim()} »
            </p>
          ) : null}
        </div>

        <div className="border-line text-ink-3 flex items-center gap-4 border-t px-3.5 py-2 text-[11.5px]">
          <span>
            <b className="donnee">↑↓</b> parcourir
          </span>
          <span>
            <b className="donnee">Entrée</b> ouvrir
          </span>
          <span>
            <b className="donnee">Échap</b> fermer
          </span>
        </div>
      </div>
    </div>
  );
}
