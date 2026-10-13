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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      auction_registrations: {
        Row: {
          auction_id: string
          created_at: string
          emd_status: string
          user_id: string
        }
        Insert: {
          auction_id: string
          created_at?: string
          emd_status?: string
          user_id: string
        }
        Update: {
          auction_id?: string
          created_at?: string
          emd_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_registrations_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          balance_due_hours: number
          bid_count: number
          bid_step: number
          carpet_area: number
          city: string
          created_at: string
          created_by: string | null
          current_price: number
          current_winner: string | null
          description: string
          emd_amount: number
          ends_at: string
          extension_minutes: number
          id: string
          image_path: string | null
          locality: string
          property_type: string
          reserve_price: number
          starts_at: string
          status: string
          title: string
        }
        Insert: {
          balance_due_hours?: number
          bid_count?: number
          bid_step?: number
          carpet_area?: number
          city?: string
          created_at?: string
          created_by?: string | null
          current_price?: number
          current_winner?: string | null
          description?: string
          emd_amount?: number
          ends_at: string
          extension_minutes?: number
          id?: string
          image_path?: string | null
          locality?: string
          property_type?: string
          reserve_price: number
          starts_at: string
          status?: string
          title: string
        }
        Update: {
          balance_due_hours?: number
          bid_count?: number
          bid_step?: number
          carpet_area?: number
          city?: string
          created_at?: string
          created_by?: string | null
          current_price?: number
          current_winner?: string | null
          description?: string
          emd_amount?: number
          ends_at?: string
          extension_minutes?: number
          id?: string
          image_path?: string | null
          locality?: string
          property_type?: string
          reserve_price?: number
          starts_at?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          amount: number
          auction_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          auction_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          auction_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          owner_id: string | null
          phone: string | null
          property_id: string
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string
          name: string
          owner_id?: string | null
          phone?: string | null
          property_id: string
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          owner_id?: string | null
          phone?: string | null
          property_id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          kind: string
          provider_ref: string | null
          ref_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          kind: string
          provider_ref?: string | null
          ref_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          provider_ref?: string | null
          ref_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[]
          area: number
          baths: number
          beds: number
          city: string
          created_at: string
          description: string
          featured: boolean
          id: string
          image_key: string | null
          image_path: string | null
          locality: string
          owner_id: string | null
          price_display: string
          price_value: number
          purpose: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          amenities?: string[]
          area?: number
          baths?: number
          beds?: number
          city: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_key?: string | null
          image_path?: string | null
          locality?: string
          owner_id?: string | null
          price_display?: string
          price_value?: number
          purpose?: string
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          amenities?: string[]
          area?: number
          baths?: number
          beds?: number
          city?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_key?: string | null
          image_path?: string | null
          locality?: string
          owner_id?: string | null
          price_display?: string
          price_value?: number
          purpose?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      request_updates: {
        Row: {
          author_id: string
          created_at: string
          file_path: string | null
          from_team: boolean
          id: string
          message: string
          request_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          file_path?: string | null
          from_team?: boolean
          id?: string
          message?: string
          request_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          file_path?: string | null
          from_team?: boolean
          id?: string
          message?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          category: string
          created_at: string
          details: Json
          fee: number
          id: string
          paid: boolean
          ref_no: number
          service_slug: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          details?: Json
          fee?: number
          id?: string
          paid?: boolean
          ref_no?: never
          service_slug: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          details?: Json
          fee?: number
          id?: string
          paid?: boolean
          ref_no?: never
          service_slug?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_bid: {
        Args: { _amount: number; _auction: string }
        Returns: {
          balance_due_hours: number
          bid_count: number
          bid_step: number
          carpet_area: number
          city: string
          created_at: string
          created_by: string | null
          current_price: number
          current_winner: string | null
          description: string
          emd_amount: number
          ends_at: string
          extension_minutes: number
          id: string
          image_path: string | null
          locality: string
          property_type: string
          reserve_price: number
          starts_at: string
          status: string
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "auctions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
