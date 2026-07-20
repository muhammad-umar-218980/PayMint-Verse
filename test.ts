import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // use service role if needed, or anon

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: expenses, error } = await supabase.from('expenses').select('*');
  console.log(error);
}
check();
