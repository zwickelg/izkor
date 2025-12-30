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
    dispatch(setGender(newGender as "male" | "female"));
  };
  const handleVersion = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newGender: any
  ) => {
    dispatch(setVersion(newGender as "sephardic" | "ashkenazic"));
  };
  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", py: 4 }}>
      <Stack spacing={4} sx={{ my: "auto" }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary.main" sx={{ fontFamily: 'FrankRuehl, serif', fontWeight: 'bold', textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
              פרטי המנוח
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              אנא מלא את הפרטים הבאים
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
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

              <TextField
                label="שם פרטי"
                required
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                inputRef={inputRef}
                error={Boolean(validationErrors.firstName)}
                helperText={validationErrors.firstName}
              />

              <TextField
                label="שם משפחה"
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={(e) => dispatch(setLastName(e.target.value))}
              />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
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
                <Typography variant="body2" color="text.secondary" gutterBottom>
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

              <TextField
                label={
                  formData.gender === "male" && formData.version === "ashkenazic"
                    ? "שם האב"
                    : "שם האם"
                }
                fullWidth
                variant="outlined"
                value={formData.parentName}
                onChange={(e) => dispatch(setParentName(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleNext}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderRadius: "50px",
                  background: "linear-gradient(45deg, #1a237e 30%, #534bae 90%)", // Rich gradient
                  boxShadow: "0 3px 5px 2px rgba(26, 35, 126, .3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #000051 30%, #1a237e 90%)",
                  }
                }}
                endIcon={<ArrowLeftIcon />}
              >
                המשך
              </Button>
            </CardContent>
          </Card>
        </Grow>
      </Stack>
    </Container>
  );
};

export default MainForm;
