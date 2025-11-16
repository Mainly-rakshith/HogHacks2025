export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          points: number
          debates_participated: number
          debates_won: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          points?: number
          debates_participated?: number
          debates_won?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          points?: number
          debates_participated?: number
          debates_won?: number
          created_at?: string
          updated_at?: string
        }
      }
      debates: {
        Row: {
          id: string
          topic: string
          description: string | null
          start_time: string
          end_time: string | null
          status: 'pending' | 'active' | 'voting' | 'completed'
          pro_points: number
          con_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          topic: string
          description?: string | null
          start_time: string
          end_time?: string | null
          status?: 'pending' | 'active' | 'voting' | 'completed'
          pro_points?: number
          con_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          status?: 'pending' | 'active' | 'voting' | 'completed'
          pro_points?: number
          con_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      debate_participants: {
        Row: {
          id: string
          debate_id: string
          user_id: string
          role: 'pro' | 'con' | 'voter'
          joined_at: string
        }
        Insert: {
          id?: string
          debate_id: string
          user_id: string
          role: 'pro' | 'con' | 'voter'
          joined_at?: string
        }
        Update: {
          id?: string
          debate_id?: string
          user_id?: string
          role?: 'pro' | 'con' | 'voter'
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          debate_id: string
          user_id: string
          content: string
          role: 'pro' | 'con' | 'voter' | 'system'
          is_ai_flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          debate_id: string
          user_id: string
          content: string
          role: 'pro' | 'con' | 'voter' | 'system'
          is_ai_flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          debate_id?: string
          user_id?: string
          content?: string
          role?: 'pro' | 'con' | 'voter' | 'system'
          is_ai_flagged?: boolean
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          debate_id: string
          user_id: string
          vote_pro: boolean
          created_at: string
        }
        Insert: {
          id?: string
          debate_id: string
          user_id: string
          vote_pro: boolean
          created_at?: string
        }
        Update: {
          id?: string
          debate_id?: string
          user_id?: string
          vote_pro?: boolean
          created_at?: string
        }
      }
    }
  }
}