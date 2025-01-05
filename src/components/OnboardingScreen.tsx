import React, { useEffect, useState } from "react";
import MainLayout from "../ui/MainLayout";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../contexts/NavigationProvider";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleNext, handleBack } from "../utility/navigationUtils";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const OnboardingScreen: React.FC = () => {
  const [errorChoose, setErrorChoose] = useState("");
  usePreventBackNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    isChecked,
    setIsChecked,
    setCurrentStep,
    steps,
    currentStep,
    setPersonalInfoStep
  } = useNavigation();
  const handleSubmit = async () => {
    setIsLoading(true);
    if (isChecked) {
      setCurrentStep({ step: 1, title: "/terms", completed: true });
      handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
      setPersonalInfoStep(1);
      setIsLoading(false);
    } else {
      const error = t("ErrorAgreeTerm");
      setErrorChoose(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCurrentStep({ step: 1, title: "/terms", completed: false });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      <Box
        component="div"
        sx={{
          position: "relative",
          minHeight: "calc(100% - 26px)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {isLoading ? <Spinner /> : null}
        <Typography variant="h1" color="primary">
          {t("Terms and Conditions")}
        </Typography>
        {/* link to pdf terms */}
        {/* <a
          href={i18n.language === "en" ? "/TC-en.pdf" : "/TC-ar.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            fontFamily:
              i18n.language === "en" ? "Exo SemiBold" : "TheSansArabic-Light",
          }}
        >
          {t("Terms and Conditions")}
        </a> */}

        <Typography variant="body1" gutterBottom>
          {t('termsText1')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('termsText2')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('termsText3')}
        </Typography>

        <br />

        <FormControlLabel
          label={t("termsAgree")}
          control={
            <Checkbox
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              sx={{
                fontFamily:
                  i18n.language === "en"
                    ? "Exo SemiBold"
                    : "TheSansArabic-Light",
              }}
            />
          }
        />
        {errorChoose !== "" ? (
          <Typography variant="body1" color="initial" sx={{ color: "red" }}>
            {errorChoose}
          </Typography>
        ) : null}
        <Grid
          container
          alignSelf="flex-end"
          justifyContent="space-between"
          sx={{
            marginTop: "auto",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          {/* hidden back button here since this view is moved to be landing view */}
          <Button
            sx={{ visibility: "hidden" }}
            disabled={isLoading}
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
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {t("next")}
            <ArrowForwardIos />
          </Button>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default OnboardingScreen;
