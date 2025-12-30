// src/PrintComponent.js
import React from "react";

const PrintComponent = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div>
      <button onClick={handlePrint}>Print</button>
      <div style={{ display: "none" }}>סתם טקסט להדפסה</div>
    </div>
  );
};

export default PrintComponent;
