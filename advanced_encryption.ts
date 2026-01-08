/**
 * Advanced Encryption & Security Module
 * Military-grade encryption for BLOOMCRAWLER RIIS
 */

import crypto from 'crypto';

export interface EncryptionKey {
  id: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305';
  key: Buffer;
  iv: Buffer;
  createdAt: Date;
  expiresAt?: Date;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag?: string;
  keyId: string;
  algorithm: string;
  timestamp: Date;
}

export class AdvancedEncryptionEngine {
  private keys: Map<string, EncryptionKey> = new Map();
  private keyRotationInterval: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeKeys();
    this.startKeyRotation();
  }

  private initializeKeys(): void {
    // Generate initial encryption keys
    this.generateNewKey('aes-256-gcm');
    this.generateNewKey('chacha20-poly1305');
    console.log('[ENCRYPTION] 🔐 Encryption keys initialized');
  }

  private generateNewKey(algorithm: EncryptionKey['algorithm']): EncryptionKey {
    const keyLength = algorithm === 'aes-256-gcm' ? 32 : 32;
    const ivLength = algorithm === 'aes-256-gcm' ? 16 : 12;

    const key: EncryptionKey = {
      id: `key_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      algorithm,
      key: crypto.randomBytes(keyLength),
      iv: crypto.randomBytes(ivLength),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.keyRotationInterval)
    };

    this.keys.set(key.id, key);
    return key;
  }

  private startKeyRotation(): void {
    setInterval(() => {
      console.log('[ENCRYPTION] 🔄 Rotating encryption keys');
      this.rotateKeys();
    }, this.keyRotationInterval);
  }

  private rotateKeys(): void {
    const expiredKeys = Array.from(this.keys.values())
      .filter(key => key.expiresAt && key.expiresAt < new Date());

    expiredKeys.forEach(key => {
      this.keys.delete(key.id);
    });

    // Generate new keys to maintain availability
    this.generateNewKey('aes-256-gcm');
    this.generateNewKey('chacha20-poly1305');

    console.log(`[ENCRYPTION] ✅ Rotated ${expiredKeys.length} expired keys`);
  }

  async encrypt(data: string, algorithm: EncryptionKey['algorithm'] = 'aes-256-gcm'): Promise<EncryptedData> {
    const key = Array.from(this.keys.values())
      .find(k => k.algorithm === algorithm && (!k.expiresAt || k.expiresAt > new Date()));

    if (!key) {
      throw new Error(`No valid ${algorithm} key available`);
    }

    let ciphertext: Buffer;
    let tag: Buffer | undefined;

    if (algorithm === 'aes-256-gcm') {
      const cipher = crypto.createCipherGCM(algorithm, key.key, key.iv);
      ciphertext = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final()
      ]);
      tag = cipher.getAuthTag();
    } else {
      // ChaCha20-Poly1305
      const cipher = crypto.createCipher(algorithm, key.key);
      cipher.setAAD(key.iv);
      ciphertext = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final()
      ]);
      tag = cipher.getAuthTag();
    }

    return {
      ciphertext: ciphertext.toString('base64'),
      iv: key.iv.toString('base64'),
      tag: tag?.toString('base64'),
      keyId: key.id,
      algorithm,
      timestamp: new Date()
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    const key = this.keys.get(encryptedData.keyId);
    if (!key) {
      throw new Error('Encryption key not found');
    }

    const ciphertext = Buffer.from(encryptedData.ciphertext, 'base64');
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const tag = encryptedData.tag ? Buffer.from(encryptedData.tag, 'base64') : undefined;

    let plaintext: Buffer;

    if (encryptedData.algorithm === 'aes-256-gcm') {
      const decipher = crypto.createDecipherGCM(encryptedData.algorithm, key.key, iv);
      if (tag) {
        decipher.setAuthTag(tag);
      }
      plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
      ]);
    } else {
      // ChaCha20-Poly1305
      const decipher = crypto.createDecipher(encryptedData.algorithm, key.key);
      decipher.setAAD(iv);
      if (tag) {
        decipher.setAuthTag(tag);
      }
      plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
      ]);
    }

    return plaintext.toString('utf8');
  }

  async generateSecureToken(length: number = 32): Promise<string> {
    return crypto.randomBytes(length).toString('hex');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [saltHex, hashHex] = hashedPassword.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const hash = Buffer.from(hashHex, 'hex');

    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return crypto.timingSafeEqual(hash, verifyHash);
  }

  getKeyStats(): Record<string, any> {
    const stats = {
      totalKeys: this.keys.size,
      activeKeys: Array.from(this.keys.values()).filter(k => !k.expiresAt || k.expiresAt > new Date()).length,
      expiredKeys: Array.from(this.keys.values()).filter(k => k.expiresAt && k.expiresAt <= new Date()).length,
      algorithms: [...new Set(Array.from(this.keys.values()).map(k => k.algorithm))]
    };

    return stats;
  }
}

/**
 * Secure Communication Channel
 */
export class SecureChannel {
  private encryption: AdvancedEncryptionEngine;

  constructor(encryption: AdvancedEncryptionEngine) {
    this.encryption = encryption;
  }

  async sendSecureMessage(message: any, recipient: string): Promise<EncryptedData> {
    const serializedMessage = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString(),
      sender: 'bloomcrawler_riis',
      recipient
    });

    return await this.encryption.encrypt(serializedMessage);
  }

  async receiveSecureMessage(encryptedMessage: EncryptedData): Promise<any> {
    const decryptedMessage = await this.encryption.decrypt(encryptedMessage);
    return JSON.parse(decryptedMessage);
  }
}

/**
 * Digital Signature Engine
 */
export class DigitalSignatureEngine {
  private keyPair: crypto.KeyPairKeyObjectResult;

  constructor() {
    this.keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  }

  async sign(data: string): Promise<string> {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(this.keyPair.privateKey, 'base64');
  }

  async verify(data: string, signature: string, publicKey?: string): Promise<boolean> {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);

    const keyToUse = publicKey ? crypto.createPublicKey(publicKey) : this.keyPair.publicKey;
    return verify.verify(keyToUse, signature, 'base64');
  }

  getPublicKey(): string {
    return this.keyPair.publicKey.export({ type: 'spki', format: 'pem' }) as string;
  }
}

/**
 * Quantum-Resistant Encryption (Future-Proofing)
 */
export class QuantumResistantEncryption {
  // Placeholder for quantum-resistant algorithms
  // Will implement when quantum computing becomes viable threat

  async encrypt(data: string): Promise<EncryptedData> {
    // For now, fall back to classical encryption
    console.warn('[QUANTUM] ⚠️ Using classical encryption - quantum resistance not yet implemented');
    const classical = new AdvancedEncryptionEngine();
    return await classical.encrypt(data);
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    // For now, fall back to classical decryption
    const classical = new AdvancedEncryptionEngine();
    return await classical.decrypt(encryptedData);
  }
}

// Global encryption instance
export const encryptionEngine = new AdvancedEncryptionEngine();
export const secureChannel = new SecureChannel(encryptionEngine);
export const signatureEngine = new DigitalSignatureEngine();
