export function nanoid(size = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const arr = new Uint8Array(size)
  crypto.getRandomValues(arr)
  arr.forEach((n) => (result += chars[n % chars.length]))
  return result
}
