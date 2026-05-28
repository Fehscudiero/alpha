/**
 * ALPHA CONVÊNIOS — Rastreamento Privado de Leads
 * ─────────────────────────────────────────────────
 * Cole este código no Google Apps Script:
 *   1. Acesse: https://script.google.com/
 *   2. Crie um novo projeto
 *   3. Cole este código inteiro
 *   4. Configure as propriedades do script (veja CONFIGURAÇÃO abaixo)
 *   5. Implante como "App da Web" (Executar como: Eu, Acesso: Qualquer pessoa)
 *   6. Copie a URL gerada → cole no .env como VITE_LEAD_WEBHOOK
 */

// ─────────────────────────────────────────────────
// CONFIGURAÇÃO (Propriedades do Script)
// Vá em: Projeto > Configurações > Propriedades do script
// Adicione as chaves abaixo:
//   TELEGRAM_TOKEN  → token do seu bot (ex: 7412345678:AAFxxxx)
//   TELEGRAM_CHAT_ID → seu chat ID pessoal (use @userinfobot para descobrir)
// ─────────────────────────────────────────────────

var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // ── 1. SALVAR NA PLANILHA ──────────────────────
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var sh  = ss.getSheetByName(SHEET_NAME);

    // Cria a aba "Leads" se não existir
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
    }

    // Cabeçalho na primeira vez
    if (sh.getLastRow() === 0) {
      sh.appendRow([
        'Data/Hora', 'Nome', 'Telefone', 'E-mail',
        'Tipo de Plano', 'Origem', 'User Agent'
      ]);
      var header = sh.getRange(1, 1, 1, 7);
      header.setFontWeight('bold');
      header.setBackground('#0056A7');
      header.setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
      sh.setColumnWidth(1, 160);
      sh.setColumnWidth(2, 180);
      sh.setColumnWidth(3, 140);
      sh.setColumnWidth(4, 220);
      sh.setColumnWidth(5, 150);
      sh.setColumnWidth(6, 250);
      sh.setColumnWidth(7, 300);
    }

    // Formata data/hora no fuso de Brasília
    var agora   = new Date();
    var horario = Utilities.formatDate(agora, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    // Insere a linha do lead
    sh.appendRow([
      horario,
      data.nome       || '—',
      data.telefone   || '—',
      data.email      || '—',
      data.plano      || '—',
      data.origem     || '—',
      (data.userAgent || '—').substring(0, 120) // limita o UA
    ]);

    // Alterna cor das linhas (zebra) para facilitar leitura
    var lastRow = sh.getLastRow();
    if (lastRow % 2 === 0) {
      sh.getRange(lastRow, 1, 1, 7).setBackground('#f0f6ff');
    }

    // ── 2. NOTIFICAÇÃO NO TELEGRAM ────────────────
    var props  = PropertiesService.getScriptProperties();
    var token  = props.getProperty('TELEGRAM_TOKEN');
    var chatId = props.getProperty('TELEGRAM_CHAT_ID');

    if (token && chatId) {
      var emojis = {
        individual:  '👤',
        familiar:    '👨‍👩‍👧‍👦',
        empresarial: '🏢',
        mei:         '💼'
      };
      var emoji = emojis[data.plano] || '📋';

      var msg =
        '🔔 *NOVO LEAD — Alpha Convênios*\n\n' +
        '👤 *Nome:* '    + escMd(data.nome)     + '\n' +
        '📱 *Telefone:* ' + escMd(data.telefone) + '\n' +
        '📧 *E\\-mail:* ' + escMd(data.email)    + '\n' +
        emoji + ' *Plano:* ' + escMd(data.plano) + '\n' +
        '🕐 *Horário:* ' + horario               + '\n' +
        '🌐 *Site:* '    + escMd(data.origem);

      UrlFetchApp.fetch(
        'https://api.telegram.org/bot' + token + '/sendMessage',
        {
          method:           'post',
          contentType:      'application/json',
          muteHttpExceptions: true,
          payload: JSON.stringify({
            chat_id:    chatId,
            text:       msg,
            parse_mode: 'MarkdownV2'
          })
        }
      );
    }

    // ── 3. RESPOSTA OK ────────────────────────────
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Loga o erro internamente mas retorna 200 pro site (evita retry loops)
    Logger.log('Erro: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Escapa caracteres especiais do MarkdownV2 do Telegram
function escMd(text) {
  if (!text) return '—';
  return String(text).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

// Rota GET simples para testar se o script está vivo
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', projeto: 'Alpha Convênios Lead Tracker' }))
    .setMimeType(ContentService.MimeType.JSON);
}
