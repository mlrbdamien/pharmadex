import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronsDownUp, ChevronsUpDown, Loader2, Pill } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { FicheView } from '../components/Fiche';
import { cn } from '../components/ui';
import { chargerFiche, ficheParId, LIBELLES_VOLET } from '../data/fiches';
import type { Section } from '../data/fiches/types';

type Depliage = 'fiche' | 'ouvert' | 'ferme';

/**
 * Une fiche de l'aide-mémoire. Ses sections arrivent par import dynamique :
 * l'écran de recherche du comptoir ne porte jamais les 424 Ko des trois
 * volets, seulement le catalogue.
 */
export function FichePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ouvrirMenu = useMenu();
  const entree = id ? ficheParId(id) : undefined;
  const [sections, setSections] = useState<Section[] | null>(null);
  const [depliage, setDepliage] = useState<Depliage>('fiche');
  // Forcer l'état de dépliage remonte les sections : elles se remontent avec
  // le nouveau défaut plutôt que de piloter chacune depuis le parent.
  const [cle, setCle] = useState(0);

  useEffect(() => {
    setSections(null);
    setDepliage('fiche');
    if (!id) return;
    let vivant = true;
    chargerFiche(id).then((s) => vivant && setSections(s));
    return () => {
      vivant = false;
    };
  }, [id]);

  function deplier(mode: Depliage) {
    setDepliage(mode);
    setCle((n) => n + 1);
  }

  if (!entree) {
    return (
      <>
        <EnteteEcran titre="Fiche" onMenu={ouvrirMenu} />
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
        contexte={LIBELLES_VOLET[entree.volet]}
        onMenu={ouvrirMenu}
        actions={
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
              <p className="donnee text-accent text-[13px] font-semibold">{entree.code}</p>
              <h1 className="text-ink mt-0.5 text-[22px] leading-tight font-semibold tracking-[-0.02em]">
                {entree.titre}
              </h1>
              <p className="text-ink-2 mt-1 text-[14px] leading-relaxed">{entree.sous}</p>
              {entree.atc && (
                <p className="text-ink-3 mt-2 flex flex-wrap items-center gap-1.5 text-[12.5px]">
                  <Pill size={12} strokeWidth={1.75} aria-hidden />
                  Remonte au scan des classes
                  {entree.atc.map((p) => (
                    <Link
                      key={p}
                      to={`/medicaments?atc=${p}`}
                      className="donnee border-line hover:border-accent hover:text-accent rounded border px-1.5"
                    >
                      {p}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div className={cn('mt-6', !sections && 'flex justify-center py-10')}>
            {sections ? (
              <FicheView key={cle} entree={entree} sections={sections} defaut={depliage} />
            ) : (
              <Loader2 className="text-ink-3 size-5 animate-spin" />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
