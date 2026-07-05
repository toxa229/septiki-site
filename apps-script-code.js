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

    // Формируем сообщение для Telegram
    let msg = '📋 <b>Новая заявка с сайта СептикПро</b>\n\n';
    msg += '👤 <b>Имя:</b> ' + (data.name || '—') + '\n';
    msg += '📞 <b>Телефон:</b> ' + (data.phone || '—') + '\n';
    msg += '✉️ <b>Email:</b> ' + (data.email || '—') + '\n';
    msg += '🔧 <b>Тип септика:</b> ' + (data.type || '—') + '\n';
    msg += '💬 <b>Комментарий:</b> ' + (data.comment || '—') + '\n';
    msg += '\n🕐 ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    // Отправляем в Telegram
    const telegramUrl = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
    UrlFetchApp.fetch(telegramUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Тестовая функция — запусти в редакторе чтобы проверить
function testSend() {
  const testData = {
    name: 'Тестовый пользователь',
    phone: '+7 999 123-45-67',
    email: 'test@example.com',
    type: 'Стандарт',
    comment: 'Тестовое сообщение из Apps Script'
  };

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
