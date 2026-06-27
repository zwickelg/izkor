// src/pages/DetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import PrayerButtons from "../utils/PrayerButtons";
import { handleWriteUrl, NfcTagNotEmptyError } from "../utils/NfcHandler";
import { compressJsonToShortString } from "../utils/compressUtil";
import * as clipboard from "clipboard-polyfill";
import { registerShareDialog, unregisterShareDialog } from "../../shareDialogBridge";
import { formatHebrewDate } from "../utils/hebrewDate";
import IconButton from "@mui/material/IconButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import TapAndPlayIcon from "@mui/icons-material/TapAndPlay";
import CloseIcon from "@mui/icons-material/Close";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Container,
  Stack,
  Fade,
  Grow,
  Box,
  Typography,
  Card,
  CardContent,
  SwipeableDrawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

const baseUrl = window.location.origin;

const formatDeathDate = (dateString: string): string => {
  if (!dateString) return "";
  const gregorian = new Date(dateString + "T00:00:00").toLocaleDateString("he-IL");
  const hebrew = formatHebrewDate(dateString);
  return hebrew ? `${gregorian}  /  ${hebrew}` : gregorian;
};

const ShareOption = ({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color?: string; onClick: () => void }) => (
  <Box sx={{ textAlign: "center", cursor: "pointer", minWidth: 64 }} onClick={onClick}>
    <IconButton sx={{ bgcolor: color || "action.hover", color: color ? "white" : "inherit", mb: 0.5 }}>
      {icon}
    </IconButton>
    <Typography variant="caption" display="block" sx={{ lineHeight: 1.2 }}>{label}</Typography>
  </Box>
);

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
      justifyContent: "center",
      alignItems: "center",
      gap: 1,
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      py: 1,
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
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
  const [nfcOpen, setNfcOpen] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<"idle" | "waiting" | "confirm-overwrite" | "success" | "error">("idle");
  const [nfcError, setNfcError] = useState("");
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.izkor);

  useEffect(() => {
    registerShareDialog(() => setShareOpen(true));
    return () => unregisterShareDialog();
  }, []);

  const handleNext = () => {
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
    const printUrl = `${window.location.origin}${window.location.pathname}#/print?data=${compressedUrl}`;

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
  const handleShareWithWhatsApp = () => {
    const shareableUrl = `${baseUrl}/#/?data=${compressedUrl}`;
    const name = [formData.firstName, formData.lastName].filter(Boolean).join(" ");
    const message = `תפילות לעילוי נשמת ${name} ז״ל\n${shareableUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleCopyClick = () => {
    const fullUrl = `${baseUrl}/#/?data=${compressedUrl}`;
    const name = [formData.firstName, formData.lastName].filter(Boolean).join(" ");
    const text = `תפילות לעילוי נשמת ${name} ז״ל\n${fullUrl}`;
    if (navigator && navigator.clipboard)
      navigator.clipboard.writeText(text);
    else {
      handleCopyClickPolyfill(text);
    }
  };

  const handleNfcClick = () => {
    setNfcStatus("idle");
    setNfcError("");
    setNfcOpen(true);
  };

  const handleNfcWrite = async (overwrite = true) => {
    const fullUrl = `${baseUrl}/#/?data=${compressedUrl}`;
    setNfcStatus("waiting");
    try {
      await handleWriteUrl(fullUrl, overwrite);
      setNfcStatus("success");
    } catch (err: any) {
      if (err instanceof NfcTagNotEmptyError) {
        setNfcStatus("confirm-overwrite");
      } else {
        setNfcStatus("error");
        setNfcError(err.message || "שגיאה לא ידועה");
      }
    }
  };

  const handleNfcClose = () => {
    setNfcOpen(false);
    setNfcStatus("idle");
    setNfcError("");
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
              src={`${process.env.PUBLIC_URL}/images/Izkor.png`}
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
                <DetailRow
                  label="שם"
                  value={[formData.firstName, formData.lastName].filter(Boolean).join(" ") + " ז״ל"}
                />
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
                {formData.deathDate && (
                  <DetailRow label="תאריך פטירה" value={formatDeathDate(formData.deathDate)} />
                )}
                {formData.graveLocation && (
                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 1, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      ניווט לקבר:
                    </Typography>
                    <IconButton
                      onClick={() => window.open(`https://waze.com/ul?ll=${formData.graveLocation!.lat},${formData.graveLocation!.lng}&navigate=yes`, "_blank")}
                      sx={{ p: 0.5 }}
                    >
                      <img src={`${process.env.PUBLIC_URL}/images/waze-icon.svg`} alt="Waze" style={{ width: 40, height: 40 }} />
                    </IconButton>
                  </Box>
                )}
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
      <SwipeableDrawer
        anchor="bottom"
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onOpen={() => setShareOpen(true)}
        swipeAreaWidth={56}
        disableSwipeToOpen
        PaperProps={{
          sx: { borderRadius: "20px 20px 0 0", px: 3, pb: 5, pt: 2, bgcolor: "background.default" },
        }}
      >
        <Box
          onClick={() => setShareOpen(false)}
          sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: "text.disabled", mx: "auto", mb: 2, cursor: "pointer" }}
        />
        <Typography variant="h6" sx={{ fontFamily: "FrankRuehl, sans-serif", textAlign: "center", mb: 3 }}>
          שיתוף
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap>
          <ShareOption
            icon={<WhatsAppIcon />}
            label="WhatsApp"
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
            icon={<TapAndPlayIcon />}
            label="NFC"
            onClick={() => { handleNfcClick(); setShareOpen(false); }}
          />
        </Stack>
      </SwipeableDrawer>

      {/* NFC Dialog */}
      <Dialog
        open={nfcOpen}
        onClose={handleNfcClose}
        dir="rtl"
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: "background.default" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">כתיבה לכרטיס NFC</Typography>
          <IconButton size="small" onClick={handleNfcClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {nfcStatus === "idle" && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <PhoneAndroidIcon sx={{ fontSize: 56, color: "primary.main" }} />
              <Typography align="center">
                לחץ על "התחל כתיבה" ואז קרב כרטיס NFC לגב הטלפון.
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                זמין רק ב-Chrome על אנדרואיד עם NFC מופעל.
              </Typography>
            </Stack>
          )}
          {nfcStatus === "waiting" && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress size={56} />
              <Typography align="center">ממתין לכרטיס NFC...</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                קרב כרטיס NFC לגב הטלפון
              </Typography>
            </Stack>
          )}
          {nfcStatus === "confirm-overwrite" && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 56, color: "warning.main" }} />
              <Typography align="center" fontWeight="bold">
                הכרטיס כבר מכיל מידע
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                האם למחוק את המידע הקיים ולכתוב מחדש?
              </Typography>
            </Stack>
          )}
          {nfcStatus === "success" && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "success.main" }} />
              <Typography align="center" color="success.main">
                הכרטיס נכתב בהצלחה!
              </Typography>
            </Stack>
          )}
          {nfcStatus === "error" && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 56, color: "error.main" }} />
              <Typography align="center" color="error.main">שגיאה בכתיבה</Typography>
              <Typography variant="body2" color="text.secondary" align="center">{nfcError}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
          {nfcStatus === "idle" && (
            <Button variant="contained" onClick={() => handleNfcWrite(true)}>התחל כתיבה</Button>
          )}
          {nfcStatus === "confirm-overwrite" && (<>
            <Button variant="contained" color="warning" onClick={() => handleNfcWrite(true)}>כן, מחק וכתוב</Button>
            <Button onClick={handleNfcClose}>ביטול</Button>
          </>)}
          {nfcStatus === "error" && (
            <Button variant="contained" onClick={() => handleNfcWrite(true)}>נסה שוב</Button>
          )}
          {(nfcStatus === "success" || nfcStatus === "error") && (
            <Button onClick={handleNfcClose}>סגור</Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrayerDetails;
