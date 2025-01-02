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
import { useAuth } from "../contexts/AuthProvider";
import { openCIF } from "../axios";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const OnboardingScreen: React.FC = () => {
  const [errorChoose, setErrorChoose] = useState("");
  usePreventBackNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    setDone,
    isChecked,
    setIsChecked,
    setCurrentStep,
    steps,
    currentStep,
    setError,
  } = useNavigation();
  const contextValue = useAuth();
  const handleSubmit = async () => {
    setIsLoading(true);
    if (isChecked) {
      const data = {
        documentData: contextValue.documentData,
        email: contextValue.email,
        currency: contextValue.currency,
        residency: contextValue.residency,
        mobileNumber: contextValue.mobileNumber,
        fullNameEnglish: contextValue.submittedData.fullNameEnglish,
        fullNameArabic: contextValue.submittedData.fullNameArabic,
        dateofBirth: contextValue.submittedData.dateofBirth,
        placeofBirth: contextValue.submittedData.placeofBirth,
        gender: contextValue.submittedData.gender,
        IDNumber: contextValue.submittedData.IDNumber,
        nationalIDNumber: contextValue.submittedData.nationalIDNumber,
        placeofIssue: contextValue.submittedData.placeofIssue,
        dateofIssue: contextValue.submittedData.dateofIssue,
        dateofexpiry: contextValue.submittedData.dateofexpiry,
        AcountryCode: contextValue.submittedData.AcountryCode,
        AphoneNumber: contextValue.submittedData.AphoneNumber,
        address: contextValue.submittedData.address,
        occupation: contextValue.submittedData.occupation,
        employer: contextValue.submittedData.employer,
        averageIncome: contextValue.submittedData.averageIncome,
        PresidentFamilyMember: contextValue.submittedData.PresidentFamilyMember,
        MinisterPolitician: contextValue.submittedData.MinisterPolitician,
        MemberofParliament: contextValue.submittedData.MemberofParliament,
        MilitaryHighRank: contextValue.submittedData.MilitaryHighRank,
        SeniorOfficial: contextValue.submittedData.SeniorOfficial,
        ForeignDiplomatic: contextValue.submittedData.ForeignDiplomatic,
        SubjecttoUSAtaxpayer: contextValue.submittedData.SubjecttoUSAtaxpayer,
        MotherName: contextValue.submittedData.MotherName,
        identityNumber: contextValue.submittedData.identityNumber,
        signature: contextValue.signeture,
        document: contextValue.document,
        photo: contextValue.photo,
        language: i18n.language.toUpperCase(),
      };
      const { done, message } = await openCIF(data);
      setDone(done);
      setError(message);
      setCurrentStep({ step: 10, title: "/terms", completed: true });
      handleNext(setCurrentStep, currentStep.step, steps, navigate);
      setIsLoading(false);
    } else {
      const error = t("ErrorAgreeTerm");
      setErrorChoose(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCurrentStep({ step: 10, title: "/terms", completed: false });
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
        <a
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
        </a>
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
          <Button
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
