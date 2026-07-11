import crypto from 'crypto'

const ENC_ALGORITHM = 'aes-256-cbc'; // TODO: Change to gcm
const IV_LENGTH = 16; 

export function encrypt(text: string, key:Buffer) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ENC_ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string, key:Buffer) {
    const [ivHex, ciphertextHex] = encryptedData.split(':');
    
    if (!ivHex || !ciphertextHex) {
        throw new Error('Invalid encrypted data format.');
    }

    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(ENC_ALGORITHM, key, iv);

    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
