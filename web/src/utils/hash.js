export function randomStr() {
  let r = Math.random().toString(36).substring(7);
  return r;
}