-- Tags de départ. Les tags restent libres : celui-ci n'est qu'un amorçage
-- pour que l'autocomplétion ne parte pas d'une page blanche.
insert into public.tags (name) values
  ('grossesse'),
  ('allaitement'),
  ('pédiatrie'),
  ('infectiologie'),
  ('interactions'),
  ('protocole-maison'),
  ('admin')
on conflict (name) do nothing;
