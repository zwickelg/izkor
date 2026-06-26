// src/features/sephardicAshkenazic/Form.tsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { decompressShortStringToJson } from "../utils/compressUtil";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  setFirstName,
  setLastName,
  setGender,
  setParentName,
  setVersion,
  updateFields,
} from "../../features/izkor/izkorSlice";
import {
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Fade,
  Grow
} from "@mui/material";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface PrayerThilimPageProps {
  theme?: string | undefined;
}

const MainForm: React.FC<PrayerThilimPageProps> = ({ theme = "dark" }) => {
  console.log("theme " + theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.izkor);
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Step 2: Add validation state
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    err: "",
    // ... add other fields here
  });
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    // Check both hash-based search and standard window search for robustness with HashRouter
    const searchParams = new URLSearchParams(location.search || window.location.search);
    const encodedString = searchParams.get("data");

    if (encodedString) {
      try {
        const decodedString = decodeURIComponent(encodedString);

        const izkor = decompressShortStringToJson(decodedString);
        dispatch(
          updateFields({
            firstName: izkor.firstName,
            lastName: izkor.lastName,
            gender: izkor.gender,
            parentName: izkor.parentName,
            version: izkor.version,
          })
        );
        navigate("/page1");
        // You can perform additional checks or logic here
        // and decide where to redirect based on the decoded object.
      } catch (error) {
        console.error("Error decoding JSON:", error);
        // Handle decoding error, redirect to an error page, etc.
      }
    }
  }, [location.search]);
  /*   useEffect(() => {
    _resetValidationErrors();
  }, [validationErrors]); */
  const handleNext = () => {
    const errors = {
      firstName: formData.firstName.trim() === "" ? "הכנס שם פרטי" : "",
      /*       lastName: formData.lastName.trim() === "" ? "הכנס שם משפחה" : "",
       */ err: "",
      // ... add validation for other fields here
    };

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    console.log("hasErrors: " + hasErrors);
    if (hasErrors) {
      console.log("setValidationErrors: " + errors);
      setValidationErrors(errors);
      _resetValidationErrors();
    } else {
      // No validation errors, proceed to next step

      navigate("/page1");
    }
  };
  const _resetValidationErrors = async () => {
    await _sleep(3000);
    setValidationErrors({
      firstName: "",
      err: "",
    });
  };
  const _sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    let errors = {
      firstName: "",
      err: "",
    };
    // Validate the input value using a regular expression
    if (/^[-' \u0590-\u05FF]*$/.test(newValue)) {
      dispatch(setFirstName(e.target.value));
    } else {
      errors.err = "אותיות עבריות בלבד";
      // Check if there are any validation errors
      console.log("setValidationErrors: " + errors);
    }
    setValidationErrors(errors);
    _resetValidationErrors();
  };

  const handleGender = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newGender: any
  ) => {
    if (newGender !== null) {
      dispatch(setGender(newGender as "male" | "female"));
    }
  };
  const handleVersion = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newGender: any
  ) => {
    if (newGender !== null) {
      dispatch(setVersion(newGender as "sephardic" | "ashkenazic"));
    }
  };
  return (
    <Container maxWidth="sm" sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", pt: 10, pb: 12 }}>
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#ffffff', fontWeight: 'normal', letterSpacing: '8px', textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
              פרטי המנוח
            </Typography>
          </Box>
        </Fade>

        <Grow in={true} timeout={1200}>
          <Card
            elevation={8}
            sx={{
              backdropFilter: "blur(20px)",
              background: "background.paper", // Uses global theme value
              border: "1px solid",
              borderColor: "divider",
              overflow: "visible"
            }}
          >
            <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2.0 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 0.5, fontWeight: 600 }}>
                  שם פרטי
                </Typography>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  className="gray-gradient-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  inputRef={inputRef}
                  error={Boolean(validationErrors.firstName)}
                  helperText={validationErrors.firstName}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 0.5, fontWeight: 600 }}>
                  שם משפחה
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  className="gray-gradient-input"
                  value={formData.lastName}
                  onChange={(e) => dispatch(setLastName(e.target.value))}
                />
              </Box>

              <Box>
                <Typography variant="body2" color='#ffffff' gutterBottom>
                  לשון הפניה
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={formData.gender}
                  exclusive
                  onChange={handleGender}
                  fullWidth
                  aria-label="מין"
                >
                  <ToggleButton value="male" aria-label="גבר">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ManIcon />
                      <Typography>גבר</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="female" aria-label="אישה">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WomanIcon />
                      <Typography>אישה</Typography>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="body2" color='#ffffff' gutterBottom>
                  נוסח
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={formData.version}
                  exclusive
                  onChange={handleVersion}
                  fullWidth
                  aria-label="נוסח"
                >
                  <ToggleButton value="ashkenazic">
                    <Typography>אשכנז</Typography>
                  </ToggleButton>
                  <ToggleButton value="sephardic">
                    <Typography>ספרד</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 0.5, fontWeight: 600 }}>
                  {formData.gender === "male" && formData.version === "ashkenazic"
                    ? "שם האב"
                    : "שם האם"}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  className="gray-gradient-input"
                  value={formData.parentName}
                  onChange={(e) => dispatch(setParentName(e.target.value))}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 0,
            zIndex: 1000,
            background: "transparent"
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleNext}
            sx={{
              py: 2,
              px: 4,
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#000000",
              borderRadius: 0, // Full width bottom bar
              justifyContent: "flex-end",
              background: "linear-gradient(270deg, rgba(255, 255, 255, 0) -0.18%, rgba(255, 255, 255, 0.9) 100.18%)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(270deg, rgba(255, 255, 255, 0.1) -0.18%, rgba(255, 255, 255, 1) 100.18%)",
              },
              "& .MuiButton-endIcon": {
                color: "#000000",
                marginLeft: 1
              }
            }}
            endIcon={<ArrowLeftIcon sx={{ fontSize: '2.5rem !important' }} />}
          >
            המשך
          </Button>
        </Box>
      </Stack>
    </Container >
  );
};

export default MainForm;
