// db.js
import { supabase } from './supabase-client.js';

console.log('📦 db.js carregado');

// ─── FAMÍLIAS ───
export async function getFamilias() {
  console.log('🔍 Buscando famílias...');
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('*')
      .order('code');
    
    if (error) {
      console.error('❌ Erro ao buscar famílias:', error);
      throw new Error(`Erro ao buscar famílias: ${error.message}`);
    }
    
    console.log(`✅ ${data?.length || 0} famílias encontradas`);
    return data || [];
  } catch (e) {
    console.error('❌ Erro em getFamilias:', e);
    throw e;
  }
}

export async function addFamilia(code, name, members) {
  console.log('➕ Adicionando família:', code, name);
  try {
    const { data, error } = await supabase
      .from('familias')
      .insert({ code, name, members: members || [] })
      .select()
      .single();
    
    if (error) throw new Error(`Erro ao adicionar família: ${error.message}`);
    console.log('✅ Família adicionada:', data);
    return data;
  } catch (e) {
    console.error('❌ Erro em addFamilia:', e);
    throw e;
  }
}

export async function updateFamilia(code, name, members) {
  console.log('✏️ Atualizando família:', code);
  try {
    const { data, error } = await supabase
      .from('familias')
      .update({ name, members: members || [] })
      .eq('code', code)
      .select()
      .single();
    
    if (error) throw new Error(`Erro ao atualizar família: ${error.message}`);
    console.log('✅ Família atualizada:', data);
    return data;
  } catch (e) {
    console.error('❌ Erro em updateFamilia:', e);
    throw e;
  }
}

export async function deleteFamilia(code) {
  console.log('🗑️ Deletando família:', code);
  try {
    const { error } = await supabase
      .from('familias')
      .delete()
      .eq('code', code);
    
    if (error) throw new Error(`Erro ao deletar família: ${error.message}`);
    console.log('✅ Família deletada');
  } catch (e) {
    console.error('❌ Erro em deleteFamilia:', e);
    throw e;
  }
}

export async function getFamiliaByCode(code) {
  console.log('🔍 Buscando família por código:', code);
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar família: ${error.message}`);
    }
    console.log('✅ Família encontrada:', data);
    return data;
  } catch (e) {
    console.error('❌ Erro em getFamiliaByCode:', e);
    throw e;
  }
}

// ─── RSVPs ───
export async function getRsvps() {
  console.log('🔍 Buscando RSVPs...');
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*');
    
    if (error) throw new Error(`Erro ao buscar RSVPs: ${error.message}`);
    
    const map = {};
    (data || []).forEach(r => map[r.family_code] = r);
    console.log(`✅ ${Object.keys(map).length} RSVPs encontradas`);
    return map;
  } catch (e) {
    console.error('❌ Erro em getRsvps:', e);
    throw e;
  }
}

export async function getRsvp(code) {
  console.log('🔍 Buscando RSVP por código:', code);
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('family_code', code.toUpperCase())
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar RSVP: ${error.message}`);
    }
    return data;
  } catch (e) {
    console.error('❌ Erro em getRsvp:', e);
    throw e;
  }
}

export async function upsertRsvp(family_code, status, adults, kids, dietary, message) {
  console.log('💾 Salvando RSVP:', family_code, status);
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .upsert({
        family_code: family_code.toUpperCase(),
        status,
        adults: adults || 0,
        kids: kids || 0,
        dietary: dietary || '',
        message: message || '',
        at: new Date().toISOString()
      }, { onConflict: 'family_code' })
      .select()
      .single();
    
    if (error) throw new Error(`Erro ao salvar RSVP: ${error.message}`);
    console.log('✅ RSVP salvo:', data);
    return data;
  } catch (e) {
    console.error('❌ Erro em upsertRsvp:', e);
    throw e;
  }
}

// ─── PRESENTES ───
export async function getGifts() {
  console.log('🔍 Buscando presentes...');
  try {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('id');
    
    if (error) throw new Error(`Erro ao buscar presentes: ${error.message}`);
    console.log(`✅ ${data?.length || 0} presentes encontrados`);
    return data || [];
  } catch (e) {
    console.error('❌ Erro em getGifts:', e);
    throw e;
  }
}

export async function getGiftQuantities() {
  console.log('🔍 Buscando quantidades...');
  try {
    const { data, error } = await supabase
      .from('gift_quantities')
      .select('*');
    
    if (error) throw new Error(`Erro ao buscar quantidades: ${error.message}`);
    
    const map = {};
    (data || []).forEach(g => map[g.gift_id] = g.quantity);
    return map;
  } catch (e) {
    console.error('❌ Erro em getGiftQuantities:', e);
    throw e;
  }
}

export async function getGiftReceived() {
  console.log('🔍 Buscando recebidos...');
  try {
    const { data, error } = await supabase
      .from('gift_received')
      .select('*');
    
    if (error) throw new Error(`Erro ao buscar recebidos: ${error.message}`);
    
    const map = {};
    (data || []).forEach(g => map[g.gift_id] = g.received);
    return map;
  } catch (e) {
    console.error('❌ Erro em getGiftReceived:', e);
    throw e;
  }
}

export async function updateGiftQty(gift_id, quantity) {
  console.log('✏️ Atualizando quantidade do presente:', gift_id, quantity);
  try {
    const { error } = await supabase
      .from('gift_quantities')
      .upsert({ gift_id, quantity }, { onConflict: 'gift_id' });
    
    if (error) throw new Error(`Erro ao atualizar quantidade: ${error.message}`);
    console.log('✅ Quantidade atualizada');
  } catch (e) {
    console.error('❌ Erro em updateGiftQty:', e);
    throw e;
  }
}

export async function updateGiftReceived(gift_id, received) {
  console.log('✏️ Atualizando recebidos do presente:', gift_id, received);
  try {
    const { error } = await supabase
      .from('gift_received')
      .upsert({ gift_id, received }, { onConflict: 'gift_id' });
    
    if (error) throw new Error(`Erro ao atualizar recebidos: ${error.message}`);
    console.log('✅ Recebidos atualizados');
  } catch (e) {
    console.error('❌ Erro em updateGiftReceived:', e);
    throw e;
  }
}

export async function addExtraGift(name, category, emoji, description, stores, default_qty) {
  console.log('➕ Adicionando presente extra:', name);
  try {
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .insert({
        name,
        category,
        emoji: emoji || '🎁',
        description: description || '',
        stores: stores || [],
        default_qty: default_qty || 1,
        is_extra: true
      })
      .select()
      .single();
    
    if (giftError) throw new Error(`Erro ao adicionar presente: ${giftError.message}`);
    
    await supabase
      .from('gift_quantities')
      .insert({ gift_id: gift.id, quantity: default_qty || 1 });
    
    await supabase
      .from('gift_received')
      .insert({ gift_id: gift.id, received: 0 });
    
    console.log('✅ Presente extra adicionado:', gift);
    return gift;
  } catch (e) {
    console.error('❌ Erro em addExtraGift:', e);
    throw e;
  }
}

export async function deleteGift(id) {
  console.log('🗑️ Deletando presente:', id);
  try {
    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('id', id)
      .eq('is_extra', true);
    
    if (error) throw new Error(`Erro ao deletar presente: ${error.message}`);
    console.log('✅ Presente deletado');
  } catch (e) {
    console.error('❌ Erro em deleteGift:', e);
    throw e;
  }
}

// ─── MENSAGENS ───
export async function getMessages() {
  console.log('🔍 Buscando mensagens...');
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('at', { ascending: false });
    
    if (error) throw new Error(`Erro ao buscar mensagens: ${error.message}`);
    console.log(`✅ ${data?.length || 0} mensagens encontradas`);
    return data || [];
  } catch (e) {
    console.error('❌ Erro em getMessages:', e);
    throw e;
  }
}

export async function addMessage(text, author) {
  console.log('➕ Adicionando mensagem:', author);
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({ text, author })
      .select()
      .single();
    
    if (error) throw new Error(`Erro ao adicionar mensagem: ${error.message}`);
    console.log('✅ Mensagem adicionada:', data);
    return data;
  } catch (e) {
    console.error('❌ Erro em addMessage:', e);
    throw e;
  }
}

export async function deleteMessage(id) {
  console.log('🗑️ Deletando mensagem:', id);
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Erro ao deletar mensagem: ${error.message}`);
    console.log('✅ Mensagem deletada');
  } catch (e) {
    console.error('❌ Erro em deleteMessage:', e);
    throw e;
  }
}

// ─── CONTEÚDO ───
export async function getSiteContent() {
  console.log('🔍 Buscando conteúdo do site...');
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*');
    
    if (error) throw new Error(`Erro ao buscar conteúdo: ${error.message}`);
    
    const map = {};
    (data || []).forEach(c => map[c.key] = c.value);
    return map;
  } catch (e) {
    console.error('❌ Erro em getSiteContent:', e);
    throw e;
  }
}

export async function updateSiteContent(key, value) {
  console.log('✏️ Atualizando conteúdo:', key);
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    
    if (error) throw new Error(`Erro ao atualizar conteúdo: ${error.message}`);
    console.log('✅ Conteúdo atualizado:', key);
  } catch (e) {
    console.error('❌ Erro em updateSiteContent:', e);
    throw e;
  }
}

// ─── UTILITÁRIOS ───
export async function getFullGifts() {
  console.log('🔍 Buscando lista completa de presentes...');
  try {
    const [gifts, qtyMap, recvMap] = await Promise.all([
      getGifts(),
      getGiftQuantities(),
      getGiftReceived()
    ]);
    
    const result = gifts.map(g => ({
      ...g,
      needed: qtyMap[g.id] || g.default_qty || 1,
      received: recvMap[g.id] || 0
    }));
    
    console.log(`✅ ${result.length} presentes processados`);
    return result;
  } catch (e) {
    console.error('❌ Erro em getFullGifts:', e);
    throw e;
  }
}
