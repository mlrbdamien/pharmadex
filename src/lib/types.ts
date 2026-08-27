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

/** Produit Swissmedic identifié par un scan. */
export type Product = {
  authorization_nr: string;
  name: string;
  company: string | null;
  atc_code: string | null;
  substances: string | null;
  category: string | null;
  /** Conditionnement de l'emballage précis qui a été scanné. */
  package_description: string | null;
};

/** Résultat d'un scan : le produit et les ressources liées (produit + classe ATC). */
export type ScanHit = {
  product: Product;
  resources: Resource[];
};
