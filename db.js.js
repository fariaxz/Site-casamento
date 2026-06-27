// db.js
import { supabase } from './supabase-client.js';

// ─── FAMÍLIAS ───
export async function getFamilias() {
  const { data, error } = await supabase
    .from('familias')
    .select('*')
    .order('code');
  if (error) throw new Error(`Erro ao buscar famílias: ${error.message}`);
  return data || [];
}

export async function addFamilia(code, name, members) {
  const { data, error } = await supabase
    .from('familias')
    .insert({ code, name, members: members || [] })
    .select()
    .single();
  if (error) throw new Error(`Erro ao adicionar família: ${error.message}`);
  return data;
}

export async function updateFamilia(code, name, members) {
  const { data, error } = await supabase
    .from('familias')
    .update({ name, members: members || [] })
    .eq('code', code)
    .select()
    .single();
  if (error) throw new Error(`Erro ao atualizar família: ${error.message}`);
  return data;
}

export async function deleteFamilia(code) {
  const { error } = await supabase
    .from('familias')
    .delete()
    .eq('code', code);
  if (error) throw new Error(`Erro ao deletar família: ${error.message}`);
}

export async function getFamiliaByCode(code) {
  const { data, error } = await supabase
    .from('familias')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar família: ${error.message}`);
  return data;
}

// ─── RSVPs ───
export async function getRsvps() {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*');
  if (error) throw new Error(`Erro ao buscar RSVPs: ${error.message}`);
  const map = {};
  (data || []).forEach(r => map[r.family_code] = r);
  return map;
}

export async function getRsvp(code) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('family_code', code.toUpperCase())
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar RSVP: ${error.message}`);
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
  if (error) throw new Error(`Erro ao salvar RSVP: ${error.message}`);
  return data;
}

// ─── PRESENTES ───
export async function getGifts() {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .order('id');
  if (error) throw new Error(`Erro ao buscar presentes: ${error.message}`);
  return data || [];
}

export async function getGiftQuantities() {
  const { data, error } = await supabase
    .from('gift_quantities')
    .select('*');
  if (error) throw new Error(`Erro ao buscar quantidades: ${error.message}`);
  const map = {};
  (data || []).forEach(g => map[g.gift_id] = g.quantity);
  return map;
}

export async function getGiftReceived() {
  const { data, error } = await supabase
    .from('gift_received')
    .select('*');
  if (error) throw new Error(`Erro ao buscar recebidos: ${error.message}`);
  const map = {};
  (data || []).forEach(g => map[g.gift_id] = g.received);
  return map;
}

export async function updateGiftQty(gift_id, quantity) {
  const { error } = await supabase
    .from('gift_quantities')
    .upsert({ gift_id, quantity }, { onConflict: 'gift_id' });
  if (error) throw new Error(`Erro ao atualizar quantidade: ${error.message}`);
}

export async function updateGiftReceived(gift_id, received) {
  const { error } = await supabase
    .from('gift_received')
    .upsert({ gift_id, received }, { onConflict: 'gift_id' });
  if (error) throw new Error(`Erro ao atualizar recebidos: ${error.message}`);
}

export async function addExtraGift(name, category, emoji, description, stores, default_qty) {
  // Primeiro insere o presente
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
  
  // Depois adiciona a quantidade
  const { error: qtyError } = await supabase
    .from('gift_quantities')
    .insert({ gift_id: gift.id, quantity: default_qty || 1 });
  if (qtyError) throw new Error(`Erro ao adicionar quantidade: ${qtyError.message}`);
  
  // E o recebido
  const { error: recvError } = await supabase
    .from('gift_received')
    .insert({ gift_id: gift.id, received: 0 });
  if (recvError) throw new Error(`Erro ao adicionar recebido: ${recvError.message}`);
  
  return gift;
}

export async function deleteGift(id) {
  const { error } = await supabase
    .from('gifts')
    .delete()
    .eq('id', id)
    .eq('is_extra', true);
  if (error) throw new Error(`Erro ao deletar presente: ${error.message}`);
}

// ─── MENSAGENS ───
export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('at', { ascending: false });
  if (error) throw new Error(`Erro ao buscar mensagens: ${error.message}`);
  return data || [];
}

export async function addMessage(text, author) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ text, author })
    .select()
    .single();
  if (error) throw new Error(`Erro ao adicionar mensagem: ${error.message}`);
  return data;
}

export async function deleteMessage(id) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw new Error(`Erro ao deletar mensagem: ${error.message}`);
}

// ─── CONTEÚDO ───
export async function getSiteContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*');
  if (error) throw new Error(`Erro ao buscar conteúdo: ${error.message}`);
  const map = {};
  (data || []).forEach(c => map[c.key] = c.value);
  return map;
}

export async function updateSiteContent(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw new Error(`Erro ao atualizar conteúdo: ${error.message}`);
}

// ─── UTILITÁRIOS ───
export async function getFullGifts() {
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
}

export async function getDashboardStats() {
  const [familias, rsvps, gifts, messages] = await Promise.all([
    getFamilias(),
    getRsvps(),
    getFullGifts(),
    getMessages()
  ]);

  let conf = 0, decl = 0, pend = 0, adults = 0, kids = 0;
  familias.forEach(f => {
    const r = rsvps[f.code];
    if (!r) { pend++; return; }
    if (r.status === 'CONFIRMED') { conf++; adults += r.adults || 0; kids += r.kids || 0; }
    else decl++;
  });

  const totalNeeded = gifts.reduce((a, g) => a + g.needed, 0);
  const totalReceived = gifts.reduce((a, g) => a + g.received, 0);
  const totalMembers = familias.reduce((a, f) => a + (f.members || []).length, 0);

  return {
    familias: familias.length,
    conf,
    decl,
    pend,
    adults,
    kids,
    totalMembers,
    gifts: gifts.length,
    totalNeeded,
    totalReceived,
    messages: messages.length,
    pctConfirm: Math.round(conf / Math.max(familias.length, 1) * 100),
    pctGifts: Math.round(totalReceived / Math.max(totalNeeded, 1) * 100)
  };
}