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
      [_ in never]: never
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
