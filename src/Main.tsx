import React from "react";
import { Routes, Route } from "react-router-dom";

import MainForm from "./components/prayers/MainForm";
import PrayerDetails from "./components/prayers/PrayerDetails";
import PrayerStart from "./components/prayers/PrayerStart";
import PrayerAll from "./components/prayers/PrayerAll";
import PrayerAllPrint from "./components/prayers/PrayerAllPrint";
import PrayerThilimLG from "./components/prayers/PrayerThilimLG";
import PrayerThilimTZ from "./components/prayers/PrayerThilimTZ";
import PrayerThilimYZ from "./components/prayers/PrayerThilimYZ";
import PrayerThilimAB from "./components/prayers/PrayerThilimAB";
import PrayerThilimZA from "./components/prayers/PrayerThilimZA";
import PrayerThilimKD from "./components/prayers/PrayerThilimKD";
import PrayerThilimKL from "./components/prayers/PrayerThilimKL";
import PrayerName from "./components/prayers/PrayerName";
import PrayerKadhshYatom from "./components/prayers/PrayerKadhshYatom";
import PrayerElMaleRahamim from "./components/prayers/PrayerElMaleRahamim";
import PrayerEnd from "./components/prayers/PrayerEnd";
import PdfDocument from "./components/IzkorPdfDocument";
import ThemeSwitch from "./components/utils/ThemeSwitch";
import NfcReadWrite from "./components/utils/NfcReadWrite";
import SplashScreen from "./components/SplashScreen";

const Main = () => {
  return (
    <div className={`main `}>
      <Routes>
        <Route index element={<MainForm />} />
        <Route path="/nfc" element={<NfcReadWrite />} />
        <Route path="/page0" element={<MainForm />} />
        <Route path="/page1" element={<PrayerDetails />} />
        <Route path="/page2" element={<PrayerAll />} />
        <Route path="/print" element={<PrayerAllPrint />} />
      </Routes>
    </div>
  );
};
export default Main;
