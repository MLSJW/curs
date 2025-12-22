import CryptoJS from 'crypto-js';

// Функция для получения или генерации уникального ключа пользователя
const getUserSecretKey = () => {
  let key = localStorage.getItem('userSecretKey');
  if (!key) {
    // Генерируем случайный ключ, если его нет
    key = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('userSecretKey', key);
  }
  return key;
};

const SECRET_KEY = getUserSecretKey();

export const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};