import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Box, Typography } from "@mui/material";
import styles from "./Prayers.module.css";

const PrayerEnd: React.FC = () => {
  const formData = useSelector((state: RootState) => state.izkor);

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <p className={styles.instructions}>
        {formData.firstName} {formData.lastName}
      </p>

      <Typography
        variant="h4"
        sx={{
          fontFamily: "FrankRuehl, sans-serif",
          fontWeight: "normal",
          mb: 4,
          letterSpacing: 2,
          fontSize: "3rem",
        }}
      >
        תנצב"ה
      </Typography>

      <Box sx={{ mt: 2 }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/Izkor.png`}
          alt="יזכור"
          style={{
            maxWidth: "200px",
            borderRadius: "50%",
            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.3))",
          }}
        />
      </Box>
    </Box>
  );
};

export default PrayerEnd;
