import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Box, Typography } from "@mui/material";

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
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontFamily: "FrankRuehl, serif",
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        {formData.firstName} {formData.lastName}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontFamily: "FrankRuehl, serif",
          fontWeight: "bold",
          mb: 4,
          letterSpacing: 2,
        }}
      >
        תנצב"ה
      </Typography>

      <Box sx={{ mt: 2 }}>
        <img
          src="images/Izkor.png"
          alt="יזכור"
          style={{
            maxWidth: "200px",
            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.3))",
          }}
        />
      </Box>
    </Box>
  );
};

export default PrayerEnd;
