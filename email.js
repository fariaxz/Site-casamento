// email.js
// Serviço de e-mail usando Resend

const RESEND_API_KEY = 're_JHn5Svxy_HXNfKLGZ9QDqnhsSrWdj3mnL'; // ← COLE SUA CHAVE DO RESEND

// URL base da API do Resend
const RESEND_API_URL = 'https://api.resend.com/emails';

// E-mail que vai enviar (deve estar verificado no Resend)
const FROM_EMAIL = 'samuelbcfaria@outlook.com'; // ← SEU E-MAIL VERIFICADO

// E-mail que vai receber as notificações
const TO_EMAIL = 'samuelbcfaria@gmail.com'; // ← ONDE VOCÊ QUER RECEBER

/**
 * Envia um e-mail via Resend
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to || TO_EMAIL,
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro ao enviar e-mail:', data);
      throw new Error(data.message || 'Erro ao enviar e-mail');
    }

    console.log('✅ E-mail enviado:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Erro no envio:', error);
    throw error;
  }
}

// ─── TEMPLATES DE E-MAIL ───

/**
 * Template: Nova confirmação de presença
 */
export function emailConfirmacaoPresente(familia, rsvp) {
  const status = rsvp.status === 'CONFIRMED' ? '✅ Confirmado' : '❌ Não poderá ir';
  const statusEmoji = rsvp.status === 'CONFIRMED' ? '🎉' : '😢';
  
  return {
    subject: `📋 Nova Confirmação - ${familia.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f5f0; border-radius: 8px;">
        <div style="text-align: center; padding: 20px; background: #4A2E1F; border-radius: 8px; color: white;">
          <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; margin: 0;">${statusEmoji} ${familia.name}</h1>
          <p style="font-size: 16px; opacity: 0.8; margin: 5px 0 0;">Atualizou a confirmação de presença</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #4A2E1F; font-family: 'Cormorant Garamond', serif; font-size: 22px; margin-top: 0;">📋 Detalhes da Confirmação</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F; width: 40%;">Família:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${familia.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Código:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${familia.code}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Status:</td>
              <td style="padding: 8px 0; color: ${rsvp.status === 'CONFIRMED' ? '#2E7D32' : '#C62828'}; font-weight: bold;">${status}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Adultos:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${rsvp.adults || 0}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Crianças:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${rsvp.kids || 0}</td>
            </tr>
            ${rsvp.dietary ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Restrições:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${rsvp.dietary}</td>
            </tr>
            ` : ''}
            ${rsvp.message ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Mensagem:</td>
              <td style="padding: 8px 0; color: #5C3D2A; font-style: italic;">"${rsvp.message}"</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #f0ede8; border-radius: 8px; text-align: center; font-size: 14px; color: #5C3D2A;">
            👥 Membros da família: ${(familia.members || []).join(', ')}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9A7B62;">
          <p>Luiza & Samuel · 29.05.2027</p>
          <p style="font-style: italic;">"E acima de tudo, revesti-vos de amor."</p>
        </div>
      </div>
    `
  };
}

/**
 * Template: Novo presente comprado
 */
export function emailPresenteComprado(gift) {
  const emoji = gift.emoji || '🎁';
  const pct = gift.needed > 0 ? Math.round(gift.received / gift.needed * 100) : 0;
  
  return {
    subject: `🎁 Presente Comprado - ${gift.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f5f0; border-radius: 8px;">
        <div style="text-align: center; padding: 20px; background: #C7A46C; border-radius: 8px; color: #4A2E1F;">
          <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 40px; margin: 0;">${emoji}</h1>
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; margin: 5px 0;">Novo Presente Comprado!</h2>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #4A2E1F; font-family: 'Cormorant Garamond', serif; font-size: 22px; margin-top: 0;">📦 Detalhes do Presente</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F; width: 40%;">Item:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${gift.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Categoria:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${gift.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Quantidade pedida:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${gift.needed}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Quantidade recebida:</td>
              <td style="padding: 8px 0; color: #2E7D32; font-weight: bold;">${gift.received} (${pct}% do total)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Status:</td>
              <td style="padding: 8px 0; color: ${gift.received >= gift.needed ? '#2E7D32' : '#C7A46C'}; font-weight: bold;">
                ${gift.received >= gift.needed ? '✅ COMPLETO!' : '🔄 Em andamento'}
              </td>
            </tr>
          </table>
          
          ${gift.stores && gift.stores.length > 0 ? `
          <div style="margin: 15px 0; padding: 10px; background: #f0ede8; border-radius: 8px;">
            <p style="font-size: 13px; color: #5C3D2A; margin: 0;"><strong>Lojas sugeridas:</strong> ${gift.stores.join(', ')}</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding: 15px; background: #E8F5E9; border-radius: 8px; text-align: center; font-size: 14px; color: #2E7D32;">
            🎉 Mais um presente recebido! Obrigado aos convidados!
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9A7B62;">
          <p>Luiza & Samuel · 29.05.2027</p>
        </div>
      </div>
    `
  };
}

/**
 * Template: Nova mensagem no mural
 */
export function emailNovaMensagem(msg) {
  return {
    subject: `💌 Nova Mensagem no Mural - ${msg.author}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f5f0; border-radius: 8px;">
        <div style="text-align: center; padding: 20px; background: #6F4E37; border-radius: 8px; color: white;">
          <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 40px; margin: 0;">💌</h1>
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; margin: 5px 0;">Nova Mensagem</h2>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <div style="border-left: 4px solid #C7A46C; padding-left: 15px; margin: 15px 0;">
            <p style="font-size: 18px; color: #4A2E1F; font-style: italic; line-height: 1.6;">"${msg.text}"</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F; width: 30%;">Autor:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${msg.author}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Data:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${msg.at ? new Date(msg.at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #fff8e6; border-radius: 8px; text-align: center; font-size: 14px; color: #7a5c00;">
            📝 Mensagem publicada no mural do site!
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9A7B62;">
          <p>Luiza & Samuel · 29.05.2027</p>
        </div>
      </div>
    `
  };
}

/**
 * Template: Nova família cadastrada (admin)
 */
export function emailNovaFamilia(familia) {
  return {
    subject: `👥 Nova Família Cadastrada - ${familia.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f5f0; border-radius: 8px;">
        <div style="text-align: center; padding: 20px; background: #4A2E1F; border-radius: 8px; color: white;">
          <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 40px; margin: 0;">👥</h1>
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; margin: 5px 0;">Nova Família Cadastrada</h2>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F; width: 30%;">Código:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${familia.code}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Nome:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${familia.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A2E1F;">Membros:</td>
              <td style="padding: 8px 0; color: #5C3D2A;">${(familia.members || []).join(', ')}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9A7B62;">
          <p>Luiza & Samuel · 29.05.2027</p>
        </div>
      </div>
    `
  };
}

// ─── FUNÇÃO PRINCIPAL DE NOTIFICAÇÃO ───

/**
 * Envia notificação sobre qualquer evento
 */
export async function sendNotification(type, data) {
  try {
    let emailData;
    
    switch (type) {
      case 'rsvp':
        emailData = emailConfirmacaoPresente(data.familia, data.rsvp);
        break;
      case 'gift':
        emailData = emailPresenteComprado(data.gift);
        break;
      case 'message':
        emailData = emailNovaMensagem(data.message);
        break;
      case 'family':
        emailData = emailNovaFamilia(data.familia);
        break;
      default:
        console.warn('Tipo de notificação desconhecido:', type);
        return;
    }
    
    // Envia o e-mail
    const result = await sendEmail({
      to: TO_EMAIL,
      subject: emailData.subject,
      html: emailData.html,
    });
    
    console.log(`✅ Notificação "${type}" enviada!`);
    return result;
  } catch (error) {
    console.error(`❌ Erro ao enviar notificação "${type}":`, error);
    // Não interrompe o fluxo se o e-mail falhar
  }
}
