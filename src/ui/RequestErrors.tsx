import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
type FormErrorMessagesProps = {
  errors: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RequestErrors({
  errors,
  setError,
  open,
  close,
}: FormErrorMessagesProps) {
  const { i18n } = useTranslation();
  
  const handleClose = () => {
    close(false);
    setError("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 9999,
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "8px",
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          color: "red",
          fontFamily: "Exo Bold",
          textAlign: "center",
        }}
      >
        {i18n.language === "en" ? "Error!" : "خطأ!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontFamily: "Exo Light",
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          {errors.length > 0
            ? errors
            : i18n.language === "en"
            ? "No errors"
            : "لا يوجد اخطاء"}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          sx={{
            fontFamily: "Exo Bold",
            borderRadius: "8px",
            padding: "8px 24px",
          }}
        >
          {i18n.language === "en" ? "Close" : "اغلاق"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
