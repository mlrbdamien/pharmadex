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
        Row: {
          email: string;
          label: string | null;
          can_edit: boolean;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          email: string;
          label?: string | null;
          can_edit?: boolean;
          is_admin?: boolean;
        };
        Update: {
          email?: string;
          label?: string | null;
          can_edit?: boolean;
          is_admin?: boolean;
        };
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
      products: {
        Row: {
          authorization_nr: string;
          name: string;
          company: string | null;
          atc_code: string | null;
          substances: string | null;
          category: string | null;
          name_fr: string | null;
          fr_source: string | null;
          delisted: boolean;
          imported_at: string;
        };
        Insert: never; // rempli par l'import (service_role) uniquement
        Update: never;
        Relationships: [];
      };
      packages: {
        Row: {
          gtin: string;
          authorization_nr: string;
          pack_code: string;
          description: string | null;
          description_fr: string | null;
          price_public: number | null;
          pharmacode: string | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      product_resources: {
        Row: { authorization_nr: string; resource_id: string; created_at: string };
        Insert: { authorization_nr: string; resource_id: string };
        Update: never;
        Relationships: [];
      };
      atc_resources: {
        Row: { atc_prefix: string; resource_id: string; created_at: string };
        Insert: { atc_prefix: string; resource_id: string };
        Update: never;
        Relationships: [];
      };
      notices: {
        Row: {
          authorization_nr: string;
          doc_type: string;
          lang: string;
          description: string | null;
          html_url: string;
          pdf_url: string | null;
          updated_on: string | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      product_notes: {
        Row: {
          id: string;
          authorization_nr: string | null;
          atc_prefix: string | null;
          substance: string | null;
          fiche_id: string | null;
          note_type: string;
          body: string;
          verified_on: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          authorization_nr?: string | null;
          atc_prefix?: string | null;
          substance?: string | null;
          fiche_id?: string | null;
          note_type: string;
          body: string;
          verified_on?: string;
        };
        Update: {
          note_type?: string;
          body?: string;
          verified_on?: string;
        };
        Relationships: [];
      };
      journal: {
        Row: {
          id: number;
          cible: string;
          cible_id: string | null;
          action: string;
          resume: string | null;
          acteur: string | null;
          at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      fiches: {
        Row: {
          id: string;
          code: string;
          groupe: string;
          titre: string;
          sous: string;
          volet: string;
          remise: string | null;
          atc: string[];
          sections: unknown;
          rang: number;
          verifie_le: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id: string;
          code: string;
          groupe: string;
          titre: string;
          sous?: string;
          volet: string;
          remise?: string | null;
          atc?: string[];
          sections?: unknown;
          rang?: number;
          verifie_le?: string;
        };
        Update: {
          code?: string;
          groupe?: string;
          titre?: string;
          sous?: string;
          volet?: string;
          remise?: string | null;
          atc?: string[];
          sections?: unknown;
          rang?: number;
          verifie_le?: string;
          updated_at?: string;
        };
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
      scan_gtin: { Args: { code: string }; Returns: unknown };
      product_hit: { Args: { auth: string }; Returns: unknown };
      search_products: {
        Args: { q: string };
        Returns: Database['public']['Tables']['products']['Row'][];
      };
      resolve_codes: {
        Args: { codes: string[] };
        Returns: { code: string; name: string; authorization_nr: string }[];
      };
      resource_links: { Args: { rid: string }; Returns: unknown };
      log_search_miss: { Args: { q: string }; Returns: undefined };
      is_allowed: { Args: Record<never, never>; Returns: boolean };
      can_edit: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
