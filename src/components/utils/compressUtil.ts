import LZString from "lz-string";

export function compressJsonToShortString(obj: any): string {
  const jsonString = JSON.stringify(obj);
  const compressedString = LZString.compressToBase64(jsonString);
  return compressedString;
}

export function decompressShortStringToJson(shortString: string): any {
  const jsonString = LZString.decompressFromBase64(shortString);
  return JSON.parse(jsonString);
}
