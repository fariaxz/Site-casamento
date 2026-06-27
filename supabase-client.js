// supabase-client.js
import { createClient } from '@supabase/supabase-js';

// 🔑 Substitua com suas credenciais do Supabase
// Vá em: https://app.supabase.com/project/[seu-projeto]/settings/api
const SUPABASE_URL = 'https://oypxdcfzjbsbsdumufsp.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cHhkY2Z6amJzYnNkdW11ZnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDc5MDIsImV4cCI6MjA5ODA4MzkwMn0.mRjpIIEVtu94cp0K-6_ZWlC2l-0xil2N6yrItbjekaI';

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
