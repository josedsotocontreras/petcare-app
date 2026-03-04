import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://myynmlmwtbhtagbsninn.supabase.co'
const SUPABASE_KEY = 'sb_publishable_QuJO8T_qZ5LTkREAlj2SMQ_kfcyOlzm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)