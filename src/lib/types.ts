import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

/**
 * Une ressource : un lien OU un fichier, jamais les deux (contrainte SQL
 * `resource_target_exclusif`). `search_vector` est exclue — elle ne quitte
 * jamais Postgres.
 */
export type Resource = Omit<Tables['resources']['Row'], 'search_vector'>;

/** Champs pilotés par le formulaire. */
export type ResourceDraft = Pick<
  Resource,
  'title' | 'description' | 'url' | 'tags' | 'pinned' | 'verified_on' | 'owner'
> &
  Partial<Pick<Resource, 'file_path' | 'file_name' | 'file_size' | 'mime_type'>>;

export type SearchMiss = Tables['search_misses']['Row'];

/**
 * Une AUTORISATION Swissmedic : un numéro, une notice, un code ATC. Son nom
 * est le tronc commun de ceux de ses dosages (« Dafalgan, suppositoires ») ;
 * sa catégorie et ses principes actifs sont des agrégats — Swissmedic écrit
 * « B/D » quand ses dosages diffèrent.
 */
export type ProductRow = Tables['products']['Row'];

/**
 * Un DOSAGE (« Dosisstärke ») : Dafalgan supp 80, 150, 300 et 600 mg sont
 * quatre dosages d'une même autorisation. C'est le niveau qu'un pharmacien
 * désigne au comptoir, et celui que porte un code-barres.
 */
export type DosageRow = Tables['dosages']['Row'];

/** Une ligne de résultat de recherche : un dosage, et son autorisation. */
export type DosageHit = Database['public']['Functions']['search_dosages']['Returns'][number];

/** Un dosage tel que la fiche produit le reçoit de product_hit. */
export type Dosage = {
  dosage_nr: string;
  name: string;
  label: string | null;
  category: string | null;
  substances: string | null;
  delisted: boolean;
};

/** L'autorisation telle que product_hit et scan_gtin la renvoient. */
export type Product = {
  authorization_nr: string;
  name: string;
  company: string | null;
  atc_code: string | null;
  substances: string | null;
  category: string | null;
  /** Conditionnement de l'emballage scanné — null hors scan. */
  package_description: string | null;
  /** Dosage de l'emballage scanné — null hors scan. */
  dosage_nr: string | null;
};

/** Fiche : l'autorisation, ses dosages, ses ressources (produit + classe ATC). */
export type ScanHit = {
  product: Product;
  dosages: Dosage[];
  resources: Resource[];
};
