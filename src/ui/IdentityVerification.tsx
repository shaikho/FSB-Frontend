import React, { useEffect } from "react";
import MainLayout from "./MainLayout";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  ArrowBackIos,
  ArrowForwardIos,
  CreditScore,
  SensorOccupied,
  DocumentScanner
} from "@mui/icons-material";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleNext, handleBack } from "../utility/navigationUtils";
import { useNavigate } from "react-router-dom";
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import MonochromePhotosOutlinedIcon from '@mui/icons-material/MonochromePhotosOutlined';

const IdentityVerification: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentStep, steps, currentStep } = useNavigation();

  const VerificationSteps = [
    {
      id: 1,
      id2: "الأولى",
      icon: <RememberMeOutlinedIcon sx={{ fontSize: 40 }} />,
      title: t("scanStep"),
    },
    {
      id: 2,
      id2: "الثانية",
      icon: <MonochromePhotosOutlinedIcon sx={{ fontSize: 40 }} />,
      title: t("scanDocumentStep"),
    }, {
      id: 2,
      id2: "الثالثة",
      icon: <SensorOccupied sx={{ fontSize: 40 }} />,
      title: t("takeSelfieStep"),
    },
  ];
  useEffect(() => {
    setCurrentStep({
      step: 5,
      title: "/identity-verification",
      completed: false,
    });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      <Box
        component="div"
        sx={{
          position: "relative",
          height: "calc(100% - 26px)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography variant="h1" color="primary">
          {t("VerifyIdentityTitle")}
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3}>
          {t("VerifyIdentityDesc")}
        </Typography>
        <Grid container flexDirection="column" gap={1.5}>
          {VerificationSteps.map((step) => {
            const stepID = i18n.language === "en" ? step.id : step.id2;
            return (
              <Grid
                item
                key={step.id}
                container
                direction="row"
                alignItems="center"
                gap={2.5}
              >
                <Grid item>
                  <Typography variant="body1" color="primary">
                    {step.icon}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="initial" mb={0}>
                    {step.id === 6
                      ? t("Successful !")
                      : `${t("step")} ${stepID}`}
                  </Typography>
                  <Typography variant="h2" color="initial" m={0}>
                    {step.title}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Typography variant="h2" color="error" mt={2}>
          {t('documentInstructions')}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          sx={{
            marginTop: "auto",
            width: "100%",
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
              setCurrentStep({
                step: 5,
                title: "/identity-verification",
                completed: true,
              });
              handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
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

export default IdentityVerification;
