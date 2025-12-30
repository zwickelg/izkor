import React from "react";
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { PRAYER_START } from "./prayers/PrayerStart";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import styles from "./prayers/Prayers.module.css";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import IconButton from "@mui/material/IconButton";

// Create styles
const stylesPdf = StyleSheet.create({
  printPage: {
    direction: "rtl",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    height: "100vh",
    justifyContent: "center",
    fontFamily: "Assistant",
  },

  pageNum: {
    position: "absolute",
    top: "10%",
    left: "50%",
    fontSize: 16,
  },
  imageBox: {
    width: 300,
    height: 300,
    border: 2,
    borderColor: "#cccccc",
    borderStyle: "solid",
  },
  image: {
    width: "100%",
  },

  text: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    display: "flex",
    textAlign: "right",
    margin: "auto",
    padding: 20,
  },

  textWrapper: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    textAlign: "right",
    margin: "auto",
    padding: 20,
  },
  text1: {
    fontSize: 20,
    fontFamily: "Assistant",
    textAlign: "right",
    alignItems: "flex-end",
    margin: 0,
    padding: 0,
    lineHeight: 1.8,
    fontVariantAlternates: styles,
    letterSpacing: 0,
  },
  text2: {
    fontFamily: "Assistant",
    textAlign: "right",
    letterSpacing: -0.1,
  },
  text3: {
    fontFamily: "Assistant",
    textAlign: "right",
    letterSpacing: 0.1,
  },
  text4: {
    fontFamily: "Assistant",
    textAlign: "right",
    letterSpacing: 0.1,
  },
  titleBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    textAlign: "center",
    margin: "auto",
    padding: 20,
  },
  title: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row-reverse",
    flexShrink: 0,
    textAlign: "center",
    fontSize: 30,
  },
});

interface IzkorDocumentProps {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  parentName: string;
  version: "sephardic" | "ashkenazic";
}
const IzkorDocument: React.FC<IzkorDocumentProps> = ({
  firstName,
  lastName,
  gender,
  parentName,
  version,
}) => {
  console.log("PdfDocument");
  console.log(firstName);
  console.log(lastName);
  console.log(gender);
  console.log(parentName);
  console.log(version);
  let pageText = PRAYER_START.replace(/\r?\n/g, " ");
  /* 
  for (let i = 0; i < pageText.length; i++) {
    let charCode = pageText[i].charCodeAt(0);
    console.log(
      `ot: ${pageText[i]}   ---------  charCode: ${charCode
        .toString(16)
        .toUpperCase()}`
    );
  } */
  /*   for (let charCode = 0x0590; charCode <= 0x05ff; charCode++) {
    const char = String.fromCharCode(charCode);
    console.log(
      `Character: ${char}     Unicode: ${charCode.toString(16).toUpperCase()}`
    );
  } */
  /* let start = false;
  let theChar;
  let theCharArr: string[] = [];
  let theString = "";
  for (let i = 0; i < pageText.length; i++) {
    let charCode = pageText[i].charCodeAt(0);
    let isHebrew = charCode >= 0x05d0 && charCode <= 0x05ff;
    let isPanctuation = !isHebrew && charCode >= 0x590 && charCode < 0x05d0;
    if (start) {
      if (isHebrew) {
        if (theCharArr && theCharArr.length)
          theString = theString + theCharArr.join("") + theChar;
        console.log(theString);
      } else theCharArr.push(pageText[i]);
    }
    if (isHebrew) {
      start = true;
      theChar = pageText[i];
      theCharArr = [];
    }
    console.log(
      `ot: ${pageText[i]}   ---------  charCode: ${charCode
        .toString(16)
        .toUpperCase()}   isPanctuation: ${!isHebrew}`
    );
  } */

  return (
    <Document>
      <Page size="A4" orientation="portrait">
        <Text style={stylesPdf.text1}>{PRAYER_START}</Text>
      </Page>
    </Document>
  );
};

const IzkorPdfDocument: React.FC = () => {
  console.log("PDFDocument");

  const formData = useSelector((state: RootState) => state.izkor);
  console.log(JSON.stringify(formData));
  try {
    Font.register({
      family: "Assistant",
      src: "fonts/Assistant-Regular.ttf",
    });
  } catch (err) {
    alert(err);
  }
  return (
    <PDFDownloadLink
      document={
        <IzkorDocument
          firstName={formData.firstName}
          lastName={formData.lastName}
          gender={formData.gender}
          parentName={formData.parentName}
          version={formData.version}
        />
      }
      fileName="myIzkor.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          <div>טוען</div>
        ) : (
          <IconButton>
            <LocalPrintshopOutlinedIcon />
          </IconButton>
        )
      }
    </PDFDownloadLink>
  );
};

export default IzkorPdfDocument;
