import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../contexts/AuthProvider";
import MainLayout from "../ui/MainLayout";
import { useTranslation } from "react-i18next";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { handleBack, handleNext } from "../utility/navigationUtils";
import { useNavigation } from "../contexts/NavigationProvider";
import { steps } from "../data/data";
import { useNavigate } from "react-router-dom";
import signatureImg from "../assets/images/signatureImg.png";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

// Styling for the image preview
const ImgPreview = styled("img")({
  width: "100%",
  maxWidth: "300px",
  marginTop: "10px",
});

// Define the component
const Signeture: React.FC = () => {
  const [error, setError] = useState("");
  const { setSigneture } = useAuth();
  const { t, i18n } = useTranslation();
  const [img, setImg] = useState("");
  const { setCurrentStep, currentStep } = useNavigation();
  const navigate = useNavigate();

  // Handler for file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = (e) => {
        setSigneture(e.target?.result === undefined ? null : e.target.result);
      };

      reader.onerror = (e) => {
        console.error("FileReader error", e);
        setSigneture(null);
      };

      reader.readAsDataURL(file);
    }
  };
  usePreventBackNavigation();
  useEffect(() => {
    setCurrentStep({ step: 9, title: "/signeture", completed: false });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      <Box
        component="div"
        sx={{
          position: "relative",
          minHeight: "calc(100% - 26px)",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          flexGrow: 1,
          gap: "3rem",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={2}
          sx={{
            width: "100%",
            px: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h2" textAlign="center">
            {t("signetureTitle")}
          </Typography>
          <img src={signatureImg} alt="signature" width={100} height={100} />
          <input
            type="file"
            accept="image/*"
            hidden
            id="file-input"
            onChange={handleFileChange}
          />

          <label htmlFor="file-input" style={{ width: "100%" }}>
            <Paper
              component="div"
              elevation={0}
              sx={{
                backgroundColor: "grey",
                width: "100%",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {img === "" ? (
                <Typography variant="body1" color="primary">
                  {i18n.language === "en" ? "Click here" : "انقر هنا"}
                </Typography>
              ) : (
                <ImgPreview src={img} alt="Selected" />
              )}
            </Paper>
          </label>
        </Box>
        {error !== "" && (
          <Typography
            variant="body1"
            sx={{ color: "red", textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <Grid
          container
          justifyContent="space-between"
          alignSelf="flex-end"
          sx={{
            mt: "auto",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleBack(setCurrentStep, currentStep.step, steps, navigate)
            }
          >
            <ArrowBackIos />
            {t("back")}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (img !== "") {
                setCurrentStep({
                  step: 9,
                  title: "/signeture",
                  completed: true,
                });
                handleNext(setCurrentStep, currentStep.step, steps, navigate);
              } else setError(t("signatureError"));
            }}
          >
            {t("next")}
            <ArrowForwardIos />
          </Button>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default Signeture;
