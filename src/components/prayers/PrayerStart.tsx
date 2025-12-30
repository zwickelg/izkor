// src/pages/DetailsPage.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

export const PRAYER_START = ` בָּרוּךְ אַתָּה יְיָ, אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר יָצַר אֶתְכֶם
בַּדִּין, וְזָן וְכִלְכֵּל אֶתְכֶם בַּדִּין, וְהֵמִית אֶתְכֶם בַּדִּין,
וְיוֹדֵעַ מִסְפַּר כֻּלְּכֶם בַּדִּין, וְעָתִיד לְהַחֲזִיר
וּלְהַחֲיוֹתְכֶם בַּדִּין: בָּרוּךְ אַתָּה יְיָ, מְחַיֵּה הַמֵּתִים:
אַתָּה גִּבּוֹר לְעוֹלָם, אֲדֹנָי מְחַיֵּה מֵתִים אַתָּה, רַב
לְהוֹשִׁיעַ. מְכַלְכֵּל חַיִּים בְּחֶסֶד, מְחַיֵּה מֵתִים בְּרַחֲמִים
רַבִּים, סוֹמֵךְ נוֹפְלִים, וְרוֹפֵא חוֹלִים, וּמַתִּיר אֲסוּרִים,
וּמְקַיֵּם אֱמוּנָתוֹ לִישֵׁנֵי עָפָר. מִי כָמוֹךָ בַּעַל גְּבוּרוֹת
וּמִי דּוֹמֶה לָּךְ, מֶלֶךְ מֵמִית וּמְחַיֶּה וּמַצְמִיחַ יְשׁוּעָה.
וְנֶאֱמָן אַתָּה לְהַחֲיוֹת מֵתִים.`;

const PrayerStart: React.FC = () => {
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography
        variant="body1"
        sx={{
          fontStyle: "italic",
          color: "text.secondary",
          mb: 3,
          textAlign: "center",
          fontSize: "0.95rem",
        }}
      >
        מי שלא היה בבית קברות במשך שלושים יום מברך ברכה זו בבואו תוך ד' אמות
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{
          fontFamily: "FrankRuehl, serif",
          fontWeight: "normal",
          lineHeight: 1.8,
          textAlign: "justify",
          whiteSpace: "pre-line",
        }}
      >
        {PRAYER_START}
      </Typography>
    </Box>
  );
};

export default PrayerStart;
