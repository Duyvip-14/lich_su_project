export function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`dong-su-viet:${key}`)) ?? fallback; } catch { return fallback; }
}
export function write(key, value) {
  try { localStorage.setItem(`dong-su-viet:${key}`, JSON.stringify(value)); return true; } catch { return false; }
}
