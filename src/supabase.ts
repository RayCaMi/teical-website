import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://izezdziarxlfqzonsdwr.supabase.co'
const supabaseKey = 'sb_publishable_cOJ5Hy1kWiV0gkndiqEb6w_jR3ZHtI3'

export const supabase = createClient(supabaseUrl, supabaseKey)