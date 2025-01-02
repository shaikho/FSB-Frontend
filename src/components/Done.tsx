import { CheckSharp, CloseSharp } from "@mui/icons-material";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../contexts/NavigationProvider";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
export default function Done() {
  const { t } = useTranslation();
  const { done, error, setCurrentStep, setIsChecked } = useNavigation();
  const {
    setAgree,
    setEmail,
    setDocument,
    setResidency,
    setCurrency,
    setIdentityType,
    setDocumentData,
    setPhoneNumber,
    setCountryCode,
    setSubmittedData,
    setSigneture,
    setReqId,
  } = useAuth();
  const handleReset = () => {
    setIsChecked(false);
    setCurrentStep({ step: 1, title: "/", completed: false });
    setAgree(false);
    setCountryCode(undefined);
    setEmail("");
    setCurrency([938]);
    setResidency(729);
    setReqId("");
    setDocument(3);
    setIdentityType("passport");
    setPhoneNumber("");
    setSigneture(null);
    setDocumentData({
      fullName: "",
      fullNameArabic: "",
      placeOfBirth: "",
      issueDateFormatted: new Date(),
      dateOfBirthFormatted: new Date(),
      dateOfExpiryFormatted: new Date(),
      documentNumber: "",
      identityNumber: "",
      sex: "",
      nationality: "",
      placeOfIssue: "",
      address: "",
      nationalIDNumber: "",
    });
    setSubmittedData({
      fullNameEnglish: "",
      fullNameArabic: "",
      dateofBirth: "",
      placeofBirth: "",
      gender: "",
      IDNumber: "",
      nationalIDNumber: "",
      placeofIssue: "",
      dateofIssue: "",
      dateofexpiry: "",
      AcountryCode: "+249",
      AphoneNumber: "",
      address: "",
      occupation: "",
      employer: "",
      averageIncome: "",
      PresidentFamilyMember: undefined,
      MinisterPolitician: undefined,
      MemberofParliament: undefined,
      MilitaryHighRank: undefined,
      SeniorOfficial: undefined,
      ForeignDiplomatic: undefined,
      SubjecttoUSAtaxpayer: undefined,
      MotherName: "",
      identityNumber: "",
    });
  };
  useEffect(() => {
    setCurrentStep({ step: 11, title: "/done", completed: false });
  }, [setCurrentStep]);
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Grid item>
        <Box
          component="div"
          sx={{
            width: "200px",
            height: "200px",
            backgroundColor: "#fff",
            borderRadius: "500%",
          }}
        >
          {done ? (
            <CheckSharp
              sx={{
                fontSize: "200px",
                color: "#30b476",
              }}
            />
          ) : (
            <CloseSharp
              sx={{
                fontSize: "200px",
                color: "red",
              }}
            />
          )}
        </Box>
      </Grid>
      <Grid item>
        <Typography variant="h4" color="#fff" textAlign="center">
          {done ? t("completed") : t("notComplete")}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h2" color="#fff" textAlign="center">
          {done ? t("completedDesc") : error}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{
            backgroundColor: "#fff",
            border: "#fff 1px solid",
            borderRadius: 30,
            padding: "1rem 1.5rem",
          }}
          onClick={handleReset}
        >
          {done ? t("done") : t("retry")}
        </Button>
      </Grid>
    </Grid>
  );
}
