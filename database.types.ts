import { z } from "zod";
import { LogChangesTypes } from "./lib/types";

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
      lists: {
        Row: {
          created_at: string;
          id: string;
          last_ai_stream: string | null;
          last_pass_changed: string | null;
          listname: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_ai_stream?: string | null;
          last_pass_changed?: string | null;
          listname: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_ai_stream?: string | null;
          last_pass_changed?: string | null;
          listname?: string;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          changes: z.infer<typeof LogChangesTypes>;
          created_at: string;
          id: string;
          list: string | null;
          money: string | null;
          reason: string | null;
          type: string;
        };
        Insert: {
          changes?: z.infer<typeof LogChangesTypes>;
          created_at?: string;
          id?: string;
          list?: string | null;
          money?: string | null;
          reason?: string | null;
          type: string;
        };
        Update: {
          changes?: z.infer<typeof LogChangesTypes>;
          created_at?: string;
          id?: string;
          list?: string | null;
          money?: string | null;
          reason?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "logs_money_fkey";
            columns: ["money"];
            isOneToOne: false;
            referencedRelation: "moneys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "logs_user_fkey";
            columns: ["list"];
            isOneToOne: false;
            referencedRelation: "lists";
            referencedColumns: ["id"];
          },
        ];
      };
      moneys: {
        Row: {
          amount: number;
          color: string | null;
          created_at: string;
          id: string;
          list: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          amount?: number;
          color?: string | null;
          created_at?: string;
          id?: string;
          list?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          color?: string | null;
          created_at?: string;
          id?: string;
          list?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "moneys_user_fkey";
            columns: ["list"];
            isOneToOne: false;
            referencedRelation: "lists";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      getTotal: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
