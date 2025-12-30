import React, { useState } from "react";
declare global {
  interface Window {
    NDEFReader: any;
  }
}

const NfcReadWrite: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleWrite = async () => {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.write(text);
      console.log("> Message written");
      alert("> Message written");
    } catch (error) {
      console.log("Argh! " + error);
    }
  };
  const handleRead = async () => {
    console.log("User clicked scan button");

    try {
      if (!("NDEFReader" in window)) {
        alert("Web NFC is not available. Use Chrome on Android");
        console.log("Web NFC is not available. Use Chrome on Android.");
        setResult("Web NFC is not available. Use Chrome on Android.");
        return;
      } else {
        alert("Supported");
        console.log("Supported.");
        setResult("Supported.");
      }
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      console.log("> Scan started");

      ndef.addEventListener("readingerror", () => {
        console.log(
          "Argh! Cannot read data from the NFC tag. Try another one?"
        );
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);

        alert(`> Serial Number: ${serialNumber}`);
        alert(`> Records: (${message.records.length})`);
        alert(JSON.stringify(message));

        setResult(JSON.stringify(message));
      });
    } catch (error) {
      console.log("Argh! " + error);
      setResult("Argh! " + error);
    }
  };

  return (
    <div>
      <h2>NFC Read/Write Component</h2>
      <div>
        <input
          type="text"
          placeholder="Enter text to write"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleWrite}>Write to NFC</button>
      </div>
      <div>
        <button onClick={handleRead}>Read from NFC</button>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default NfcReadWrite;
