import React from "react";
import { useState, useEffect } from "react";

import styles from "./SplashScreen.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";

interface CustomDocument extends Document {
  fullscreenElement: Element | null;
  webkitFullscreenElement: Element | null;
  msFullscreenElement: Element | null;
}
interface CustomHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}
const SplashScreen = () => {
  const navigate = useNavigate();
  const [showFullScreenButton, setShowFullScreenButton] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFullScreenChange = () => {
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
    navigate("/page0");
  };

  return (
    <div className={styles.page}>
      <div className={styles.splashIcon} onClick={handleFullScreen}>
        <img src="images/izkor.png" alt="יזכור" />
      </div>
    </div>
  );
};

export default SplashScreen;
