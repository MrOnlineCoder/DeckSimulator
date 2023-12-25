export function generateShortId() {
  return Math.random().toString(36).substring(2, 9)
}
