// ===== Google Apps Script — КОД ДЛЯ ЗАМЕНЫ =====
// 1. Открой: https://script.google.com
// 2. Найди свой проект "Код" (или создай новый)
// 3. Замени ВСЕ содержимое файла "Код" на этот код
// 4. Вставь свой ТОКЕН и CHAT_ID (см. комментарии ниже)
// 5. Нажми "Deploy" → "New deployment" → "Web app" → "Anyone" → "Deploy"
// 6. Скопируй новый URL и замени SCRIPT_URL в index.html

// ============================================
// ⬇️  ВСТАВЬ СЮДА СВОИ ДАННЫЕ  ⬇️
// ============================================
const BOT_TOKEN = 'СЮДА_ТОКЕН_БОТА';       // например: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
const CHAT_ID   = 'СЮДА_CHAT_ID';           // например: 123456789

// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Валидация
    if (!data.name || !data.phone) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Имя и телефон обязательны' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Формируем сообщение для Telegram
    let msg = '📋 <b>Новая заявка с сайта СептикПро</b>\n';
    msg += '━━━━━━━━━━━━━━━━━━━━━\n\n';
    msg += '👤 <b>Имя:</b> ' + (data.name || '—') + '\n';
    msg += '📞 <b>Телефон:</b> ' + (data.phone || '—') + '\n';
    msg += '✉️ <b>Email:</b> ' + (data.email || 'не указан') + '\n';
    msg += '🔧 <b>Тип септика:</b> ' + (data.type || 'не указано') + '\n';
    msg += '💬 <b>Комментарий:</b> ' + (data.comment || 'нет') + '\n';
    msg += '\n━━━━━━━━━━━━━━━━━━━━━\n';
    msg += '🕐 ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    // Отправляем в Telegram
    const telegramUrl = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
    const response = UrlFetchApp.fetch(telegramUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });

    const result = JSON.parse(response.getContentText());
    if (!result.ok) {
      throw new Error('Telegram API error: ' + (result.description || 'unknown'));
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('ERROR: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Тестовая функция — запусти в редакторе чтобы проверить
function testSend() {
  const telegramUrl = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
  const msg = '✅ <b>Тест прошёл успешно!</b>\n\nБот настроен правильно.';

  const response = UrlFetchApp.fetch(telegramUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: 'HTML'
    })
  });

  Logger.log(response.getContentText());
}
