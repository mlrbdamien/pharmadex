import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { cn } from '../components/ui';
import { CATALOGUE, chercherFiches, groupesDe, LIBELLES_VOLET } from '../data/fiches';
import type { EntreeFiche, Volet } from '../data/fiches/types';

const VOLETS: Volet[] = ['otc', 'rx', 'lpd'];

/**
 * L'aide-mémoire de comptoir : trois volets, 36 fiches. L'état de
 * consultation vit dans l'URL, comme au catalogue des médicaments — revenir
 * d'une fiche retrouve le volet et le filtre.
 */
export function Fiches() {
  const [params, setParams] = useSearchParams();
  const volet = (params.get('v') as Volet) || 'otc';
  const filtre = params.get('q') ?? '';

  const poser = (changements: Record<string, string | null>) => {
    setParams(
      (courants) => {
        const suivant = new URLSearchParams(courants);
        for (const [cle, valeur] of Object.entries(changements)) {
          if (valeur) suivant.set(cle, valeur);
          else suivant.delete(cle);
        }
        return suivant;
      },
      { replace: true },
    );
  };

  // Un filtre traverse les volets : chercher « benzo » ne doit pas dépendre
  // de l'onglet ouvert.
  const trouvees = useMemo(() => (filtre ? chercherFiches(filtre) : null), [filtre]);
  const groupes = useMemo(() => groupesDe(volet), [volet]);

  return (
    <>
      <EnteteEcran
        titre="Aide-mémoire"
        contexte={`${CATALOGUE.length} fiches`}
        onMenu={useMenu()}
      />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Search
              className="text-ink-3 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={filtre}
              onChange={(event) => poser({ q: event.target.value })}
              placeholder="Filtrer les fiches…"
              autoComplete="off"
              spellCheck={false}
              className="border-line bg-surface-1 focus:border-accent rounded-control shadow-card
                         placeholder:text-ink-3 w-full border py-2.5 pr-3 pl-10 text-[15px]"
            />
          </div>

          {!trouvees && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {VOLETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => poser({ v })}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1 text-[13.5px] transition-colors',
                    v === volet
                      ? 'border-accent bg-accent text-on-accent font-medium'
                      : 'border-line bg-surface-1 text-ink-2 hover:text-ink',
                  )}
                >
                  {LIBELLES_VOLET[v]}
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-6">
            {trouvees ? (
              trouvees.length > 0 ? (
                <Groupe titre={`${trouvees.length} résultat${trouvees.length > 1 ? 's' : ''}`} fiches={trouvees} />
              ) : (
                <p className="text-ink-3 text-[14px]">Aucune fiche ne correspond.</p>
              )
            ) : (
              groupes.map(({ groupe, fiches }) => (
                <Groupe key={groupe} titre={groupe} fiches={fiches} />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function Groupe({ titre, fiches }: { titre: string; fiches: EntreeFiche[] }) {
  return (
    <section>
      <h2 className="etiquette mb-1.5">{titre}</h2>
      <div className="border-line bg-surface-1 shadow-card rounded-card overflow-hidden border">
        {fiches.map((f) => (
          <Link
            key={f.id}
            to={`/f/${f.id}`}
            className="border-line hover:bg-surface-2 flex items-baseline gap-3 border-b px-3.5 py-2.5 last:border-0"
          >
            <span className="donnee text-accent w-8 shrink-0 text-[13px] font-semibold">
              {f.code}
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-ink block text-[14.5px] font-medium">{f.titre}</span>
              <span className="text-ink-3 block text-[13px]">{f.sous}</span>
            </span>
            {f.atc && (
              <span
                className="donnee text-ink-3 shrink-0 text-[11.5px]"
                title={`Rattachée aux codes ATC ${f.atc.join(', ')}`}
              >
                ATC
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
