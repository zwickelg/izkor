declare global {
  interface Window {
    NDEFReader: any;
  }
}

export async function handleWrite(text: string) {
  try {
    if (!("NDEFReader" in window)) {
      throw new Error("לא ניתן לצרוב את הכרטיס");
    } else {
      console.log("NFC handleWrite");
      const ndef = new (window as any).NDEFReader();
      await ndef.write(text);
      console.log("> Message written");
    }
  } catch (err: any) {
    throw new Error(`${err.message}`);
  }
}
export class NfcTagNotEmptyError extends Error {
  constructor() { super("הכרטיס כבר מכיל מידע"); }
}

export async function handleWriteUrl(url: string, overwrite = false) {
  if (!("NDEFReader" in window)) {
    throw new Error("NFC אינו נתמך. יש להשתמש ב-Chrome על אנדרואיד עם NFC מופעל.");
  }
  const urlRecord = { recordType: "url", data: url };
  const ndef = new (window as any).NDEFReader();
  try {
    await ndef.write({ records: [urlRecord] }, { overwrite });
  } catch (err: any) {
    if (!overwrite && (err.name === "NotAllowedError" || err.message?.includes("empty"))) {
      throw new NfcTagNotEmptyError();
    }
    throw new Error(err.message || "שגיאה בכתיבה לכרטיס");
  }
}

export async function handleRead() {
  console.log("NFC handleRead");
  let message = null;
  try {
    if (!("NDEFReader" in window)) {
      alert("לא ניתן לצרוב את הכרטיס");
      console.log("Web NFC is not available. Use Chrome on Android.");
      return;
    } else {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      console.log("> Scan started");

      ndef.addEventListener("readingerror", () => {
        console.log(
          "Oops! Cannot read data from the NFC tag. Try another one?"
        );
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);

        alert(`> Serial Number: ${serialNumber}`);
        alert(`> Records: (${message.records.length})`);
        alert(JSON.stringify(message));
      });
      return message;
    }
  } catch (err: any) {
    alert(`Error ${err.message}`);
  }
}
