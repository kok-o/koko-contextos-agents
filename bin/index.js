#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Путь к папке .agents внутри установленного npm-пакета
const sourcePath = path.join(__dirname, '..', '.agents');

// Путь к текущей директории, откуда пользователь запустил команду
const targetPath = path.join(process.cwd(), '.agents');

console.log('⏳ Установка настроек ИИ-ассистента (.agents)...');

try {
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Ошибка: Исходная папка .agents не найдена в пакете.');
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.log('⚠️ Внимание: Папка .agents уже существует в этом проекте. Файлы будут обновлены.');
  }

  // Рекурсивное копирование (работает в Node.js 16.7.0 и выше)
  fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });

  console.log('✅ Папка .agents успешно скопирована в ваш проект!');
  console.log('🤖 Теперь ИИ-ассистент будет использовать ваши навыки и правила.');
} catch (error) {
  console.error('❌ Произошла ошибка при копировании:', error.message);
  process.exit(1);
}
