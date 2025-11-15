export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      automation_logs: {
        Row: {
          created_at: string | null;
          details: Json | null;
          event: string;
          id: number;
        };
        Insert: {
          created_at?: string | null;
          details?: Json | null;
          event: string;
          id?: number;
        };
        Update: {
          created_at?: string | null;
          details?: Json | null;
          event?: string;
          id?: number;
        };
        Relationships: [];
      };
      claims: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          metadata: Json | null;
          plan: string | null;
          redeemed_at: string | null;
          status: string | null;
          token: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          metadata?: Json | null;
          plan?: string | null;
          redeemed_at?: string | null;
          status?: string | null;
          token?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          metadata?: Json | null;
          plan?: string | null;
          redeemed_at?: string | null;
          status?: string | null;
          token?: string | null;
        };
        Relationships: [];
      };
      deliveries: {
        Row: {
          channel: "email" | "telegram";
          delivered_at: string | null;
          email: string;
          id: string;
          signal_id: string | null;
        };
        Insert: {
          channel?: "email" | "telegram";
          delivered_at?: string | null;
          email: string;
          id?: string;
          signal_id?: string | null;
        };
        Update: {
          channel?: "email" | "telegram";
          delivered_at?: string | null;
          email?: string;
          id?: string;
          signal_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "deliveries_signal_id_fkey";
            columns: ["signal_id"];
            referencedRelation: "signals";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"] | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
        };
        Relationships: [];
      };
      signals: {
        Row: {
          audience: "basic" | "pro" | "vip";
          content: string | null;
          created_at: string | null;
          entry: string | null;
          id: string;
          pair: string | null;
          risk: string | null;
          scheduled_at: string;
          sent_at: string | null;
          status: "queued" | "sent" | "canceled";
          symbol: string | null;
          title: string | null;
          tp1: string | null;
          tp2: string | null;
          sl: string | null;
          type: string | null;
        };
        Insert: {
          audience: "basic" | "pro" | "vip";
          content?: string | null;
          created_at?: string | null;
          entry?: string | null;
          id?: string;
          pair?: string | null;
          risk?: string | null;
          scheduled_at?: string;
          sent_at?: string | null;
          status?: "queued" | "sent" | "canceled";
          symbol?: string | null;
          title?: string | null;
          tp1?: string | null;
          tp2?: string | null;
          sl?: string | null;
          type?: string | null;
        };
        Update: {
          audience?: "basic" | "pro" | "vip";
          content?: string | null;
          created_at?: string | null;
          entry?: string | null;
          id?: string;
          pair?: string | null;
          risk?: string | null;
          scheduled_at?: string;
          sent_at?: string | null;
          status?: "queued" | "sent" | "canceled";
          symbol?: string | null;
          title?: string | null;
          tp1?: string | null;
          tp2?: string | null;
          sl?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          ends_at: string;
          id: string;
          member_id: string;
          period: "monthly" | "yearly";
          plan: "basic" | "pro" | "vip";
          provider: string | null;
          provider_ref: string | null;
          starts_at: string;
          status: "active" | "canceled" | "expired";
          updated_at: string | null;
        };
        Insert: {
          ends_at: string;
          id?: string;
          member_id: string;
          period?: "monthly" | "yearly";
          plan: "basic" | "pro" | "vip";
          provider?: string | null;
          provider_ref?: string | null;
          starts_at: string;
          status?: "active" | "canceled" | "expired";
          updated_at?: string | null;
        };
        Update: {
          ends_at?: string;
          id?: string;
          member_id?: string;
          period?: "monthly" | "yearly";
          plan?: "basic" | "pro" | "vip";
          provider?: string | null;
          provider_ref?: string | null;
          starts_at?: string;
          status?: "active" | "canceled" | "expired";
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      active_subscribers_for_audience: {
        Args: {
          p_audience: string;
        };
        Returns: {
          email: string | null;
        }[];
      };
    };
    Enums: {
      user_role: "admin" | "member";
    };
    CompositeTypes: {
      [key: string]: never;
    };
  };
};
