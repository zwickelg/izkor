import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import Main from "./Main";
import { triggerShareDialog } from "./shareDialogBridge";
import "./App.css";
import { useLocation } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const FontZoomIcon = ({ sign }: { sign: "+" | "−" }) => (
  <Box sx={{ position: "relative", display: "inline-flex", width: 28, height: 28 }}>
    <SearchIcon sx={{ fontSize: "1.3rem", position: "absolute", top: 0, left: 0 }} />
    <Box component="span" sx={{
      position: "absolute", bottom: -1, right: -3,
      fontSize: "1rem", fontWeight: 900, lineHeight: 1, fontFamily: "sans-serif",
    }}>
      {sign}
    </Box>
  </Box>
);

function MyApp({ fontSize, increaseFont, decreaseFont }: { fontSize: number, increaseFont: () => void, decreaseFont: () => void }) {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const location = useLocation();
  const isPrintPage = location.pathname === "/print";
  const isPrayerPage = location.pathname === "/page2";
  const isDetailsPage = location.pathname === "/page1";
  const formData = useSelector((state: RootState) => state.izkor);

  return (
    <>
      <Box
        data-theme={theme.palette.mode}
        data-mode={formData.mode}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          width: "100%",
          padding: 0,
          margin: 0,
          color: "text.primary",
          "--prayer-font-size": `${fontSize}rem`,
          "--primary-color": theme.palette.primary.main,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1a1c20 0%, #0f1013 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        {!isPrintPage && (
          <div className="toggle-color-mode" style={{ display: 'flex', alignItems: 'center' }}>
            {isPrayerPage && (
              <>
                <IconButton onClick={decreaseFont} color="inherit" title="הקטן טקסט" disabled={fontSize <= 1}>
                  <FontZoomIcon sign="−" />
                </IconButton>
                <IconButton onClick={increaseFont} color="inherit" title="הגדל טקסט" disabled={fontSize >= 4}>
                  <FontZoomIcon sign="+" />
                </IconButton>
              </>
            )}
            {isDetailsPage && (
              <IconButton onClick={triggerShareDialog} color="inherit" title="שיתוף">
                <ShareIcon />
              </IconButton>
            )}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </div>
        )}
        <Main />
      </Box>
    </>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const [fontSize, setFontSize] = React.useState<number>(2);
  const increaseFont = () => setFontSize(prev => Math.min(prev + 0.25, 4));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 0.25, 1));

  // Force light mode for printing
  // Use a more robust check that handles both initial load and subsequent navigation
  const isPrintPage = window.location.hash.includes("/print") || window.location.href.includes("/print");
  const currentMode = isPrintPage ? "light" : mode;

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        direction: "rtl",
        palette: {
          mode: currentMode,
          primary: {
            main: currentMode === "light" ? "#2a3eb1" : "#8c9eff", // Indigo Blue (Light) vs Lighter Indigo (Dark)
          },
          secondary: {
            main: "#c5a14d", // Muted Gold
          },
          background: {
            default: currentMode === "light" ? "#f5f5f5" : "#121212",
            paper: currentMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(30, 30, 30, 0.6)", // Semi-transparent for glassmorphism base
          },
          text: {
            primary: currentMode === "light" ? "#1a202c" : "#ffffff",
            secondary: currentMode === "light" ? "#4a5568" : "#a0aec0",
          },
        },
        typography: {
          fontFamily: "'Assistant', sans-serif",
          h1: { fontWeight: 400 },
          h2: { fontWeight: 400 },
          h3: { fontWeight: 400 },
          h4: { fontWeight: 400 },
          h5: { fontWeight: 400 },
          h6: { fontWeight: 400 },
        },
        components: {
          MuiPagination: {
            defaultProps: {
              dir: "rtl",
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none", // More dignified than uppercase
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === "light"
                  ? "0 4px 20px rgba(0,0,0,0.08)"
                  : "0 4px 20px rgba(0,0,0,0.4)",
                backgroundImage: "none", // clean look
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                borderRadius: "12px",
                margin: "0 4px",
                border: "1px solid rgba(128, 128, 128, 0.2) !important",
                backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
                color: mode === "light" ? "#666" : "#aaa",
                transition: "all 0.15s ease-in-out",
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "#000000 !important",
                  color: "#ffffff !important",
                  fontWeight: "bold",
                  // 3D Shadow effect: deep bottom shadow and subtle inner highlight
                  boxShadow: mode === "light"
                    ? "0 4px 0px 0px #333, inset 0 1px 0px rgba(255,255,255,0.2)"
                    : "0 4px 0px 0px #333, inset 0 1px 0px rgba(255,255,255,0.2)",
                  transform: "translateY(-2px)",
                  "&:hover": {
                    backgroundColor: "#1a1a1a !important",
                    boxShadow: mode === "light"
                      ? "0 2px 0px 0px #333, inset 0 1px 0px rgba(255,255,255,0.2)"
                      : "0 2px 0px 0px #333, inset 0 1px 0px rgba(255,255,255,0.2)",
                    transform: "translateY(-1px)",
                  },
                },
                "&:hover": {
                  backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)",
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  // Create rtl cache
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <MyApp fontSize={fontSize} increaseFont={increaseFont} decreaseFont={decreaseFont} />
        </ThemeProvider>
      </CacheProvider>
    </ColorModeContext.Provider>
  );
}
