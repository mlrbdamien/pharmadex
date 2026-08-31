import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from './ui';
import type { EntreeFiche, Section, Stop, Tableau, Triage } from '../lib/fiches';

/**
 * Le rendu d'une fiche de l'aide-mémoire, transposé du moteur de
 * comptoir-otc.html. Les sections se rendent dans un ordre fixe — texte,
 * listes, tableau, checklist, triage, interdits, avertissements — pour que
 * l'œil trouve toujours la même chose au même endroit d'une fiche à l'autre.
 */

/**
 * Le contenu porte du HTML en ligne (`<b>`, `<a>`, `<span class="dose">`…).
 * C'est du texte rédigé dans le dépôt et relu à chaque commit, jamais une
 * saisie d'utilisateur : l'injection est ici un choix, pas un oubli.
 */
function T({ html, as: Balise = 'span' }: { html: string; as?: 'span' | 'p' | 'li' | 'td' | 'th' }) {
  return <Balise dangerouslySetInnerHTML={{ __html: html }} />;
}

const NIVEAUX: Record<number, { bord: string; pastille: string }> = {
  1: { bord: 'border-critical', pastille: 'bg-critical' },
  2: { bord: 'border-serious', pastille: 'bg-serious' },
  3: { bord: 'border-info', pastille: 'bg-info' },
  4: { bord: 'border-accent', pastille: 'bg-accent' },
};

function BlocTriage({ triage }: { triage: Triage[] }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      {triage.map((t) => {
        const style = NIVEAUX[t.n] ?? NIVEAUX[4];
        return (
          <div key={t.n} className={cn('border-l-[3px] py-1 pl-3.5', style.bord)}>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span
                className={cn(
                  'donnee shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold text-white',
                  style.pastille,
                )}
              >
                N{t.n}
              </span>
              <span className="text-ink text-[15px] font-semibold">{t.quand}</span>
            </div>
            {/* La destination se lit en retrait : c'est le « où », pas le « quand ». */}
            <p className="text-ink-3 mt-0.5 text-[13.5px]" dangerouslySetInnerHTML={{ __html: t.ou }} />
            <ul className="mt-1.5 list-disc pl-5">
              {t.items.map((item, i) => (
                <T key={i} html={item} as="li" />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function BlocStop({ stop }: { stop: Stop }) {
  return (
    <div className="border-critical mt-3 border-l-[3px] py-1.5 pl-3.5">
      <p className="etiquette text-critical-text">{stop.t ?? 'Ne pas délivrer'}</p>
      {stop.p?.map((texte, i) => <T key={i} html={texte} as="p" />)}
      {stop.ul && (
        <ul className="mt-1.5 list-disc pl-5">
          {stop.ul.map((item, i) => (
            <T key={i} html={item} as="li" />
          ))}
        </ul>
      )}
    </div>
  );
}

function BlocTableau({ table }: { table: Tableau }) {
  return (
    <div className="border-line mt-3 overflow-x-auto rounded-card border">
      <table className="w-full border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="bg-surface-2">
            {table.head.map((h, i) => (
              <T key={i} html={h} as="th" />
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-line border-t align-top">
              {row.map((cell, j) => (
                <T key={j} html={cell} as="td" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Checklist de comptoir. L'état vit dans le composant et disparaît quand on
 * quitte la fiche — délibérément : une case cochée pour un patient ne doit
 * jamais réapparaître cochée pour le suivant.
 */
function BlocCheck({ items }: { items: string[] }) {
  const [coches, setCoches] = useState<Set<number>>(new Set());
  return (
    <div className="mt-3">
      {items.map((item, i) => (
        <label key={i} className="flex cursor-pointer items-baseline gap-2.5 py-0.5">
          <input
            type="checkbox"
            checked={coches.has(i)}
            onChange={() =>
              setCoches((actuels) => {
                const suivant = new Set(actuels);
                if (suivant.has(i)) suivant.delete(i);
                else suivant.add(i);
                return suivant;
              })
            }
            className="accent-accent mt-1 shrink-0"
          />
          <T html={item} />
        </label>
      ))}
      {coches.size > 0 && (
        <button
          type="button"
          onClick={() => setCoches(new Set())}
          className="border-line text-ink-3 hover:text-accent hover:border-accent rounded-control
                     donnee mt-2 inline-flex cursor-pointer items-center gap-1.5 border px-2 py-1 text-[12px]"
        >
          <RotateCcw size={11} strokeWidth={2} aria-hidden />
          Réinitialiser
        </button>
      )}
    </div>
  );
}

/** `defaut` : 'fiche' respecte le choix de l'auteur, sinon force l'état. */
type Depliage = 'fiche' | 'ouvert' | 'ferme';

function BlocSection({ section, defaut }: { section: Section; defaut: Depliage }) {
  const [ouvert, setOuvert] = useState(
    defaut === 'fiche' ? section.open === true : defaut === 'ouvert',
  );
  return (
    <section className="border-line border-b py-1">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="group flex w-full cursor-pointer items-center gap-2 py-2.5 text-left"
      >
        <ChevronRight
          size={15}
          strokeWidth={2}
          aria-hidden
          className={cn(
            'text-ink-3 shrink-0 transition-transform motion-reduce:transition-none',
            ouvert && 'rotate-90',
          )}
        />
        <h2 className="text-ink text-[15.5px] font-semibold tracking-[-0.01em]">{section.t}</h2>
      </button>

      {ouvert && (
        <div className="fiche text-ink-2 pb-4 pl-[23px] text-[14.5px] leading-relaxed">
          {section.p?.map((texte, i) => (
            <T key={i} html={texte} as="p" />
          ))}
          {section.ul && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {section.ul.map((item, i) => (
                <T key={i} html={item} as="li" />
              ))}
            </ul>
          )}
          {section.ol && (
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {section.ol.map((item, i) => (
                <T key={i} html={item} as="li" />
              ))}
            </ol>
          )}
          {section.table && <BlocTableau table={section.table} />}
          {section.check && <BlocCheck items={section.check} />}
          {section.triage && <BlocTriage triage={section.triage} />}
          {section.stop && <BlocStop stop={section.stop} />}
          {section.warn?.map((texte, i) => (
            <div key={i} className="border-warning mt-3 border-l-[3px] py-1.5 pl-3.5">
              <T html={texte} as="p" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function FicheView({
  entree,
  sections,
  defaut = 'fiche',
}: {
  entree: EntreeFiche;
  sections: Section[];
  defaut?: Depliage;
}) {
  return (
    <article>
      {entree.remise && (
        <p className="fiche border-accent bg-accent-soft text-ink-2 rounded-control mb-4 border-l-[3px] px-3 py-2 text-[13.5px]">
          <T html={entree.remise} />
        </p>
      )}
      <div>
        {sections.map((section, i) => (
          <BlocSection key={`${section.t}-${i}`} section={section} defaut={defaut} />
        ))}
      </div>
    </article>
  );
}
