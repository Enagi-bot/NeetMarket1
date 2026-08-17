import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client. MUST be used only on the server and with
// SUPABASE_SERVICE_ROLE_KEY set in env. Do NOT expose this key to the client.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
