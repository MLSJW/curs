// utils/crypto.js
const ALGORITHM = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
};

// Генерация пары ключей
export const generateKeyPair = async () => {
    const keyPair = await crypto.subtle.generateKey(ALGORITHM, true, ["encrypt", "decrypt"]);
    return keyPair;
};

// Экспорт публичного ключа в base64
export const exportPublicKey = async (publicKey) => {
    const exported = await crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

// Импорт публичного ключа из base64
export const importPublicKey = async (base64Key) => {
    const binaryKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await crypto.subtle.importKey("spki", binaryKey, ALGORITHM, true, ["encrypt"]);
};

// Экспорт приватного ключа в base64
export const exportPrivateKey = async (privateKey) => {
    const exported = await crypto.subtle.exportKey("pkcs8", privateKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

// Импорт приватного ключа из base64
export const importPrivateKey = async (base64Key) => {
    const binaryKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await crypto.subtle.importKey("pkcs8", binaryKey, ALGORITHM, true, ["decrypt"]);
};

// Шифрование сообщения публичным ключом
export const encryptMessage = async (message, publicKey) => {
    const encodedMessage = new TextEncoder().encode(message);
    const encrypted = await crypto.subtle.encrypt(ALGORITHM, publicKey, encodedMessage);
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

// Расшифровка сообщения приватным ключом
export const decryptMessage = async (encryptedMessage, privateKey) => {
    const encrypted = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(ALGORITHM, privateKey, encrypted);
    return new TextDecoder().decode(decrypted);
};