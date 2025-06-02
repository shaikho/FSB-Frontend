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
import { openCIF } from "../axios";

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
  const { setCurrentStep, currentStep, setDone } = useNavigation();
  const navigate = useNavigate();
  const contextValue = useAuth();

  // Handler for file input change
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
    console.log("File selected:", contextValue.signeture);
    console.log("Image URL:", img);
  };

  const handleSubmit = async () => {
    if (img !== "") {
      // after successful upload, submit data to backend
      // submit data to the server
      const data = {
        documentData: contextValue.documentData,
        email: contextValue.email,
        currency: contextValue.currency,
        residency: contextValue.residency,
        mobileNumber: contextValue.mobileNumber,
        fullNameEnglish: contextValue.documentData.fullName,
        fullNameArabic: contextValue.documentData.fullNameArabic,
        dateofBirth: contextValue.documentData.dateOfBirthFormatted,
        placeofBirth: contextValue.documentData.placeOfBirth,
        gender: contextValue.documentData.sex,
        IDNumber: contextValue.documentData.documentNumber,
        nationalIDNumber: contextValue.documentData.identityNumber,
        placeofIssue: contextValue.documentData.placeOfIssue,
        dateofIssue: contextValue.documentData.issueDateFormatted,
        dateofexpiry: contextValue.documentData.dateOfExpiryFormatted,
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
        WorkedInGoverment: contextValue.submittedData.WorkedInGoverment,
        UsCitizen: contextValue.submittedData.UsCitizen,
        UsResident: contextValue.submittedData.UsResident,
        UsTaxPayer: contextValue.submittedData.UsTaxPayer,
        UsAccount: contextValue.submittedData.UsAccount,
      };
      console.log(data);
      const { done, message } = await openCIF(data);
      setDone(done);
      setError(message);
      setCurrentStep({ step: 9, title: "/signeture", completed: true });
      handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
    } else setError(t("signatureError"));
  }

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
            onClick={handleSubmit}
            disabled={img === "" || !contextValue.signeture}
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
