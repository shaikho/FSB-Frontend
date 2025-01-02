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
  return (
    <Dialog
      open={open}
      onClose={() => {
        close(false);
        setError("");
      }}
    >
      <DialogTitle sx={{ color: "red" }}>
        {i18n.language === "en" ? "Error!" : "خطأ!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {errors.length > 0
            ? errors
            : i18n.language === "en"
            ? "No errors"
            : "لا يوجد اخطاء"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close(false);
            setError("");
          }}
          color="primary"
        >
          {i18n.language === "en" ? "Close" : "اغلاق"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
