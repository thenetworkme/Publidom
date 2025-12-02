require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend admin tasks if needed, or Anon Key

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase URL or Key in backend environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
