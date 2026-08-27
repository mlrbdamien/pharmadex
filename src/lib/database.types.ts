/**
 * Reflet TypeScript de `supabase/migrations/0001_init.sql`, écrit à la main.
 *
 * À régénérer plutôt qu'à retoucher dès que le schéma bouge :
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 */

type ResourceRow = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  tags: string[];
  pinned: boolean;
  verified_on: string | null;
  owner: string | null;
  broken: boolean;
  last_checked_at: string | null;
  last_status: number | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  /** Colonne générée : jamais lue côté navigateur, jamais écrite. */
  search_vector: unknown;
};

export type Database = {
  public: {
    Tables: {
      allowed_emails: {
        Row: { email: string; label: string | null; can_edit: boolean; created_at: string };
        Insert: { email: string; label?: string | null; can_edit?: boolean };
        Update: { email?: string; label?: string | null; can_edit?: boolean };
        Relationships: [];
      };
      resources: {
        Row: ResourceRow;
        Insert: Omit<ResourceRow, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'search_vector'> extends infer T
          ? { [K in keyof T]?: T[K] } & { title: string }
          : never;
        Update: Partial<Omit<ResourceRow, 'search_vector'>>;
        Relationships: [];
      };
      tags: {
        Row: { name: string; created_at: string };
        Insert: { name: string; created_at?: string };
        Update: { name?: string };
        Relationships: [];
      };
      search_misses: {
        Row: {
          term: string;
          hits: number;
          first_seen: string;
          last_seen: string;
          is_code: boolean;
        };
        Insert: { term: string; hits?: number };
        Update: { hits?: number; last_seen?: string };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      search_resources: { Args: { q: string }; Returns: ResourceRow[] };
      log_search_miss: { Args: { q: string }; Returns: undefined };
      is_allowed: { Args: Record<never, never>; Returns: boolean };
      can_edit: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
