import LZString from "lz-string";

export function compressJsonToShortString(obj: any): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(obj));
}

export function decompressShortStringToJson(shortString: string): any {
  // Try new format (EncodedURIComponent) first, fall back to old Base64 format
  try {
    const json = LZString.decompressFromEncodedURIComponent(shortString);
    if (json) return JSON.parse(json);
  } catch {}
  const json = LZString.decompressFromBase64(shortString);
  return JSON.parse(json);
}
