import LZString from "lz-string";

export function compressJsonToShortString(obj: any): string {
  const b64 = LZString.compressToBase64(JSON.stringify(obj));
  // Convert to URL-safe Base64: +→- /→_ no padding — safe for URLs, no %2B
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decompressShortStringToJson(shortString: string): any {
  // 1. Try URL-safe Base64 (new format). Old standard Base64 also works here
  //    since it never contains - or _, so replacement is a no-op.
  try {
    const b64 = shortString.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
    const json = LZString.decompressFromBase64(padded);
    if (json) return JSON.parse(json);
  } catch {}
  // 2. EncodedURIComponent format (brief transition period)
  try {
    const json = LZString.decompressFromEncodedURIComponent(shortString);
    if (json) return JSON.parse(json);
  } catch {}
  // 3. Old plain Base64 final fallback
  return JSON.parse(LZString.decompressFromBase64(shortString));
}
