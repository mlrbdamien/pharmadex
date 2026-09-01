import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarClock, Eraser, Loader2, Pill, Search, X } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { Card, CardHeader, cn } from '../components/ui';
import {
  libelleFr,
  listPackages,
  looksLikeScan,
  normalizeScannedCode,
  scanGtin,
  searchProducts,
  type PackageRow,
} from '../lib/products';
import { notesPour, type ProductNote } from '../lib/notes';
import type { ProductRow } from '../lib/types';
import {
  arrondi,
  aujourdhuiIso,
  calculer,
  emballagesPour,
  enSuisse,
  facteurDose,
  FORMES,
  LIBELLES_DOSE,
  lireConditionnement,
  nombre,
  prisesParJour,
  unitesDosePour,
  type Rythme,
  type Saisie,
  type Unite,
  type UniteDose,
} from '../lib/dispensation';

const CHAMP =
  'border-line bg-surface-1 focus:border-accent rounded-control border px-2.5 py-1.5 text-[15px]';

/** L'unité d'emballage qui correspond à une galénique choisie dans la liste. */
function uniteDe(libelle: string): Unite {
  return FORMES.find((f) => f.libelle === libelle)?.unite ?? 'unite';
}

/**
 * Calcul de dispensation : ce qui a été délivré tient combien de jours, et
 * le patient revient-il à l'heure.
 *
 * Rien n'est enregistré — ni en base, ni en stockage local, ni dans l'URL
 * (seul le n° d'autorisation du produit y transite, il ne désigne personne).
 * Une date de délivrance dit quelque chose d'un patient ; elle ne survit pas
 * au rechargement de la page.
 */
export function Dispensation() {
  const [params, setParams] = useSearchParams();

  // — Produit (facultatif : il ne fait que pré-remplir la quantité)
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState<ProductRow[]>([]);
  const [cherche, setCherche] = useState(false);
  const [produit, setProduit] = useState<ProductRow | null>(null);
  const [emballages, setEmballages] = useState<PackageRow[]>([]);
  const [gtin, setGtin] = useState('');
  const [posologies, setPosologies] = useState<ProductNote[]>([]);

  // — Délivré
  const [parEmballage, setParEmballage] = useState('');
  const [nbEmballages, setNbEmballages] = useState('1');
  const [galenique, setGalenique] = useState('comprimés');

  // — Posologie
  const [parPrise, setParPrise] = useState('1');
  const [uniteDose, setUniteDose] = useState<UniteDose>('unite');
  const [mode, setMode] = useState<Rythme['mode']>('jour');
  const [frequence, setFrequence] = useState('3');
  const [gouttesParMl, setGouttesParMl] = useState('20');
  const [mlParMesure, setMlParMesure] = useState('5');

  // — Dates
  const [reste, setReste] = useState('');
  const [dispenseLe, setDispenseLe] = useState('');
  const [reference, setReference] = useState(aujourdhuiIso());
  const [duree, setDuree] = useState('');

  const champRecherche = useRef<HTMLInputElement>(null);

  const unite = uniteDe(galenique);
  const dosesPossibles = unitesDosePour(unite);

  // La galénique commande l'unité de prise : passer aux ml interdit de
  // continuer à compter en comprimés.
  useEffect(() => {
    if (!dosesPossibles.includes(uniteDose)) setUniteDose(dosesPossibles[0]);
  }, [dosesPossibles, uniteDose]);

  /** Charge un produit et propose l'emballage le plus courant. */
  const choisirProduit = useCallback(async (ligne: ProductRow, gtinScanne?: string) => {
    setProduit(ligne);
    setResultats([]);
    setRecherche('');
    setParams(new URLSearchParams({ p: ligne.authorization_nr }), { replace: true });

    const [pkgs, notes] = await Promise.all([
      listPackages(ligne.authorization_nr).catch(() => [] as PackageRow[]),
      notesPour(ligne.authorization_nr, ligne.atc_code, ligne.substances).catch(
        () => [] as ProductNote[],
      ),
    ]);
    setEmballages(pkgs);
    setPosologies(notes.filter((n) => n.note_type === 'posologie'));
    const vise = gtinScanne ? pkgs.find((p) => p.gtin === gtinScanne) : undefined;
    appliquerEmballage(vise ?? pkgs[0]);
  }, [setParams]);

  /** Un emballage choisi renseigne quantité et galénique — sans les verrouiller. */
  function appliquerEmballage(pkg: PackageRow | undefined) {
    if (!pkg) return;
    setGtin(pkg.gtin);
    const lu =
      lireConditionnement(pkg.description_fr) ?? lireConditionnement(pkg.description);
    if (!lu) return;
    setParEmballage(String(lu.quantite));
    if (FORMES.some((f) => f.libelle === lu.libelle)) setGalenique(lu.libelle);
  }

  // Recherche produit, ou résolution directe si la saisie est un code scanné.
  useEffect(() => {
    const q = recherche.trim();
    if (q.length < 2) {
      setResultats([]);
      return;
    }
    let vivant = true;
    const minuteur = setTimeout(async () => {
      setCherche(true);
      if (looksLikeScan(q)) {
        const code = normalizeScannedCode(q);
        const hit = code ? await scanGtin(code).catch(() => null) : null;
        if (vivant && hit) {
          const lignes = await searchProducts(hit.product.name).catch(() => []);
          const ligne = lignes.find(
            (l) => l.authorization_nr === hit.product.authorization_nr,
          );
          if (ligne) {
            await choisirProduit(ligne, code ?? undefined);
            if (vivant) setCherche(false);
            return;
          }
        }
      }
      const lignes = await searchProducts(q).catch(() => []);
      if (vivant) {
        setResultats(lignes.slice(0, 8));
        setCherche(false);
      }
    }, 180);
    return () => {
      vivant = false;
      clearTimeout(minuteur);
    };
  }, [recherche, choisirProduit]);

  // Arrivée depuis une fiche : /dispensation?p=12345
  const depuisUrl = params.get('p');
  useEffect(() => {
    if (!depuisUrl || produit) return;
    searchProducts(depuisUrl)
      .then((lignes) => lignes.find((l) => l.authorization_nr === depuisUrl))
      .then((ligne) => ligne && choisirProduit(ligne))
      .catch(() => undefined);
  }, [depuisUrl, produit, choisirProduit]);

  function reinitialiser() {
    setProduit(null);
    setEmballages([]);
    setPosologies([]);
    setGtin('');
    setRecherche('');
    setResultats([]);
    setParEmballage('');
    setNbEmballages('1');
    setGalenique('comprimés');
    setParPrise('1');
    setMode('jour');
    setFrequence('3');
    setReste('');
    setDispenseLe('');
    setReference(aujourdhuiIso());
    setDuree('');
    setParams(new URLSearchParams(), { replace: true });
    champRecherche.current?.focus();
  }

  const rythme: Rythme =
    mode === 'intervalle'
      ? { mode: 'intervalle', jours: nombre(frequence) }
      : { mode, prises: nombre(frequence) };

  const saisie: Saisie = {
    parEmballage: nombre(parEmballage),
    emballages: nombre(nbEmballages),
    unite,
    libelle: galenique,
    quantiteParPrise: nombre(parPrise),
    uniteDose,
    rythme,
    gouttesParMl: nombre(gouttesParMl),
    mlParMesure: nombre(mlParMesure),
    resteCompte: nombre(reste),
    dispenseLe,
    reference,
  };
  const resultat = calculer(saisie);

  const parJour =
    nombre(parPrise) *
    facteurDose(uniteDose, nombre(gouttesParMl), nombre(mlParMesure)) *
    prisesParJour(rythme);

  return (
    <>
      <EnteteEcran
        titre="Dispensation"
        contexte="Couverture, épuisement, observance"
        onMenu={useMenu()}
        actions={
          <button
            type="button"
            onClick={reinitialiser}
            className="border-line text-ink-2 hover:text-ink hover:bg-surface-2 rounded-control
                       inline-flex cursor-pointer items-center gap-1.5 border px-2.5 py-1.5 text-[13px]"
          >
            <Eraser size={13} strokeWidth={1.75} aria-hidden />
            Effacer
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 lg:grid-cols-5 lg:items-start">
            {/* ---------------------------------------------------------- */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <Card>
                <CardHeader icon={Pill} title="Médicament (facultatif)" />
                {produit ? (
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-ink text-[15px] font-medium">{libelleFr(produit)}</p>
                      {produit.substances && (
                        <p className="text-ink-3 mt-0.5 truncate text-[13px]">
                          {produit.substances}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProduit(null);
                        setEmballages([]);
                        setPosologies([]);
                        setParams(new URLSearchParams(), { replace: true });
                        champRecherche.current?.focus();
                      }}
                      aria-label="Retirer le médicament"
                      className="text-ink-3 hover:text-ink hover:bg-surface-2 rounded-control
                                 shrink-0 cursor-pointer p-1"
                    >
                      <X size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search
                      className="text-ink-3 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      aria-hidden
                    />
                    <input
                      ref={champRecherche}
                      value={recherche}
                      onChange={(event) => setRecherche(event.target.value)}
                      placeholder="Nom, principe actif, ou scan de la boîte…"
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      className={cn(CHAMP, 'w-full py-2 pr-9 pl-10')}
                    />
                    {cherche && (
                      <Loader2 className="text-ink-3 absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
                    )}
                    {resultats.length > 0 && (
                      <div className="border-line bg-surface-1 shadow-card rounded-card mt-1.5 overflow-hidden border">
                        {resultats.map((ligne) => (
                          <button
                            key={ligne.authorization_nr}
                            type="button"
                            onClick={() => choisirProduit(ligne)}
                            className="border-line hover:bg-surface-2 block w-full cursor-pointer
                                       border-b px-3 py-2 text-left last:border-0"
                          >
                            <span className="text-ink block truncate text-[14px]">
                              {libelleFr(ligne)}
                            </span>
                            {ligne.substances && (
                              <span className="text-ink-3 block truncate text-[12px]">
                                {ligne.substances}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {emballages.length > 0 && (
                  <label className="mt-3 block">
                    <span className="etiquette">Emballage délivré</span>
                    <select
                      value={gtin}
                      onChange={(event) => {
                        setGtin(event.target.value);
                        appliquerEmballage(
                          emballages.find((p) => p.gtin === event.target.value),
                        );
                      }}
                      className={cn(CHAMP, 'mt-1 w-full')}
                    >
                      {emballages.map((pkg) => (
                        <option key={pkg.gtin} value={pkg.gtin}>
                          {pkg.description_fr || pkg.description || pkg.gtin}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {posologies.length > 0 && (
                  <div className="bg-dose-soft text-dose-text rounded-control mt-3 px-3 py-2">
                    <p className="etiquette text-dose-text mb-1">Posologie maison</p>
                    {posologies.map((note) => (
                      <p key={note.id} className="text-[13.5px] whitespace-pre-wrap">
                        {note.body}
                      </p>
                    ))}
                  </div>
                )}
              </Card>

              {/* ---------------------------------------------------------- */}
              <Card>
                <CardHeader title="Délivré" />
                <div className="flex flex-wrap items-end gap-2">
                  <label className="min-w-0">
                    <span className="etiquette">Par emballage</span>
                    <input
                      value={parEmballage}
                      onChange={(event) => setParEmballage(event.target.value)}
                      inputMode="decimal"
                      placeholder="30"
                      className={cn(CHAMP, 'tabular mt-1 w-24')}
                    />
                  </label>
                  <label className="min-w-0">
                    <span className="etiquette">Galénique</span>
                    <select
                      value={galenique}
                      onChange={(event) => setGalenique(event.target.value)}
                      className={cn(CHAMP, 'mt-1')}
                    >
                      {FORMES.map((f) => (
                        <option key={f.libelle} value={f.libelle}>
                          {f.libelle}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span className="text-ink-3 pb-2 text-[15px]">×</span>
                  <label className="min-w-0">
                    <span className="etiquette">Emballages</span>
                    <input
                      value={nbEmballages}
                      onChange={(event) => setNbEmballages(event.target.value)}
                      inputMode="numeric"
                      className={cn(CHAMP, 'tabular mt-1 w-20')}
                    />
                  </label>
                  {nombre(parEmballage) > 0 && nombre(nbEmballages) > 0 && (
                    <p className="text-ink-2 pb-2 text-[14px]">
                      = <b className="tabular text-ink">
                        {arrondi(nombre(parEmballage) * nombre(nbEmballages))}
                      </b>{' '}
                      {galenique}
                    </p>
                  )}
                </div>
              </Card>

              {/* ---------------------------------------------------------- */}
              <Card>
                <CardHeader title="Posologie" />
                <div className="flex flex-wrap items-end gap-2">
                  <label className="min-w-0">
                    <span className="etiquette">Par prise</span>
                    <input
                      value={parPrise}
                      onChange={(event) => setParPrise(event.target.value)}
                      inputMode="decimal"
                      placeholder="1"
                      className={cn(CHAMP, 'tabular mt-1 w-20')}
                    />
                  </label>
                  {dosesPossibles.length > 1 ? (
                    <label className="min-w-0">
                      <span className="etiquette">Unité</span>
                      <select
                        value={uniteDose}
                        onChange={(event) => setUniteDose(event.target.value as UniteDose)}
                        className={cn(CHAMP, 'mt-1')}
                      >
                        {dosesPossibles.map((u) => (
                          <option key={u} value={u}>
                            {LIBELLES_DOSE[u]}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <span className="text-ink-2 pb-2 text-[14px]">
                      {unite === 'unite' ? galenique : LIBELLES_DOSE[uniteDose]}
                    </span>
                  )}
                  <label className="min-w-0">
                    <span className="etiquette">Fréquence</span>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        value={frequence}
                        onChange={(event) => setFrequence(event.target.value)}
                        inputMode="decimal"
                        className={cn(CHAMP, 'tabular w-16')}
                      />
                      <select
                        value={mode}
                        onChange={(event) => setMode(event.target.value as Rythme['mode'])}
                        className={CHAMP}
                      >
                        <option value="jour">fois par jour</option>
                        <option value="semaine">fois par semaine</option>
                        <option value="intervalle">jours d'intervalle</option>
                      </select>
                    </div>
                  </label>
                </div>

                {/* La conversion n'est pas universelle : une solution huileuse
                    donne 15 gouttes au ml là où une aqueuse en donne 20. */}
                {uniteDose === 'goutte' && (
                  <label className="mt-3 flex items-center gap-2">
                    <span className="text-ink-2 text-[13.5px]">Gouttes par ml</span>
                    <input
                      value={gouttesParMl}
                      onChange={(event) => setGouttesParMl(event.target.value)}
                      inputMode="decimal"
                      className={cn(CHAMP, 'tabular w-16 py-1')}
                    />
                    <span className="text-ink-3 text-[12.5px]">
                      20 pour une solution aqueuse — à vérifier sur la notice
                    </span>
                  </label>
                )}
                {uniteDose === 'mesure' && (
                  <label className="mt-3 flex items-center gap-2">
                    <span className="text-ink-2 text-[13.5px]">ml par cuillère-mesure</span>
                    <input
                      value={mlParMesure}
                      onChange={(event) => setMlParMesure(event.target.value)}
                      inputMode="decimal"
                      className={cn(CHAMP, 'tabular w-16 py-1')}
                    />
                  </label>
                )}

                {parJour > 0 && (
                  <p className="text-ink-2 mt-3 text-[14px]">
                    Soit <b className="tabular text-ink">{arrondi(parJour, 2)}</b>{' '}
                    {unite === 'unite' ? galenique : unite === 'dose' ? 'doses' : unite} par
                    jour.
                  </p>
                )}
              </Card>

              {/* ---------------------------------------------------------- */}
              <Card>
                <CardHeader icon={CalendarClock} title="Dates et comptage" />
                <div className="flex flex-wrap items-end gap-3">
                  <label>
                    <span className="etiquette">Délivré le</span>
                    <input
                      type="date"
                      value={dispenseLe}
                      onChange={(event) => setDispenseLe(event.target.value)}
                      className={cn(CHAMP, 'tabular mt-1 block')}
                    />
                  </label>
                  <label>
                    <span className="etiquette">Vérifié le</span>
                    <input
                      type="date"
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                      className={cn(CHAMP, 'tabular mt-1 block')}
                    />
                  </label>
                  <label>
                    <span className="etiquette">Reste en main</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <input
                        value={reste}
                        onChange={(event) => setReste(event.target.value)}
                        inputMode="decimal"
                        placeholder="0"
                        className={cn(CHAMP, 'tabular w-20')}
                      />
                      <span className="text-ink-3 text-[13.5px]">{galenique}</span>
                    </div>
                  </label>
                  <label>
                    <span className="etiquette">Durée prescrite (fac.)</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <input
                        value={duree}
                        onChange={(event) => setDuree(event.target.value)}
                        inputMode="numeric"
                        placeholder="90"
                        className={cn(CHAMP, 'tabular w-20')}
                      />
                      <span className="text-ink-3 text-[13.5px]">jours</span>
                    </div>
                  </label>
                </div>
                <p className="text-ink-3 mt-2 text-[12.5px]">
                  Le reste vaut zéro s'il est laissé vide : l'emballage est réputé terminé.
                  Le compter rend la consommation mesurée plutôt que supposée.
                </p>
              </Card>
            </div>

            {/* ---------------------------------------------------------- */}
            <div className="lg:sticky lg:top-0 lg:col-span-2">
              <Chiffres
                resultat={resultat}
                galenique={unite === 'unite' ? galenique : unite === 'dose' ? 'doses' : unite}
                duree={nombre(duree)}
                parEmballage={nombre(parEmballage)}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------------- */

/** Un écart se lit d'abord à son signe : « +12 » n'est pas « 12 ». */
function signe(n: number, decimales = 1): string {
  return (n > 0 ? '+' : '') + arrondi(n, decimales);
}

/**
 * Le résultat : des quantités, pas un jugement. Ni seuil, ni couleur, ni
 * phrase d'interprétation — décision produit : le pharmacien lit les
 * chiffres et conclut lui-même.
 */
function Chiffres({
  resultat,
  galenique,
  duree,
  parEmballage,
}: {
  resultat: ReturnType<typeof calculer>;
  galenique: string;
  duree: number;
  parEmballage: number;
}) {
  if (!resultat) {
    return (
      <Card>
        <CardHeader title="Résultat" />
        <p className="text-ink-3 text-[14px] leading-relaxed">
          Renseignez la quantité délivrée, la posologie et la date de délivrance.
        </p>
      </Card>
    );
  }

  const {
    total, parJour, joursCouverts, epuisementLe, joursEcoules,
    theorique, consomme, ecartQuantite, ecartJours, taux,
  } = resultat;
  const boites = emballagesPour(duree, parEmballage, parJour);
  // Avant la date de délivrance, il n'y a pas de période écoulée : les
  // quantités consommées n'ont rien à comparer.
  const periode = joursEcoules > 0;

  return (
    <Card>
      <CardHeader title="Résultat" />

      <p className="text-ink tabular text-[38px] leading-none font-semibold tracking-[-0.03em]">
        {arrondi(joursCouverts, joursCouverts < 100 ? 1 : 0)}
        <span className="text-ink-2 ml-2 text-[15px] font-normal">jours de traitement</span>
      </p>
      <p className="text-ink-2 mt-2 text-[14px]">
        Épuisement le <b className="tabular text-ink">{enSuisse(epuisementLe)}</b>
      </p>

      <dl className="border-line mt-4 flex flex-col gap-1.5 border-t pt-3">
        <Ligne terme="Délivré" valeur={`${arrondi(total)} ${galenique}`} />
        <Ligne terme="Posologie" valeur={`${arrondi(parJour, 3)} ${galenique} / jour`} />
        {boites !== null && (
          <Ligne
            terme={`Pour ${arrondi(duree, 0)} jours prescrits`}
            valeur={`${boites} emballage${boites > 1 ? 's' : ''}`}
          />
        )}
      </dl>

      {periode && (
        <>
          <p className="etiquette mt-4">Sur {arrondi(joursEcoules, 0)} jours écoulés</p>
          <dl className="border-line mt-1.5 flex flex-col gap-1.5 border-t pt-3">
            <Ligne
              terme="Théoriquement consommé"
              valeur={`${arrondi(theorique)} ${galenique}`}
            />
            <Ligne terme="Réellement consommé" valeur={`${arrondi(consomme)} ${galenique}`} />
            <Ligne
              terme="Écart"
              valeur={`${signe(ecartQuantite)} ${galenique}`}
              fort
            />
            <Ligne terme="Soit en traitement" valeur={`${signe(ecartJours)} jours`} fort />
            {taux !== null && (
              <Ligne terme="Taux de consommation" valeur={`${arrondi(taux * 100, 1)} %`} fort />
            )}
          </dl>
        </>
      )}
    </Card>
  );
}

function Ligne({ terme, valeur, fort = false }: { terme: string; valeur: string; fort?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn('text-[13.5px]', fort ? 'text-ink' : 'text-ink-2')}>{terme}</dt>
      <dd
        className={cn(
          'tabular text-ink shrink-0',
          fort ? 'text-[15px] font-semibold' : 'text-[14px] font-medium',
        )}
      >
        {valeur}
      </dd>
    </div>
  );
}
