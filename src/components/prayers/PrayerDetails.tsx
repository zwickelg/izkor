// src/pages/DetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import PrayerButtons from "../utils/PrayerButtons";
import { handleWriteUrl } from "../utils/NfcHandler";
import { compressJsonToShortString } from "../utils/compressUtil";
import * as clipboard from "clipboard-polyfill";
import { registerShareDialog, unregisterShareDialog } from "../../shareDialogBridge";
import IconButton from "@mui/material/IconButton";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import DirectionsIcon from "@mui/icons-material/Directions";
import TapAndPlayIcon from "@mui/icons-material/TapAndPlay";
import {
  Container,
  Stack,
  Fade,
  Grow,
  Box,
  Typography,
  Card,
  CardContent,
  Drawer,
} from "@mui/material";

const baseUrl = "https://zwickelg.github.io/izkor";

const ShareOption = ({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color?: string; onClick: () => void }) => (
  <Box sx={{ textAlign: "center", cursor: "pointer", minWidth: 64 }} onClick={onClick}>
    <IconButton sx={{ bgcolor: color || "action.hover", color: color ? "white" : "inherit", mb: 0.5 }}>
      {icon}
    </IconButton>
    <Typography variant="caption" display="block" sx={{ lineHeight: 1.2 }}>{label}</Typography>
  </Box>
);

interface CustomDocument extends Document {
  fullscreenElement: Element | null;
  webkitFullscreenElement: Element | null;
  msFullscreenElement: Element | null;
}

interface CustomHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}

// Helper component for detail rows
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      py: 1,
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      color="primary.main"
      sx={{ minWidth: "120px" }}
    >
      {label}:
    </Typography>
    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
);

const PrayerDetails: React.FC = () => {
  const [compressedUrl, setCompressedUrl] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.izkor);

  useEffect(() => {
    registerShareDialog(() => setShareOpen(true));
    return () => unregisterShareDialog();
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      console.log("handleFullScreenChange");
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange,
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullScreenChange,
      );
    };
  }, []);

  const handleFullScreen = () => {
    const elem = document.documentElement as CustomHTMLElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const handleNext = () => {
    console.log("handleNext");
    handleFullScreen();
    navigate(`/page2`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const compressed = compressJsonToShortString(formData);
    setCompressedUrl(compressed);
  }, [formData]);

  const handleCopyClickPolyfill = (textValue: string) => {
    console.log("handleCopyClickPolyfill textValue " + textValue);
    clipboard.writeText(textValue).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text to clipboard:", err);
      },
    );
  };

  const handlePrint = () => {
    if (!compressedUrl) return;

    // For HashRouter, the route must be after #/
    const printUrl = `${window.location.origin}${window.location.pathname}#/print?data=${encodeURIComponent(compressedUrl)}`;

    // On mobile, specifying width/height often triggers buggy popup behaviors.
    // Opening in a new tab (_blank) is more reliable.
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(printUrl, "_blank");
    } else {
      const width = 800;
      const height = 900;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(
        printUrl,
        "PrintIzkor",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );
    }
  };
  const handleShareWithWaze = () => {
    let lat = 31.8999482;
    let lng = 34.8298554;
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, "_blank");
  };

  const handleShareWithWhatsApp = () => {
    console.log("handleShareWithWhatsApp compressedUrl " + compressedUrl);
    const shareableUrl = `${baseUrl}/#/?data=${encodeURIComponent(compressedUrl)}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareableUrl)}`,
      "_blank",
    );
  };

  const handleCopyClick = () => {
    console.log("handleCopyClick textValue " + compressedUrl);
    const fullUrl = `${baseUrl}/#/?data=${encodeURIComponent(compressedUrl)}`;
    if (navigator && navigator.clipboard)
      navigator.clipboard.writeText(fullUrl);
    else {
      handleCopyClickPolyfill(fullUrl);
    }
  };

  const handleNfcClick = async () => {
    const fullUrl = `${baseUrl}/#/?data=${encodeURIComponent(compressedUrl)}`;
    console.log("handleNfxClick textValue " + fullUrl);
    await handleWriteUrl(fullUrl);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        pt: 10,
        pb: 12,
      }}
    >
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={`${baseUrl}/images/Izkor.png`}
              alt="יזכור"
              style={{
                borderRadius: "50%",
                maxWidth: "120px",
                filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mb: 0,
                color: "#ffffff",
                fontFamily: "FrankRuehl, sans-serif",
                fontWeight: "normal",
                letterSpacing: "8px",
                textShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {formData.gender === "female" ? "פרטי המנוחה" : "פרטי המנוח"}
            </Typography>
          </Box>
        </Fade>

        <Grow in={true} timeout={1200}>
          <Card
            elevation={8}
            sx={{
              backdropFilter: "blur(20px)",
              background: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "24px",
              overflow: "visible",
            }}
          >
            <CardContent
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Stack spacing={0.5}>
                <DetailRow label="שם" value={formData.firstName} />
                <DetailRow label="שם משפחה" value={formData.lastName} />
                <DetailRow
                  label="מין"
                  value={formData.gender === "female" ? "נקבה" : "זכר"}
                />
                <DetailRow
                  label={
                    formData.gender === "male" &&
                    formData.version === "ashkenazic"
                      ? "שם האב"
                      : "שם האם"
                  }
                  value={formData.parentName}
                />
                <DetailRow
                  label="גירסה"
                  value={formData.version === "sephardic" ? "ספרד" : "אשכנז"}
                />
              </Stack>

            </CardContent>
          </Card>
        </Grow>
      </Stack>
      <PrayerButtons
        ind={1}
        disabledPrev={formData.mode === "readonly"}
        handleNext={handleNext}
      />

      {/* Share Drawer */}
      <Drawer
        anchor="bottom"
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        PaperProps={{
          sx: { borderRadius: "20px 20px 0 0", px: 3, pb: 5, pt: 2 },
        }}
      >
        <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: "text.disabled", mx: "auto", mb: 2 }} />
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3, fontFamily: "FrankRuehl, sans-serif" }}>
          שיתוף
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap>
          <ShareOption
            icon={<img src={`${baseUrl}/images/WhatsappWhite.svg`} alt="WhatsApp" style={{ width: 24, height: 24 }} />}
            label="WhatsApp"
            color="#25D366"
            onClick={() => { handleShareWithWhatsApp(); setShareOpen(false); }}
          />
          <ShareOption
            icon={<ContentCopyOutlinedIcon />}
            label="העתק קישור"
            onClick={() => { handleCopyClick(); setShareOpen(false); }}
          />
          <ShareOption
            icon={<LocalPrintshopOutlinedIcon />}
            label="הדפסה"
            onClick={() => { handlePrint(); setShareOpen(false); }}
          />
          <ShareOption
            icon={<DirectionsIcon />}
            label="Waze"
            color="#00CAFF"
            onClick={() => { handleShareWithWaze(); setShareOpen(false); }}
          />
          {formData.mode !== "readonly" && (
            <ShareOption
              icon={<TapAndPlayIcon />}
              label="NFC"
              onClick={() => { handleNfcClick(); setShareOpen(false); }}
            />
          )}
        </Stack>
      </Drawer>
    </Container>
  );
};

export default PrayerDetails;
