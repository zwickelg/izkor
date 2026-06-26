// src/pages/DetailsPage.tsx
import React from "react";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate, useLocation } from "react-router-dom";
import { decompressShortStringToJson } from "../utils/compressUtil";
import { updateFields } from "../../features/izkor/izkorSlice";
import { formatHebrewDate } from "../utils/hebrewDate";
import styles from "./PrayersAllPrint.module.css";
import "./PrayersAllPrint.css";
import PrayerStart from "./PrayerStart";
import PrayerThilimLG from "./PrayerThilimLG";
import PrayerThilimTZ from "./PrayerThilimTZ";
import PrayerThilimYZ from "./PrayerThilimYZ";
import PrayerThilimAB from "./PrayerThilimAB";
import PrayerThilimZA from "./PrayerThilimZA";
import PrayerThilimKD from "./PrayerThilimKD";
import PrayerThilimKL from "./PrayerThilimKL";
import PrayerName from "./PrayerName";
import PrayerKadhshYatom from "./PrayerKadhshYatom";
import PrayerElMaleRahamim from "./PrayerElMaleRahamim";
import PrayerEnd from "./PrayerEnd";

const PrayerAllPrint: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handlePrint = () => {
    try {
      if (window.print) {
        window.print();
      } else {
        alert("הדפסה אינה נתמכת בדפדפן זה. אנא נסה לפתוח בדפדפן אחר (כמו כרום).");
      }
    } catch (e) {
      console.error("Print error:", e);
    }
  };

  const handleClose = () => {
    window.close();
  };

  useEffect(() => {
    // Check both hash-based search and standard window search for robustness with HashRouter
    const searchParams = new URLSearchParams(location.search || window.location.search);
    const encodedString = searchParams.get("data");

    if (encodedString) {
      try {
        const decodedString = decodeURIComponent(encodedString);
        const izkorData = decompressShortStringToJson(decodedString);
        dispatch(updateFields(izkorData));
      } catch (error) {
        console.error("Error decoding print data:", error);
      }
    }

    // Give a small delay for state update and rendering before print
    // On mobile, we avoid auto-printing to prevent browser blocks
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [location.search, dispatch]);

  // Determine which chapters to show
  const showThilim = (chapter: string) => {
    switch (chapter) {
      case "LG": return <PrayerThilimLG />;
      case "TZ": return <PrayerThilimTZ />;
      case "YZ": return <PrayerThilimYZ />;
      case "AB": return <PrayerThilimAB />;
      case "ZA": return <PrayerThilimZA />;
      case "KD": return <PrayerThilimKD />;
      case "KL": return <PrayerThilimKL />;
      default: return null;
    }
  };

  const izkorData = useSelector((state: RootState) => state.izkor);

  return (
    <div className="scrollable-page">
      <div className="print-actions no-print">
        <button className="print-button" onClick={handlePrint} onTouchEnd={handlePrint}>הדפס</button>
        <button onClick={handleClose}>סגור</button>
      </div>

      <div className="no-print print-info-note">
        אם כפתור ההדפסה לא מגיב, ניתן להשתמש בתפריט הדפדפן (שלוש נקודות) ובחירה ב"שתף" ואז "הדפס".
      </div>

      <div className="print-content">
        {/* Cover page */}
        <section className="print-section print-cover">
          <div className="print-cover-frame">
            <div className="print-cover-image-wrap">
              <img
                src={`${process.env.PUBLIC_URL}/images/Izkor.png`}
                alt="יזכור"
                className="print-cover-image"
              />
            </div>

            <div className="print-cover-details">
              <div className="print-cover-name">
                {izkorData.firstName}{izkorData.lastName ? ` ${izkorData.lastName}` : ""}{" "}
                <span className="print-cover-zl">ז״ל</span>
              </div>
              {izkorData.parentName && (
                <div className="print-cover-detail-line">
                  {izkorData.gender === "male" ? "בן" : "בת"} {izkorData.parentName}
                </div>
              )}
              {izkorData.deathDate && (
                <div className="print-cover-detail-line">
                  {izkorData.gender === "male" ? "נפטר" : "נפטרה"}{" "}
                  {formatHebrewDate(izkorData.deathDate)}
                  <span className="print-cover-detail-greg">
                    {"  "}({new Date(izkorData.deathDate + "T00:00:00").toLocaleDateString("he-IL")})
                  </span>
                </div>
              )}
              <div className="print-cover-tantzba">תנצב״ה</div>
            </div>
          </div>
        </section>

        <section className="print-section">
          <PrayerStart />
        </section>

        <section className="print-section">
          <PrayerThilimLG />
        </section>
        <section className="print-section">
          <PrayerThilimTZ />
        </section>
        <section className="print-section">
          <PrayerThilimYZ />
        </section>
        <section className="print-section">
          <PrayerThilimAB />
        </section>
        <section className="print-section">
          <PrayerThilimZA />
        </section>
        <section className="print-section">
          <PrayerThilimKD />
        </section>
        <section className="print-section">
          <PrayerThilimKL />
        </section>

        <section className="print-section">
          <PrayerName name={izkorData.firstName} />
        </section>

        <section className="print-section">
          <PrayerName name="נשמה" />
        </section>

        <section className="print-section">
          <PrayerKadhshYatom />
        </section>

        <section className="print-section">
          <PrayerElMaleRahamim />
        </section>

        <section className="print-section">
          <PrayerEnd />
        </section>
      </div>
    </div>
  );
};
export default PrayerAllPrint;
