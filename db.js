// db.js
import { supabase } from './supabase-client.js';

// ─── FAMÍLIAS ───
export async function getFamilias() {
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('*')
      .order('code');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('⚠️ Erro ao buscar famílias:', e.message);
    return [];
  }
}

export async function addFamilia(code, name, members) {
  const { data, error } = await supabase
    .from('familias')
    .insert({ code, name, members: members || [] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateFamilia(code, name, members) {
  const { data, error } = await supabase
    .from('familias')
    .update({ name, members: members || [] })
    .eq('code', code)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFamilia(code) {
  const { error } = await supabase
    .from('familias')
    .delete()
    .eq('code', code);
  if (error) throw error;
}

export async function getFamiliaByCode(code) {
  const { data, error } = await supabase
    .from('familias')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ─── RSVPs ───
export async function getRsvps() {
  try {
    const { data, error } = await supabase.from('rsvps').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(r => map[r.family_code] = r);
    return map;
  } catch (e) {
    console.warn('⚠️ Erro ao buscar RSVPs:', e.message);
    return {};
  }
}

export async function getRsvp(code) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('family_code', code.toUpperCase())
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertRsvp(family_code, status, adults, kids, dietary, message) {
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
  if (error) throw error;
  return data;
}

// ─── PRESENTES ───
export async function getGifts() {
  try {
    const { data, error } = await supabase.from('gifts').select('*').order('id');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('⚠️ Erro ao buscar presentes:', e.message);
    return [];
  }
}

export async function getGiftQuantities() {
  try {
    const { data, error } = await supabase.from('gift_quantities').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(g => map[g.gift_id] = g.quantity);
    return map;
  } catch (e) {
    console.warn('⚠️ Erro ao buscar quantidades:', e.message);
    return {};
  }
}

export async function getGiftReceived() {
  try {
    const { data, error } = await supabase.from('gift_received').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(g => map[g.gift_id] = g.received);
    return map;
  } catch (e) {
    console.warn('⚠️ Erro ao buscar recebidos:', e.message);
    return {};
  }
}

export async function updateGiftQty(gift_id, quantity) {
  const { error } = await supabase
    .from('gift_quantities')
    .upsert({ gift_id, quantity }, { onConflict: 'gift_id' });
  if (error) throw error;
}

export async function updateGiftReceived(gift_id, received) {
  const { error } = await supabase
    .from('gift_received')
    .upsert({ gift_id, received }, { onConflict: 'gift_id' });
  if (error) throw error;
}

export async function addExtraGift(name, category, emoji, description, stores, default_qty) {
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
  if (giftError) throw giftError;
  
  await supabase.from('gift_quantities').insert({ gift_id: gift.id, quantity: default_qty || 1 });
  await supabase.from('gift_received').insert({ gift_id: gift.id, received: 0 });
  return gift;
}

export async function deleteGift(id) {
  const { error } = await supabase
    .from('gifts')
    .delete()
    .eq('id', id)
    .eq('is_extra', true);
  if (error) throw error;
}

// ─── MENSAGENS ───
export async function getMessages() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('⚠️ Erro ao buscar mensagens:', e.message);
    return [];
  }
}

export async function addMessage(text, author) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ text, author })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

// ─── CONTEÚDO ───
export async function getSiteContent() {
  try {
    const { data, error } = await supabase.from('site_content').select('*');
    if (error) throw error;
    const map = {};
    (data || []).forEach(c => map[c.key] = c.value);
    return map;
  } catch (e) {
    console.warn('⚠️ Erro ao buscar conteúdo:', e.message);
    return {};
  }
}

export async function updateSiteContent(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

// ─── UTILITÁRIOS ───
export async function getFullGifts() {
  try {
    const [gifts, qtyMap, recvMap] = await Promise.all([
      getGifts(),
      getGiftQuantities(),
      getGiftReceived()
    ]);
    return gifts.map(g => ({
      ...g,
      needed: qtyMap[g.id] || g.default_qty || 1,
      received: recvMap[g.id] || 0
    }));
  } catch (e) {
    console.warn('⚠️ Erro ao processar presentes:', e.message);
    return [];
  }
}
