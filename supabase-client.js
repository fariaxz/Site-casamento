// supabase-client.js
import { createClient } from '@supabase/supabase-js';

// 🔑 SUAS CREDENCIAIS
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-aqui';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('count')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Erro na conexão:', error.message);
      return false;
    }
    console.log('✅ Conectado ao Supabase!');
    return true;
  } catch (e) {
    console.warn('⚠️ Falha na conexão:', e.message);
    return false;
  }
}
