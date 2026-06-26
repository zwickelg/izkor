import React from "react";
import { useNavigate } from "react-router-dom";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
//import prayersButtons from "./PrayerButtons.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface PrayerThilimPageProps {
  ind: number;
  handlePrev?: () => void;
  handleNext?: () => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
}

const PrayerButtons: React.FC<PrayerThilimPageProps> = ({
  ind,
  handlePrev: customHandlePrev,
  handleNext: customHandleNext,
  disabledPrev = false,
  disabledNext = false,
}) => {
  const navigate = useNavigate();

  const handlePrev = customHandlePrev
    ? customHandlePrev
    : () => {
      if (!disabledPrev) {
        if (ind - 1 < 0) navigate("/");
        else navigate(`/page${ind - 1}`);
        window.scrollTo(0, 0);
      }
    };

  const handleNext = customHandleNext
    ? customHandleNext
    : () => {
      if (!disabledNext) {
        console.log("handleNext " + ind);
        if (ind + 1 > 14) navigate("/");
        else navigate(`/page${ind}`);
        window.scrollTo(0, 0);
      }
    };

  if (ind === 1 && !disabledPrev) {
    return (
      <div>
        <div className="buttonsDiv" style={{ justifyContent: "space-between", padding: "16px 24px", alignItems: "center" }}>
          <Fab color="primary" aria-label="back" size="small" onClick={handlePrev}>
            <ArrowRightIcon />
          </Fab>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleNext}
            sx={{ borderRadius: "50px", px: 6, py: 1.5, fontSize: "1.5rem", fontWeight: "bold" }}
          >
            התחל
          </Button>

          <div style={{ width: 40 }} />
        </div>
      </div>
    );
  }

  if (disabledPrev) {
    return (
      <div>
        <div className="buttonsDiv" style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleNext}
            sx={{ borderRadius: "50px", px: 6, py: 1.5, fontSize: "1.5rem", fontWeight: "bold" }}
          >
            התחל
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="buttonsDiv">
        <Fab color="primary" aria-label="add" size="small" onClick={handlePrev}>
          <ArrowRightIcon />
        </Fab>

        <Fab color="primary" aria-label="add" size="small" onClick={handleNext}>
          <ArrowLeftIcon />
        </Fab>
      </div>
    </div>
  );
};

export default PrayerButtons;
