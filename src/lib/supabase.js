import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bvfpandmaiotjoecbpok.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZnBhbmRtYWlvdGpvZWNicG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTMxMjIsImV4cCI6MjA1Nzg2OTEyMn0.gnNYwK2wXpHQE8kdhqxainScTJe15jrWDNu-HBz_4SE'

export const supabase = createClient(supabaseUrl, supabaseKey)
