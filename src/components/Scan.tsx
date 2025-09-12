import { useEffect, useState } from "react";
import MainLayout from "../ui/MainLayout";
import { useAuth } from "../contexts/AuthProvider";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import passportImg from "../assets/images/passport.svg";
import idImage from "../assets/images/identification.svg";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleBack } from "../utility/navigationUtils";
import { useNavigate } from "react-router-dom";
import { notes } from "../data/data";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import RequestErrors from "../ui/RequestErrors";
import LazyImage from "../ui/LazyImage";
import ini from "ini";
import Spinner from "../ui/Spinner";
export default function Scan() {
  const [values, setValues] = useState({
    idPhotoTamperingDetection: 0,
    idPrintDetection: 0,
    idScreenDetection: 0,
    minimumAge: 0,
    disableExpiryValidation: false,
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config.ini");
        const text = await response.text();
        const parsedConfig = ini.parse(text);
        setValues({
          idPhotoTamperingDetection: ~~parsedConfig.idPhotoTamperingDetection,
          idPrintDetection: ~~parsedConfig.idPrintDetection,
          idScreenDetection: ~~parsedConfig.idScreenDetection,
          minimumAge: ~~parsedConfig.minimumAge,
          disableExpiryValidation: parsedConfig.disableExpiryValidation,
        });
      } catch (error) {
        if (error) {
          setOpen(true);
          setError(
            i18n.language === "en"
              ? "Error on your Scan please try again later"
              : "حدث خطأ غير متوقع الرجاء المحاولة مرة اخرى"
          );
        }
      }
    };

    fetchConfig();
  }, [i18n.language, setError]);
  const { setDocumentData, document: documentAuth, setPhoto, setPersonalPhotoId, setDocumentPhotoId, setLivenessCheckSessionId, setUqudoToken } = useAuth();
  const { setCurrentStep, steps, currentStep, setPersonalInfoStep } =
    useNavigation();

  const navigate = useNavigate();

  const handleEnrollment = async () => {
    if (loading) return; // Prevent multiple clicks

    try {
      setLoading(true);
      const { onboardingJourney } = await import("./OnboardingJourny");
      const step = currentStep.step;
      await onboardingJourney({
        setError,
        navigate,
        setCurrentStep,
        step,
        document: documentAuth,
        setPhoto,
        setDocumentData,
        i18n,
        setOpen,
        setPersonalInfoStep,
        setLoading,
        setLivenessCheckSessionId,
        values,
        setPersonalPhotoId,
        setDocumentPhotoId,
        setUqudoToken
      });
    } catch (err) {
      if (err) {
        setOpen(false);
        setError("");
      }
    } finally {
      setLoading(false);
    }
  };
  usePreventBackNavigation();
  useEffect(() => {
    setCurrentStep({ step: 7, title: "/scan", completed: false });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      {error === "" ? null : (
        <RequestErrors
          errors={error}
          setError={setError}
          open={open}
          close={setOpen}
        />
      )}
      {loading ? <Spinner /> : null}
      <Typography variant="h1" color="primary" mb={0}>
        {documentAuth === 3 ? t("scanPassport") : t("scanID")}
      </Typography>
      <Box
        component="div"
        sx={{
          paddingTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LazyImage
          src={documentAuth === 3 ? passportImg : idImage}
          alt={documentAuth === 3 ? t("passport") : t("ID")}
        />
      </Box>
      <Typography variant="h2" color="primary" textAlign="start">
        {t("noteTitle")}
      </Typography>
      <ul style={{ marginBottom: "2rem" }}>
        {notes.map((note) => (
          <li key={note.id}>{t(`${note.title}`)}</li>
        ))}
      </ul>
      
      <Box
        sx={{
          mt: 4,
          mb: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          padding: "15px 25px",
          boxShadow: "0 8px 32px rgba(0, 0, 81, 0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          sx={{
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleBack(setCurrentStep, currentStep.step, steps, navigate)
            }
            disabled={loading}
            sx={{
              fontFamily: "Exo Bold",
            }}
          >
            <ArrowBackIos />
            {t("back")}
          </Button>
          <Button
            variant="contained"
            onClick={handleEnrollment}
            disabled={loading}
            sx={{
              fontFamily: "Exo Bold",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? t("loading") || "Loading..." : t("next")}
            {!loading && <ArrowForwardIos />}
          </Button>
        </Grid>
      </Box>
    </MainLayout>
  );
}
