import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://tcwtnhjanhnscmbvvcnl.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjd3RuaGphbmhuc2NtYnZ2Y25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTgzNTcsImV4cCI6MjA4OTU3NDM1N30.ISoZswx5SyFNvlj0mKjehEkujNueJe1HUPTWLUkgrLU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);