export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "admin" | "member" | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "member" | null;
          created_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["profiles"]["Insert"]
        >;
      };
    };
    Views: {};
    Functions: {};
  };
};
