-- ============================================================================
-- Pharmadex — marquage des produits retirés du marché
--
-- L'import ne supprime jamais un produit : des boîtes circulent encore, un
-- scan doit les reconnaître, et une suppression emporterait les liaisons
-- (product_resources est en ON DELETE CASCADE). Un produit absent du fichier
-- Swissmedic est donc MARQUÉ retiré — et re-démarqué s'il revient.
--
-- Les emballages et les notices, eux, se suppriment sans risque (aucune
-- donnée d'officine ne s'y rattache) : le workflow les purge quand ils
-- disparaissent de la source, sous garde-fou de volume.
-- ============================================================================

alter table public.products
  add column if not exists delisted boolean not null default false;
