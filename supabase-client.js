// supabase-client.js
import { createClient } from '@supabase/supabase-js';

// 🔑 Substitua com suas credenciais do Supabase
// Vá em: https://app.supabase.com/project/[seu-projeto]/settings/api
const SUPABASE_URL = 'https://oypxdcfzjbsbsdumufsp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H3TYW-LKV5y4m0BQJd9vgw_SVYTVYHG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verifica conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('familias').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Conectado ao Supabase!');
    return true;
  } catch (e) {
    console.error('❌ Erro ao conectar:', e.message);
    return false;
  }
}
