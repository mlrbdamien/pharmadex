import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Calculator,
  Check,
  ListTree,
  Lock,
  Pill,
  ScanBarcode,
  Search,
  StickyNote,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Marque, cn } from '../components/ui';

/**
 * La vitrine : ce que voit un visiteur non connecté.
 *
 * Un seul objectif — dire ce qu'est Pharmadex, à qui il s'adresse, et mener
 * en un clic au formulaire de connexion. Elle ne touche à aucune donnée (la
 * sécurité reste dans la RLS) et ne s'affiche jamais au comptoir, dont le
 * compte partagé reste connecté : sa mise en page peut donc respirer plus
 * que la console, tout en gardant ses tokens pour que la connexion ne change
 * pas d'univers.
 *
 * Aucun chiffre vivant ici : la vitrine n'a pas accès à la base, et un
 * compteur figé dans la copie finit toujours par mentir.
 */

const BOUTON_PRIMAIRE =
  'bg-accent text-on-accent hover:bg-accent-hover rounded-control inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium';
const BOUTON_SECONDAIRE =
  'border-line-strong hover:bg-surface-2 text-ink rounded-control inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium';

type Fonction = { icone: LucideIcon; titre: string; texte: string };

/* Même ordre et mêmes icônes que le rail de l'application : ce que la
   vitrine promet, la console le montre au même endroit. */
const FONCTIONS: Fonction[] = [
  {
    icone: Search,
    titre: 'Une seule barre de recherche',
    texte:
      "Médicaments, fiches Sémaphore, ressources et notes maison dans la même liste, classée par pertinence. Les résultats tombent dès la première lettre ; ↑↓ parcourent, Entrée ouvre.",
  },
  {
    icone: ScanBarcode,
    titre: 'Scan de boîte',
    texte:
      "La douchette écrit dans la barre comme un clavier : un code-barres scanné ouvre la fiche du produit, avec les protocoles liés à ce produit ou à toute sa classe.",
  },
  {
    icone: Pill,
    titre: 'Fiche produit et notice',
    texte:
      "La notice s'affiche dans la fiche, avec un sommaire par rubrique : posologie, contre-indications, grossesse… en un clic. Le contenu reste chez Refdata, rien n'est copié.",
  },
  {
    icone: ListTree,
    titre: 'Catalogue ATC',
    texte:
      "Tous les médicaments autorisés en Suisse, d'après la liste Swissmedic mise à jour chaque mois, navigables par arborescence ATC en français et par catégorie de remise.",
  },
  {
    icone: BookOpen,
    titre: 'Sémaphore',
    texte:
      "Les fiches de comptoir qui signalent quoi faire : niveaux d'orientation N1–N4, blocs « ne pas délivrer », sources datées. De « Toux sèche / toux grasse » à « Anticoagulants oraux ».",
  },
  {
    icone: BookMarked,
    titre: 'Ressources du comptoir',
    texte:
      "Protocoles maison, PDF et liens officiels, épinglés et étiquetés. Un vérificateur hebdomadaire signale les liens cassés ; sans revérification depuis douze mois, une ressource le dit.",
  },
  {
    icone: StickyNote,
    titre: 'Notes et posologies maison',
    texte:
      "Sur un produit, une classe ATC ou un principe actif : la posologie maison copiable en un clic, l'avertissement qui remonte dans la recherche, le scan et le catalogue. Signées, datées.",
  },
  {
    icone: Calculator,
    titre: 'Calcul de dispensation',
    texte:
      "Couverture, date d'épuisement, avance ou retard, observance : les quantités, sans verdict. Rien n'est enregistré — une date de délivrance ne survit pas au rechargement de la page.",
  },
];

type Principe = { num: string; titre: string; texte: ReactNode };

const PRINCIPES: Principe[] = [
  {
    num: '01',
    titre: 'Plus rapide que Google',
    texte:
      "Le seul critère de réussite. Rien ne s'interpose entre taper et ouvrir : pas d'onboarding, pas d'écran intermédiaire, pas de « où est-ce que je cherche ? » avant la frappe.",
  },
  {
    num: '02',
    titre: 'Aucune donnée patient',
    texte:
      "Nulle part, par construction : pas de notes de cas, pas d'historique de délivrance, aucun champ qui décrirait une personne. Pharmadex parle de médicaments.",
  },
  {
    num: '03',
    titre: 'Sources suisses, vérifiées, datées',
    texte: (
      <>
        Swissmedic, AIPS, Liste des spécialités, Fedlex. Rien n'est écrit de mémoire : ce qui
        n'a pas pu être vérifié le dit — <span className="nv">non vérifié</span> — et
        compendium.ch fait foi, pas Pharmadex.
      </>
    ),
  },
];

const SOURCES = [
  {
    nom: 'Swissmedic',
    texte: 'Liste des médicaments à usage humain autorisés, reprise chaque mois.',
  },
  {
    nom: 'AIPS · Refdata',
    texte:
      'Notices et informations professionnelles, affichées sans copie ; dénominations officielles en français et prix publics.',
  },
  {
    nom: 'OFSP',
    texte: 'Liste des spécialités : remboursement et prix, toujours datés.',
  },
  {
    nom: 'Fedlex',
    texte: 'LPTh, OMéd, LAMal, OCStup : le cadre légal que citent les fiches du Sémaphore.',
  },
];

/* Aperçu figé de la palette de recherche. Décoratif et volontairement
   inerte : il montre le geste (un mot, quatre types de réponses, Entrée)
   sans exposer une seule ligne de la base. */
const APERCU = [
  {
    type: 'Sémaphore',
    classe: 'bg-accent-soft text-accent',
    titre: 'Toux sèche / toux grasse',
    detail: 'Voies respiratoires · orientation N1–N4',
  },
  {
    type: 'Médicament',
    classe: 'bg-surface-2 text-ink-2',
    titre: 'Dextrométhorphane',
    detail: 'R05DA09 · antitussifs',
  },
  {
    type: 'Ressource',
    classe: 'bg-info-soft text-info-text',
    titre: "Toux de l'enfant — protocole maison",
    detail: 'PDF · vérifié il y a deux mois',
  },
  {
    type: 'Note',
    classe: 'bg-warning-soft text-warning-text',
    titre: 'Posologie maison — sirop antitussif',
    detail: 'Principe actif · signée, datée',
  },
];

function Touche({ children }: { children: ReactNode }) {
  return (
    <kbd className="border-line bg-surface-1 text-ink-2 rounded border px-1 font-mono text-[10px]">
      {children}
    </kbd>
  );
}

function ApercuRecherche() {
  return (
    // `min-w-0` : les titres tronqués sont insécables, et sans lui la piste de
    // grille s'élargit à leur mesure au lieu de les laisser se tronquer.
    <div className="relative min-w-0">
      <p className="sr-only">
        Aperçu de la recherche : le mot « toux » tapé renvoie une fiche Sémaphore, un médicament,
        une ressource et une note maison, dans la même liste.
      </p>
      <div
        aria-hidden
        className="rounded-card border-line bg-surface-1 shadow-modal overflow-hidden border"
      >
        <div className="border-line flex items-center gap-2.5 border-b px-3.5 py-3">
          <Search className="text-ink-3 size-4 shrink-0" />
          <span className="text-ink text-[15px]">toux</span>
          <span className="bg-accent h-4 w-px animate-pulse motion-reduce:animate-none" />
          <span className="etiquette ml-auto">4 réponses</span>
        </div>
        <ul className="divide-line divide-y">
          {APERCU.map((r, i) => (
            <li
              key={r.type}
              className={cn('flex items-center gap-3 px-3.5 py-2.5', i === 0 && 'bg-accent-soft/60')}
            >
              <span
                className={cn(
                  'w-[86px] shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold tracking-wide uppercase',
                  r.classe,
                )}
              >
                {r.type}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block truncate text-sm font-medium">{r.titre}</span>
                <span className="text-ink-3 donnee block truncate text-[11px]">{r.detail}</span>
              </span>
              {i === 0 && <Touche>↵</Touche>}
            </li>
          ))}
        </ul>
        <div className="bg-surface-2 text-ink-3 flex items-center gap-3 px-3.5 py-2 text-[11px]">
          <span className="flex items-center gap-1">
            <Touche>↑↓</Touche> parcourir
          </span>
          <span className="flex items-center gap-1">
            <Touche>↵</Touche> ouvrir
          </span>
          <span className="flex items-center gap-1">
            <Touche>Échap</Touche> fermer
          </span>
        </div>
      </div>
    </div>
  );
}

function CarteFonction({ icone: Icone, titre, texte }: Fonction) {
  return (
    <article className="rounded-card border-line bg-surface-1 shadow-card border p-5">
      <Icone className="text-accent size-5" aria-hidden />
      <h3 className="text-ink mt-4 font-semibold">{titre}</h3>
      <p className="text-ink-2 mt-2 text-sm leading-relaxed">{texte}</p>
    </article>
  );
}

function Titre({ etiquette, children }: { etiquette: string; children: ReactNode }) {
  return (
    <>
      <p className="etiquette">{etiquette}</p>
      <h2 className="text-ink mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-balance md:text-3xl">
        {children}
      </h2>
    </>
  );
}

export function Vitrine() {
  return (
    <div className="min-h-dvh">
      <header className="border-line bg-page/85 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <a href="#haut" className="flex items-center gap-2.5">
            <Marque />
            <span className="text-accent text-[17px] font-semibold tracking-[-0.015em]">
              Pharmadex
            </span>
          </a>
          <nav className="text-ink-2 hidden items-center gap-6 text-sm md:flex" aria-label="Sections">
            <a href="#fonctions" className="hover:text-ink">
              Fonctions
            </a>
            <a href="#principes" className="hover:text-ink">
              Principes
            </a>
            <a href="#sources" className="hover:text-ink">
              Sources
            </a>
            <a href="#acces" className="hover:text-ink">
              Accès
            </a>
          </nav>
          <Link to="/connexion" className={BOUTON_PRIMAIRE}>
            Se connecter
          </Link>
        </div>
      </header>

      <main id="haut">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0">
              <p className="etiquette">Outil de comptoir · officine suisse</p>
              <h1 className="text-ink mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                Les références du comptoir,{' '}
                <span className="text-accent">plus vite que Google.</span>
              </h1>
              <p className="text-ink-2 mt-5 max-w-xl text-lg text-pretty">
                Médicaments autorisés en Suisse, notices, fiches Sémaphore, protocoles maison et
                liens officiels : une seule barre de recherche, une réponse dès la première
                lettre, une boîte scannée qui ouvre sa fiche.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/connexion" className={BOUTON_PRIMAIRE}>
                  Se connecter
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a href="#fonctions" className={BOUTON_SECONDAIRE}>
                  Découvrir l'outil
                </a>
              </div>
              <ul className="text-ink-2 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {['Aucune donnée patient', 'Sources suisses, datées', 'Accès sur invitation'].map(
                  (point) => (
                    <li key={point} className="flex items-center gap-1.5">
                      <Check className="text-accent size-4" aria-hidden />
                      {point}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <ApercuRecherche />
          </div>
        </section>

        <section id="fonctions" className="border-line bg-surface-2/60 scroll-mt-14 border-y py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Titre etiquette="Fonctions">
              Tout ce qu'on cherche pendant un conseil, au même endroit.
            </Titre>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {FONCTIONS.map((f) => (
                <CarteFonction key={f.titre} {...f} />
              ))}
            </div>
          </div>
        </section>

        <section id="principes" className="scroll-mt-14 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Titre etiquette="Principes">
              Trois règles, tenues par l'architecture plutôt que par une consigne.
            </Titre>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {PRINCIPES.map((p) => (
                <div key={p.num}>
                  <p className="donnee text-accent text-sm">{p.num}</p>
                  <h3 className="text-ink mt-3 text-lg font-semibold">{p.titre}</h3>
                  <p className="text-ink-2 mt-2 leading-relaxed">{p.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sources" className="border-line bg-surface-2/60 scroll-mt-14 border-y py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Titre etiquette="Sources">Des données publiques, jamais recopiées.</Titre>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SOURCES.map((s) => (
                <div key={s.nom} className="border-accent border-l-2 pl-4">
                  <dt className="text-ink font-semibold">{s.nom}</dt>
                  <dd className="text-ink-2 mt-1 text-sm leading-relaxed">{s.texte}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="acces" className="scroll-mt-14 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-card border-line bg-surface-1 shadow-card flex flex-col gap-8 border p-6 md:flex-row md:items-center md:p-10">
              <div className="flex-1">
                <p className="etiquette flex items-center gap-1.5">
                  <Lock size={12} strokeWidth={2} aria-hidden />
                  Accès
                </p>
                <h2 className="text-ink mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  Sur invitation.
                </h2>
                <p className="text-ink-2 mt-3 max-w-2xl leading-relaxed">
                  Pharmadex est l'outil interne d'une officine. Les comptes sont ouverts par le
                  responsable de l'outil : pas d'inscription, pas de lien magique, aucun
                  e-mail — une adresse, un mot de passe, et le poste reste connecté.
                </p>
                <p className="text-ink-2 mt-3 max-w-2xl leading-relaxed">
                  Vous faites partie de l'équipe et n'avez pas encore d'accès ? Adressez-vous au
                  responsable de l'outil.
                </p>
              </div>
              <Link to="/connexion" className={cn(BOUTON_PRIMAIRE, 'self-start md:self-center')}>
                Se connecter
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-line border-t py-10">
        <div className="text-ink-3 mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm md:flex-row md:items-start md:justify-between">
          <p className="flex items-center gap-2">
            <Marque className="size-5 rounded-[5px]" />
            Pharmadex — outil interne d'officine, Suisse.
          </p>
          <p className="max-w-xl md:text-right">
            Une aide au conseil, pas une référence : compendium.ch et le logiciel d'officine font
            foi. Pas de traceur ni de mesure d'audience.
          </p>
        </div>
      </footer>
    </div>
  );
}
