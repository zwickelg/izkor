// src/pages/DetailsPage.tsx
import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import styles from "./Prayers.module.css";
import prayerDetails from "./PrayerDetails.module.css";
import PrayerButtons from "../utils/PrayerButtons";
import { handleWriteUrl } from "../utils/NfcHandler";
import {
  compressJsonToShortString,
  decompressShortStringToJson,
} from "../utils/compressUtil";
import * as clipboard from "clipboard-polyfill";
import IzkorDocument from "../IzkorPdfDocument";
import NfcAlertDialog from "../utils/NfcAlertDialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
/* import DeleteIcon from "@mui/icons-material/Delete";
 */ import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

interface PrayerThilimPageProps {
  ind: number;
}
interface CustomDocument extends Document {
  fullscreenElement: Element | null;
  webkitFullscreenElement: Element | null;
  msFullscreenElement: Element | null;
}
interface CustomHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}
//const baseUrl = "http://izkor.s3-website-eu-west-1.amazonaws.com/";
const baseUrl = "https://d5ajvage8yosb.cloudfront.net";
const PrayerDetails: React.FC<PrayerThilimPageProps> = ({ ind }) => {
  const [compressedUrl, setCompressedUrl] = useState("");
  const navigate = useNavigate();

  const formData = useSelector((state: RootState) => state.izkor);
  const [showFullScreenButton, setShowFullScreenButton] = useState(true);

  useEffect(() => {
    const handleFullScreenChange = () => {
      console.log("handleFullScreenChange");
      const documentWithFullscreen = document as CustomDocument;
      setShowFullScreenButton(
        !documentWithFullscreen.fullscreenElement &&
          !documentWithFullscreen.webkitFullscreenElement &&
          !documentWithFullscreen.msFullscreenElement
      );
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullScreenChange
      );
    };
  }, []);

  const handleFullScreen = () => {
    // const elem = document.documentElement;
    const elem = document.documentElement as CustomHTMLElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    setShowFullScreenButton(false);
  };
  const handleNext = () => {
    console.log("handleNext");
    handleFullScreen();
    navigate(`/page${ind + 1}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const compressed = compressJsonToShortString(formData);
    if (!compressedUrl) setCompressedUrl(encodeURIComponent(compressed));
  }, []);

  const handleCopyClickPolyfill = (textValue: string) => {
    console.log("handleCopyClickPolyfill textValue " + textValue);

    clipboard.writeText(textValue).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text to clipboard:", err);
      }
    );
  };
  const handlePrint = () => {
    navigate(`/print`);
  };
  const handleShareWithWhatsApp = () => {
    // Copy the encoded string to the clipboard
    console.log("handleShareWithWhatsApp compressedUrl " + compressedUrl);
    // Open WhatsApp with a pre-filled message
    window.open(
      `https://api.whatsapp.com/send?text=${baseUrl}?data=${encodeURIComponent(
        compressedUrl
      )}`
    );
  };

  console.log("navigate PrayerHome: ");
  const handleCopyClick = () => {
    // Copy the text to the clipboard
    console.log("handleCopyClick textValue " + compressedUrl);

    if (navigator && navigator.clipboard)
      navigator.clipboard.writeText(`${baseUrl}?data=${compressedUrl}`);
    else {
      handleCopyClickPolyfill(`${baseUrl}?data=${compressedUrl}`);
    }
  };
  const handleNfcClick = async () => {
    // Copy the text to the clipboard
    console.log(
      "handleNfxClick textValue " + `${baseUrl}?data=${compressedUrl}`
    );
    //alert("קרב את הכרטיס לטלפון ולחץ OK\n");
    await handleWriteUrl(`${baseUrl}?data=${compressedUrl}`);
  };

  return (
    <div className={styles.page}>
      <div className={prayerDetails.detailsPage}>
        <h2 className={prayerDetails.title}>
          {formData.gender === "female" ? "פרטי המנוחה" : "פרטי המנוח"}
        </h2>

        <div className={prayerDetails.detailLabel}>
          שם: {formData.firstName}
        </div>
        <div className={prayerDetails.detailLabel}>
          שם משפחה: {formData.lastName}
        </div>
        <div className={prayerDetails.detailLabel}>
          מין: {formData.gender === "female" ? "נקבה" : "זכר"}
        </div>
        <div className={prayerDetails.detailLabel}>
          {formData.gender === "male" && formData.version === "ashkenazic"
            ? "שם האב"
            : "שם האם"}
          : {formData.parentName}
        </div>
        <div className={prayerDetails.detailLabel}>
          גירסה: {formData.version === "sephardic" ? "ספרד" : "אשכנז"}
        </div>
        <PrayerButtons
          ind={ind}
          disabledPrev={formData.mode === "readonly"}
          handleNext={handleNext}
        />
        <div className={styles.izkorImage}>
          <img src="images/Izkor.png" alt="יזכור" />
        </div>

        <Stack direction="row" spacing={1}>
          <IconButton aria-label="copy" onClick={handlePrint}>
            <LocalPrintshopOutlinedIcon />
          </IconButton>
          <IconButton aria-label="copy" onClick={handleCopyClick}>
            <ContentCopyOutlinedIcon />
          </IconButton>
          <IconButton aria-label="whatsapp" onClick={handleShareWithWhatsApp}>
            <svg
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
              focusable="false"
              aria-hidden="true"
              viewBox="-1.66 0 740.824 740.824"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M630.056 107.658C560.727 38.271 468.525.039 370.294 0 167.891 0 3.16 164.668 3.079 367.072c-.027 64.699 16.883 127.855 49.016 183.523L0 740.824l194.666-51.047c53.634 29.244 114.022 44.656 175.481 44.682h.151c202.382 0 367.128-164.689 367.21-367.094.039-98.088-38.121-190.32-107.452-259.707m-259.758 564.8h-.125c-54.766-.021-108.483-14.729-155.343-42.529l-11.146-6.613-115.516 30.293 30.834-112.592-7.258-11.543c-30.552-48.58-46.689-104.729-46.665-162.379C65.146 198.865 202.065 62 370.419 62c81.521.031 158.154 31.81 215.779 89.482s89.342 134.332 89.311 215.859c-.07 168.242-136.987 305.117-305.211 305.117m167.415-228.514c-9.176-4.591-54.286-26.782-62.697-29.843-8.41-3.061-14.526-4.591-20.644 4.592-6.116 9.182-23.7 29.843-29.054 35.964-5.351 6.122-10.703 6.888-19.879 2.296-9.175-4.591-38.739-14.276-73.786-45.526-27.275-24.32-45.691-54.36-51.043-63.542-5.352-9.183-.569-14.148 4.024-18.72 4.127-4.11 9.175-10.713 13.763-16.07 4.587-5.356 6.116-9.182 9.174-15.303 3.059-6.122 1.53-11.479-.764-16.07-2.294-4.591-20.643-49.739-28.29-68.104-7.447-17.886-15.012-15.466-20.644-15.746-5.346-.266-11.469-.323-17.585-.323-6.117 0-16.057 2.296-24.468 11.478-8.41 9.183-32.112 31.374-32.112 76.521s32.877 88.763 37.465 94.885c4.587 6.122 64.699 98.771 156.741 138.502 21.891 9.45 38.982 15.093 52.307 19.323 21.981 6.979 41.983 5.994 57.793 3.633 17.628-2.633 54.285-22.19 61.932-43.616 7.646-21.426 7.646-39.791 5.352-43.617-2.293-3.826-8.41-6.122-17.585-10.714"
              />
            </svg>
          </IconButton>
          {formData.mode !== "readonly" && (
            <NfcAlertDialog callback={handleNfcClick} />
          )}
          <IzkorDocument />
        </Stack>
      </div>
    </div>
  );
};
export default PrayerDetails;
