import { createClient } from '@supabase/supabase-js'

// Inke naam EXACT wahi hone chahiye jo Vercel mein hain
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase keys are missing! Check your Vercel Environment Variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)