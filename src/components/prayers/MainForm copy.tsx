// src/features/sephardicAshkenazic/Form.tsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { decompressShortStringToJson } from "../utils/compressUtil";
import Fab from "@mui/material/Fab";
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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import { RootState } from "../../app/store";
import styles from "./Prayers.module.css";
import mainForm from "./MainForm.module.css"; // Import the CSS module
import { useNavigate } from "react-router-dom";
import ImageUpload from "../utils/ImageUpload";

interface PrayerThilimPageProps {
  ind: number;
  theme?: string | undefined;
}

const MainForm: React.FC<PrayerThilimPageProps> = ({ ind, theme = "dark" }) => {
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
    const searchParams = new URLSearchParams(location.search);
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
    <div className={styles.page}>
      <div className={mainForm.formContainer}>
        <h2 className={mainForm.title}>
          {formData.gender === "female" ? "פרטי המנוחה" : "פרטי המנוח"}
        </h2>

        <FormControl>
          <div className={mainForm.row}>
            <TextField
              id="outlined-basic"
              placeholder="שם פרטי של הנפטר(ת)"
              label="שם פרטי"
              variant="outlined"
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { justifyContent: "right" },
              }}
              className={mainForm.input}
              value={formData.firstName}
              onChange={handleChange}
              ref={inputRef}
              error={Boolean(validationErrors.firstName ? true : false)}
              helperText={validationErrors.firstName}
              sx={{ marginBottom: "16px" }}
            />
            {validationErrors.err && (
              <span className={mainForm.errorText}>{validationErrors.err}</span>
            )}
          </div>
          <TextField
            id="outlined-basic"
            placeholder="שם משפחה של הנפטר(ת)"
            label="שם משפחה"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.lastName}
            style={{ marginBottom: "16px" }} // Add bottom margin
            onChange={(e) => dispatch(setLastName(e.target.value))}
          />
          {/*           <div className={mainForm.formGroup}>
            <div className={mainForm.errorText}>
              {validationErrors.lastName}
            </div>
          </div> */}
          <FormLabel id="demo-row-radio-buttons-group-label">מין</FormLabel>
          <div className={mainForm.genderDiv}>
            <ToggleButtonGroup
              color="primary"
              value={formData.gender}
              exclusive
              onChange={handleGender}
              aria-label="מין"
            >
              <ToggleButton value="male" aria-label="גבר">
                גבר
                <ManIcon />
              </ToggleButton>
              <ToggleButton value="female" aria-label="אישה">
                אישה
                <WomanIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <FormLabel id="demo-row-radio-buttons-group-label">נוסח</FormLabel>
          <div className={mainForm.versionDiv}>
            <ToggleButtonGroup
              color="primary"
              value={formData.version}
              exclusive
              onChange={handleVersion}
              aria-label="Platform"
            >
              <ToggleButton value="ashkenazic">אשכנז</ToggleButton>
              <ToggleButton value="sephardic">ספרד</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {/*  אשכנז שם האם אם מנוחה ושם האב אם מנוח 
          ספרד תמיד שם האם */}
          <div className={mainForm.formGroup}>
            <TextField
              fullWidth
              id="outlined-basic"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={
                formData.gender === "male" && formData.version === "ashkenazic"
                  ? "שם האב"
                  : "שם האם"
              }
              label={
                formData.gender === "male" && formData.version === "ashkenazic"
                  ? "שם האב"
                  : "שם האם"
              }
              variant="outlined"
              value={formData.parentName}
              onChange={(e) => dispatch(setParentName(e.target.value))}
            />
          </div>
        </FormControl>
      </div>

      <div className="buttonsDiv">
        <Fab color="primary" aria-label="add" size="small" onClick={handleNext}>
          <ArrowLeftIcon />
        </Fab>
      </div>
    </div>
  );
};

export default MainForm;
