// Simple in-memory CAPTCHA store for development.
// NOTE: This is suitable for local or single-instance deployments only.
// Replace with Redis or a persistent store for production.

const store = new Map();
const TTL = 5 * 60 * 1000 // 5 minutes

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`
}

export function createCaptcha(len = 5) {
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < len; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)]
  const id = genId()
  const timer = setTimeout(() => store.delete(id), TTL)
  store.set(id, { code, timer })
  return { id, code }
}

export function verifyCaptcha(id, entry) {
  if (!id || !entry) return false
  const rec = store.get(id)
  if (!rec) return false
  const ok = String(entry).toUpperCase() === rec.code
  clearTimeout(rec.timer)
  store.delete(id)
  return ok
}
