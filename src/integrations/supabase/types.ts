export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_configurations: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          skills: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          name: string
          skills?: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          skills?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      analysis_results: {
        Row: {
          agent_id: string
          analysis_data: Json
          article_id: string
          confidence_score: number | null
          created_at: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          analysis_data?: Json
          article_id: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          analysis_data?: Json
          article_id?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      botanical_families: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cloud_provider_metrics: {
        Row: {
          availability: Json | null
          capacity: Json | null
          id: string
          last_updated: string | null
          lat: number
          lng: number
          location_name: string
          performance: number | null
          provider: string
          services: Json | null
          sustainability: Json | null
          type: string
        }
        Insert: {
          availability?: Json | null
          capacity?: Json | null
          id?: string
          last_updated?: string | null
          lat: number
          lng: number
          location_name: string
          performance?: number | null
          provider: string
          services?: Json | null
          sustainability?: Json | null
          type: string
        }
        Update: {
          availability?: Json | null
          capacity?: Json | null
          id?: string
          last_updated?: string | null
          lat?: number
          lng?: number
          location_name?: string
          performance?: number | null
          provider?: string
          services?: Json | null
          sustainability?: Json | null
          type?: string
        }
        Relationships: []
      }
      extracted_articles: {
        Row: {
          author: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          published: string | null
          source: string | null
          title: string | null
          ttr: number | null
          url: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          published?: string | null
          source?: string | null
          title?: string | null
          ttr?: number | null
          url?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          published?: string | null
          source?: string | null
          title?: string | null
          ttr?: number | null
          url?: string | null
        }
        Relationships: []
      }
      planting_dates: {
        Row: {
          created_at: string
          id: string
          plant_id: string | null
          sowing_dates: string
          updated_at: string
          zone: string
        }
        Insert: {
          created_at?: string
          id?: string
          plant_id?: string | null
          sowing_dates: string
          updated_at?: string
          zone: string
        }
        Update: {
          created_at?: string
          id?: string
          plant_id?: string | null
          sowing_dates?: string
          updated_at?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "planting_dates_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          binomial_name: string
          botanical_family_id: string | null
          category: Database["public"]["Enums"]["plant_category"]
          created_at: string
          description: string
          genus: string
          height: number | null
          id: string
          name: string
          sowing_method: string
          species: string
          sun_requirements: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          binomial_name: string
          botanical_family_id?: string | null
          category: Database["public"]["Enums"]["plant_category"]
          created_at?: string
          description: string
          genus: string
          height?: number | null
          id?: string
          name: string
          sowing_method: string
          species: string
          sun_requirements: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          binomial_name?: string
          botanical_family_id?: string | null
          category?: Database["public"]["Enums"]["plant_category"]
          created_at?: string
          description?: string
          genus?: string
          height?: number | null
          id?: string
          name?: string
          sowing_method?: string
          species?: string
          sun_requirements?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plants_botanical_family_id_fkey"
            columns: ["botanical_family_id"]
            isOneToOne: false
            referencedRelation: "botanical_families"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      short_squeeze_candidates: {
        Row: {
          company_name: string | null
          created_at: string | null
          days_to_cover: number | null
          distance_from_high: number | null
          id: string
          price_momentum: number | null
          relative_volume: number | null
          rsi: number | null
          short_interest_ratio: number | null
          symbol: string
          updated_at: string | null
          volume_surge: number | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          days_to_cover?: number | null
          distance_from_high?: number | null
          id?: string
          price_momentum?: number | null
          relative_volume?: number | null
          rsi?: number | null
          short_interest_ratio?: number | null
          symbol: string
          updated_at?: string | null
          volume_surge?: number | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          days_to_cover?: number | null
          distance_from_high?: number | null
          id?: string
          price_momentum?: number | null
          relative_volume?: number | null
          rsi?: number | null
          short_interest_ratio?: number | null
          symbol?: string
          updated_at?: string | null
          volume_surge?: number | null
        }
        Relationships: []
      }
      stock_data: {
        Row: {
          average_volume: number | null
          company_name: string | null
          created_at: string | null
          current_price: number | null
          days_to_cover: number | null
          id: string
          last_updated: string | null
          previous_close: number | null
          short_interest_ratio: number | null
          short_interest_volume: number | null
          symbol: string
        }
        Insert: {
          average_volume?: number | null
          company_name?: string | null
          created_at?: string | null
          current_price?: number | null
          days_to_cover?: number | null
          id?: string
          last_updated?: string | null
          previous_close?: number | null
          short_interest_ratio?: number | null
          short_interest_volume?: number | null
          symbol: string
        }
        Update: {
          average_volume?: number | null
          company_name?: string | null
          created_at?: string | null
          current_price?: number | null
          days_to_cover?: number | null
          id?: string
          last_updated?: string | null
          previous_close?: number | null
          short_interest_ratio?: number | null
          short_interest_volume?: number | null
          symbol?: string
        }
        Relationships: []
      }
      stock_metadata: {
        Row: {
          created_at: string | null
          id: number
          type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: number
          type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      stock_screener: {
        Row: {
          avg_volume: number | null
          company_name: string | null
          dividend_yield: number | null
          fifty_day_ma: number | null
          id: string
          industry: string | null
          last_updated: string | null
          market_cap: number | null
          pe_ratio: number | null
          price_to_book: number | null
          sector: string | null
          symbol: string
          two_hundred_day_ma: number | null
          volume: number | null
          year_high: number | null
          year_low: number | null
        }
        Insert: {
          avg_volume?: number | null
          company_name?: string | null
          dividend_yield?: number | null
          fifty_day_ma?: number | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          market_cap?: number | null
          pe_ratio?: number | null
          price_to_book?: number | null
          sector?: string | null
          symbol: string
          two_hundred_day_ma?: number | null
          volume?: number | null
          year_high?: number | null
          year_low?: number | null
        }
        Update: {
          avg_volume?: number | null
          company_name?: string | null
          dividend_yield?: number | null
          fifty_day_ma?: number | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          market_cap?: number | null
          pe_ratio?: number | null
          price_to_book?: number | null
          sector?: string | null
          symbol?: string
          two_hundred_day_ma?: number | null
          volume?: number | null
          year_high?: number | null
          year_low?: number | null
        }
        Relationships: []
      }
      trade_data: {
        Row: {
          commodity_code: string
          commodity_desc: string
          created_at: string
          id: string
          partner_code: string
          partner_desc: string
          qty: number | null
          qty_unit: string | null
          ref_year: number
          reporter_code: string
          reporter_desc: string
          trade_flow_code: number
          trade_flow_desc: string
          trade_value: number
          updated_at: string
        }
        Insert: {
          commodity_code: string
          commodity_desc: string
          created_at?: string
          id?: string
          partner_code: string
          partner_desc: string
          qty?: number | null
          qty_unit?: string | null
          ref_year: number
          reporter_code: string
          reporter_desc: string
          trade_flow_code: number
          trade_flow_desc: string
          trade_value: number
          updated_at?: string
        }
        Update: {
          commodity_code?: string
          commodity_desc?: string
          created_at?: string
          id?: string
          partner_code?: string
          partner_desc?: string
          qty?: number | null
          qty_unit?: string | null
          ref_year?: number
          reporter_code?: string
          reporter_desc?: string
          trade_flow_code?: number
          trade_flow_desc?: string
          trade_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          cityname: string
          created_at: string
          humidity: number
          id: string
          province: string
          temperature: number
          updated_at: string
        }
        Insert: {
          cityname: string
          created_at?: string
          humidity: number
          id?: string
          province: string
          temperature: number
          updated_at?: string
        }
        Update: {
          cityname?: string
          created_at?: string
          humidity?: number
          id?: string
          province?: string
          temperature?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plant_category:
        | "root_vegetable"
        | "leafy_green"
        | "fruiting_vegetable"
        | "brassica"
        | "legume"
        | "allium"
        | "herb"
        | "fruit_bush"
        | "climbing_vegetable"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
