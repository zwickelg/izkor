// src/pages/DetailsPage.tsx
import React from "react";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate, useLocation } from "react-router-dom";
import { decompressShortStringToJson } from "../utils/compressUtil";
import { updateFields } from "../../features/izkor/izkorSlice";
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
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

    const handleAfterPrint = () => {
      window.close();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // Give a small delay for state update and rendering before print
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      clearTimeout(timer);
    };
  }, [location.search, dispatch]);

  return (
    <div className="scrollable-page">
      <section id="0">
        <PrayerEnd />
      </section>
      <section id="1">
        <PrayerStart />
      </section>

      <section id="2">
        <PrayerThilimLG />
      </section>

      <section id="3">
        <PrayerThilimTZ />
      </section>

      <section id="4">
        <PrayerThilimYZ />
      </section>

      <section id="5">
        <PrayerThilimAB />
      </section>

      <section id="6">
        <PrayerThilimZA />
      </section>

      <section id="7">
        <PrayerThilimKD />
      </section>

      <section id="8">
        <PrayerThilimKL />
      </section>

      <section id="9">
        <PrayerName name="" />
      </section>

      <section id="10">
        <PrayerName name="נשמה" />
      </section>

      <section id="11">
        <PrayerKadhshYatom />
      </section>

      <section id="12">
        <PrayerElMaleRahamim />
      </section>

      <PrayerEnd />
    </div>
  );
};
export default PrayerAllPrint;
