import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Main from "./Main";
import "./App.css";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function MyApp() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <>
      <Box
        data-theme={theme.palette.mode}
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          padding: 0,
          margin: 0,
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1a1c20 0%, #0f1013 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div className="toggle-color-mode">
          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </div>
        <Main />
      </Box>
    </>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
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
          mode,
          primary: {
            main: mode === "light" ? "#1a237e" : "#8c9eff", // Deep Navy (Light) vs Lighter Indigo (Dark)
          },
          secondary: {
            main: "#c5a14d", // Muted Gold
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(30, 30, 30, 0.6)", // Semi-transparent for glassmorphism base
          },
          text: {
            primary: mode === "light" ? "#1a202c" : "#ffffff",
            secondary: mode === "light" ? "#4a5568" : "#a0aec0",
          },
        },
        typography: {
          fontFamily: "'Assistant', sans-serif",
          h1: { fontFamily: "'FrankRuehl', serif", fontWeight: 800 },
          h2: { fontFamily: "'FrankRuehl', serif", fontWeight: 700 },
          h3: { fontFamily: "'FrankRuehl', serif", fontWeight: 700 },
          h4: { fontFamily: "'FrankRuehl', serif", fontWeight: 700 },
          h5: { fontFamily: "'FrankRuehl', serif", fontWeight: 600 },
          h6: { fontFamily: "'FrankRuehl', serif", fontWeight: 600 },
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
          <MyApp />
        </ThemeProvider>
      </CacheProvider>
    </ColorModeContext.Provider>
  );
}
