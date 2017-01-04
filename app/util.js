export function pick_one() {
  return this[Math.floor(Math.random()*this.length)];
}

export function is_string(str) {
  return typeof(str) === 'string' || str instanceof String;
}

export function to_a(len) {
  return [...Array(len).keys()]
}