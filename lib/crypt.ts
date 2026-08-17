import crypto from 'crypto'

const ALGO = 'aes-256-gcm'
const IV_LEN = 12
const TAG_LEN = 16

function getKey(secret: string) {
  // derive 32-byte key from secret via scrypt
  return crypto.scryptSync(secret, 'salt-neetmarket', 32)
}

export function encrypt(text: string, secret: string) {
  const iv = crypto.randomBytes(IV_LEN)
  const key = getKey(secret)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decrypt(dataB64: string, secret: string) {
  const data = Buffer.from(dataB64, 'base64')
  const iv = data.slice(0, IV_LEN)
  const tag = data.slice(IV_LEN, IV_LEN + TAG_LEN)
  const encrypted = data.slice(IV_LEN + TAG_LEN)
  const key = getKey(secret)
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return out.toString('utf8')
}
