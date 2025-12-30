// src/pages/DetailsPage.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import PrayerStart from "./PrayerStart";
import PrayerThilimLG from "./PrayerThilimLG";
import PrayerThilimTZ from "./PrayerThilimTZ";
import PrayerThilimYZ from "./PrayerThilimYZ";
import PrayerThilimAB from "./PrayerThilimAB";
import PrayerThilimZA from "./PrayerThilimZA";
import PrayerThilimKD from "./PrayerThilimKD";
import PrayerThilimKL from "./PrayerThilimKL";
import PrayerName, { PrayerThilimPageProps } from "./PrayerName";
import PrayerKadhshYatom from "./PrayerKadhshYatom";
import PrayerElMaleRahamim from "./PrayerElMaleRahamim";
import PrayerEnd from "./PrayerEnd";

type SectionRefObject = {
  ref: React.RefObject<HTMLDivElement>;
  name: string;
  comp: React.ComponentType<PrayerThilimPageProps>;
  compAttributes?: PrayerThilimPageProps;
};

type SectionRefsArray = SectionRefObject[];

const PrayerAll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sectionRefs: SectionRefsArray = [
    { ref: useRef<HTMLDivElement>(null), name: "Section 0", comp: PrayerStart },
    { ref: useRef<HTMLDivElement>(null), name: "", comp: PrayerStart },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים ל"ג`, comp: PrayerThilimLG },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים ט"ז`, comp: PrayerThilimTZ },
    { ref: useRef<HTMLDivElement>(null), name: 'תהילים י"ז', comp: PrayerThilimYZ },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים ע"ב`, comp: PrayerThilimAB },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים צ"א`, comp: PrayerThilimZA },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים ק"ד`, comp: PrayerThilimKD },
    { ref: useRef<HTMLDivElement>(null), name: `תהילים ק"ל`, comp: PrayerThilimKL },
    { ref: useRef<HTMLDivElement>(null), name: `אותיות לפי שם`, comp: PrayerName, compAttributes: { name: "" } },
    { ref: useRef<HTMLDivElement>(null), name: `אותיות נשמה`, comp: PrayerName, compAttributes: { name: "נשמה" } },
    { ref: useRef<HTMLDivElement>(null), name: `קדיש יתום`, comp: PrayerKadhshYatom },
    { ref: useRef<HTMLDivElement>(null), name: `אל מלא רחמים`, comp: PrayerElMaleRahamim },
    { ref: useRef<HTMLDivElement>(null), name: "", comp: PrayerEnd },
  ];

  const handleScrollx = () => {
    console.log(currentSection);
    for (var i = 1; i < sectionRefs.length; i++) {
      let curSectionRef = sectionRefs[i].ref ? sectionRefs[i].ref!.current : null;
      if (curSectionRef) {
        const rect = curSectionRef.getBoundingClientRect();
        if (rect.top >= 0) {
          setCurrentSection(i);
          break;
        }
      }
    }
  };

  const [currentSection, setCurrentSection] = useState<number>(1);

  const goToSection = (sectionId: number) => {
    if (sectionId > 0 && sectionId < sectionRefs.length) {
      const sectionRef = sectionRefs[sectionId].ref;
      if (sectionRef && sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      if (sectionId <= 0) navigate("/page1");
      else navigate("/page0");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScrollx);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScrollx);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Scrollable Content */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: 3,
          pb: 15, // Padding for bottom navigation
        }}
      >
        {sectionRefs.map(({ ref, name, comp: Comp, compAttributes }, index) =>
          index > 0 ? (
            <Box key={index} ref={ref}>
              <section id={String(index)}>
                <Comp {...compAttributes} />
              </section>
            </Box>
          ) : (
            <Box key={index} />
          )
        )}
      </Box>

      {/* Glassmorphism Bottom Navigation */}
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "auto",
          minWidth: "300px",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          backdropFilter: "blur(20px)",
          background: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "50px",
          zIndex: 10000,
        }}
      >
        <IconButton
          onClick={() => goToSection(currentSection - 1)}
          sx={{
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "primary.main", color: "common.white" },
            transition: "all 0.2s",
          }}
        >
          <ArrowRightIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontFamily: "FrankRuehl, serif",
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            flex: 1,
            mx: 2,
          }}
        >
          {sectionRefs[currentSection].name}
        </Typography>

        <IconButton
          onClick={() => goToSection(currentSection + 1)}
          sx={{
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "primary.main", color: "common.white" },
            transition: "all 0.2s",
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default PrayerAll;
