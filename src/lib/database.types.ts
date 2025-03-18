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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          team: string | null
          location: string | null
          role: 'employee' | 'manager' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          team?: string | null
          location?: string | null
          role?: 'employee' | 'manager' | 'admin'
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          team?: string | null
          location?: string | null
          role?: 'employee' | 'manager' | 'admin'
        }
      }
      shifts: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string
        }
      }
    }
  }
}
