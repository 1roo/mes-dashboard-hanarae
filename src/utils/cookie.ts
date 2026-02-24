export function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; samesite=lax`;
}

export function getCookie(name: string) {
  const key = encodeURIComponent(name) + "=";
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(key))
    ?.slice(key.length);
}

export function removeCookie(name: string) {
  document.cookie = `${encodeURIComponent(
    name,
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
}
