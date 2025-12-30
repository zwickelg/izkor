import React, { useState, useRef, useEffect } from "react";

import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "../prayers/Prayers.module.css";
import ContactlessOutlinedIcon from "@mui/icons-material/ContactlessOutlined";
import IconButton from "@mui/material/IconButton";

interface NfcAlertDialogProps {
  callback: () => void;
}
const NfcAlertDialog: React.FC<NfcAlertDialogProps> = ({ callback }) => {
  const [open, setOpen] = React.useState(false);
  const [err, setErr] = React.useState("");
  useEffect(() => {
    (async () => {
      await _sleep(3000);
      setErr("");
    })();
  }, [err]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const _sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveAndClose = async () => {
    try {
      await callback();
      setOpen(false);
    } catch (err: any) {
      setErr(err.message);
    }
  };
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <ContactlessOutlinedIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">צריבת הכרטיס</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            יש לצרוב את הכרטיס עם השמות והפרטים של הנפטר כך שנוכל לסרוק אותו
            לאחר מכן ולקבל את התפילה המתאימה. לצריבה קרב את הכרטיס לגב הטלפון
            ולחץ על 'צרוב'
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <span className="errorText">{err}</span>

          <div className="dialogButton">
            <Button onClick={handleClose} variant="outlined">
              בטל
            </Button>
          </div>
          <div className="dialogButton">
            <Button onClick={handleSaveAndClose} variant="outlined" autoFocus>
              צרוב
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default NfcAlertDialog;
