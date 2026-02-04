export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      artist: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      awards: {
        Row: {
          artist_id: number | null
          award: string
          category: string
          date: string
          id: number
          img: string | null
          link: string | null
          link2: string | null
          note: string | null
          result: string
        }
        Insert: {
          artist_id?: number | null
          award: string
          category: string
          date: string
          id?: number
          img?: string | null
          link?: string | null
          link2?: string | null
          note?: string | null
          result: string
        }
        Update: {
          artist_id?: number | null
          award?: string
          category?: string
          date?: string
          id?: number
          img?: string | null
          link?: string | null
          link2?: string | null
          note?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "awards_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar: {
        Row: {
          artist_id: number
          datetimetz: string
          dmd: string | null
          hashtag: string | null
          id: number
          info_link: string | null
          keyword: string | null
          live_platform: string | null
          location: string | null
          name: string
          note: string | null
          outfit: string | null
          outfit_img: string | null
          poster_url: string | null
          rerun_link: string | null
        }
        Insert: {
          artist_id: number
          datetimetz: string
          dmd?: string | null
          hashtag?: string | null
          id?: number
          info_link?: string | null
          keyword?: string | null
          live_platform?: string | null
          location?: string | null
          name: string
          note?: string | null
          outfit?: string | null
          outfit_img?: string | null
          poster_url?: string | null
          rerun_link?: string | null
        }
        Update: {
          artist_id?: number
          datetimetz?: string
          dmd?: string | null
          hashtag?: string | null
          id?: number
          info_link?: string | null
          keyword?: string | null
          live_platform?: string | null
          location?: string | null
          name?: string
          note?: string | null
          outfit?: string | null
          outfit_img?: string | null
          poster_url?: string | null
          rerun_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          artist_id: number
          date: string
          id: number
          img: string | null
          link: string | null
          name: string
          type: string | null
        }
        Insert: {
          artist_id: number
          date: string
          id?: number
          img?: string | null
          link?: string | null
          name: string
          type?: string | null
        }
        Update: {
          artist_id?: number
          date?: string
          id?: number
          img?: string | null
          link?: string | null
          name?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contents_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      discography: {
        Row: {
          artist_id: number
          date: string
          id: number
          img: string | null
          mv: string | null
          note: string | null
          streaming: string | null
          title: string
        }
        Insert: {
          artist_id: number
          date: string
          id?: number
          img?: string | null
          mv?: string | null
          note?: string | null
          streaming?: string | null
          title: string
        }
        Update: {
          artist_id?: number
          date?: string
          id?: number
          img?: string | null
          mv?: string | null
          note?: string | null
          streaming?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "discography_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      endorsements: {
        Row: {
          artist_id: number
          category: string | null
          date: string
          id: number
          img: string | null
          link: string | null
          name: string
          position: string | null
        }
        Insert: {
          artist_id: number
          category?: string | null
          date: string
          id?: number
          img?: string | null
          link?: string | null
          name: string
          position?: string | null
        }
        Update: {
          artist_id?: number
          category?: string | null
          date?: string
          id?: number
          img?: string | null
          link?: string | null
          name?: string
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "endorsements_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      filmography: {
        Row: {
          artist_id: number
          date: string
          id: number
          poster: string | null
          rerun_link: string | null
          role_por: string | null
          role_teetee: string | null
          status: string | null
          title: string
        }
        Insert: {
          artist_id: number
          date: string
          id?: number
          poster?: string | null
          rerun_link?: string | null
          role_por?: string | null
          role_teetee?: string | null
          status?: string | null
          title: string
        }
        Update: {
          artist_id?: number
          date?: string
          id?: number
          poster?: string | null
          rerun_link?: string | null
          role_por?: string | null
          role_teetee?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "filmography_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      filmographydetail: {
        Row: {
          bts_id: string | null
          content_id: string | null
          filmography_id: number | null
          fullep_id: string | null
          hashtag: string | null
          highlight_id: string | null
          id: number
          ost_id: string | null
          por_img: string | null
          reaction_id: string | null
          synopsis: string | null
          teetee_img: string | null
          trailer_id: string | null
        }
        Insert: {
          bts_id?: string | null
          content_id?: string | null
          filmography_id?: number | null
          fullep_id?: string | null
          hashtag?: string | null
          highlight_id?: string | null
          id?: number
          ost_id?: string | null
          por_img?: string | null
          reaction_id?: string | null
          synopsis?: string | null
          teetee_img?: string | null
          trailer_id?: string | null
        }
        Update: {
          bts_id?: string | null
          content_id?: string | null
          filmography_id?: number | null
          fullep_id?: string | null
          hashtag?: string | null
          highlight_id?: string | null
          id?: number
          ost_id?: string | null
          por_img?: string | null
          reaction_id?: string | null
          synopsis?: string | null
          teetee_img?: string | null
          trailer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmographydetail_filmography_id_fkey"
            columns: ["filmography_id"]
            isOneToOne: true
            referencedRelation: "filmography"
            referencedColumns: ["id"]
          },
        ]
      }
      filmographytrends: {
        Row: {
          air_date: string
          episode: string | null
          filmography_id: number
          hashtag: string | null
          id: number
          location_count: string | null
          posts: string | null
          rank_th: string | null
          rank_ww: string | null
          source_link: string | null
        }
        Insert: {
          air_date: string
          episode?: string | null
          filmography_id: number
          hashtag?: string | null
          id?: number
          location_count?: string | null
          posts?: string | null
          rank_th?: string | null
          rank_ww?: string | null
          source_link?: string | null
        }
        Update: {
          air_date?: string
          episode?: string | null
          filmography_id?: number
          hashtag?: string | null
          id?: number
          location_count?: string | null
          posts?: string | null
          rank_th?: string | null
          rank_ww?: string | null
          source_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmographytrends_filmography_id_fkey"
            columns: ["filmography_id"]
            isOneToOne: false
            referencedRelation: "filmography"
            referencedColumns: ["id"]
          },
        ]
      }
      magazines: {
        Row: {
          article_link: string | null
          artist_id: number | null
          date: string
          id: number
          img: string | null
          issue: string | null
          name: string
          promo_link: string | null
        }
        Insert: {
          article_link?: string | null
          artist_id?: number | null
          date: string
          id?: number
          img?: string | null
          issue?: string | null
          name: string
          promo_link?: string | null
        }
        Update: {
          article_link?: string | null
          artist_id?: number | null
          date?: string
          id?: number
          img?: string | null
          issue?: string | null
          name?: string
          promo_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magazines_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      performance: {
        Row: {
          artist_id: number
          date: string
          id: number
          img: string | null
          link: string | null
          note: string | null
          title: string
          type: string | null
        }
        Insert: {
          artist_id: number
          date: string
          id?: number
          img?: string | null
          link?: string | null
          note?: string | null
          title: string
          type?: string | null
        }
        Update: {
          artist_id?: number
          date?: string
          id?: number
          img?: string | null
          link?: string | null
          note?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
