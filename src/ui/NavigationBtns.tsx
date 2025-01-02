import React from "react";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleBack } from "../utility/navigationUtils";
import { steps } from "../data/data";

type NavigationBtnsProps = {
  isSubmitting: boolean;
  onNext?: () => void;
};

const NavigationBtns: React.FC<NavigationBtnsProps> = ({
  onNext,
  isSubmitting,
}) => {
  const { setCurrentStep, currentStep, personalInfoStep, setPersonalInfoStep } =
    useNavigation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleBackClick = () => {
    if (currentStep.step === 8) {
      if (personalInfoStep === 0) {
        handleBack(setCurrentStep, currentStep.step, steps, navigate);
      } else setPersonalInfoStep((prev) => prev - 1);
    } else if (currentStep.step === 9) {
      handleBack(setCurrentStep, currentStep.step, steps, navigate);
      setPersonalInfoStep(2);
    } else {
      handleBack(setCurrentStep, currentStep.step, steps, navigate);
      setPersonalInfoStep(0);
    }
  };

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else {
      console.log("");
    }
  };

  return (
    <Grid
      alignSelf="flex-end"
      container
      justifyContent="space-between"
      sx={{
        marginTop: "auto",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
    >
      <Grid item>
        <Button
          disabled={isSubmitting}
          variant="outlined"
          onClick={handleBackClick}
          sx={{
            display: "flex",
          }}
        >
          <ArrowBackIos />
          {t("back")}
        </Button>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          onClick={handleNextClick}
          sx={{
            display: "flex",
          }}
        >
          {t("next")}
          <ArrowForwardIos />
        </Button>
      </Grid>
    </Grid>
  );
};

export default NavigationBtns;
