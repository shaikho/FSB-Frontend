import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../ui/MainLayout";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../contexts/NavigationProvider";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleNext, handleBack } from "../utility/navigationUtils";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthProvider";
import { getCustomerCivilRecord, IsVerified } from "../axios";
import RequestErrors from "../ui/RequestErrors";

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
    setPersonalInfoStep,
    error: livenessCheckError
  } = useNavigation();
  const { nationalIDNumber, setNationalIDNumber, submittedData, setSubmittedData } = useAuth();
  const schema = z.object({
    nationalIDNumber: z.string()
      .min(11, { message: t('nationalIDNumberMaxError') })
      .max(11, { message: t('nationalIDNumberMaxError') })
      .regex(/^\d+$/, { message: t('nationalIDNumberMaxError') })
      .refine(value => !isNaN(Number(value)), { message: t('nationalIDNumberMaxError') })
  });
  const [open, setOpen] = useState(livenessCheckError ? true : false);
  const [error, setError] = useState<string>("");
  type FormFields = z.infer<typeof schema>;

  const {
    control,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { nationalIDNumber: "" },
    mode: "onBlur",
  });
  const handlenationalIDNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && (value.length <= 11)) {
        if (value[0] === "0") {
          setValue("nationalIDNumber", value.slice(1, value.length), {
            shouldValidate: true,
          });
        } else {
          setNationalIDNumber(value);
          setValue("nationalIDNumber", value, { shouldValidate: true })
        };
      }
    },
    [setValue]
  );

  const handleSubmit = async () => {
    setIsLoading(true);

    // Validate the nationalIDNumber before proceeding
    const isNationalIDValid = await trigger("nationalIDNumber");
    const currentNationalID = nationalIDNumber || "";

    // Check if nationalIDNumber is valid and not empty
    if (!isNationalIDValid || currentNationalID.length !== 11 || !/^\d+$/.test(currentNationalID)) {
      setIsLoading(false);
      return;
    }

    if (isChecked) {
      try {
        const response = await getCustomerCivilRecord(nationalIDNumber);
        const isVerified = await IsVerified(nationalIDNumber);
        console.log("IsVerified response:", isVerified);
        if (!isVerified && response.responseCode !== -1) {
          setSubmittedData({
            ...submittedData,
            fullNameArabic: response.fullNameArabic,
          });
          setCurrentStep({ step: 1, title: "/terms", completed: true });
          handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
          setPersonalInfoStep(1);
        } else if (response.responseCode === -1) {
          setError(
            i18n.language === "en"
              ? "Invalid national number id please use a valid number to continue."
              : "الرقم الوطني غير صحيح، يرجى إدخال رقم صحيح للمتابعة."
          );
          setOpen(true);
        }
        else if (isVerified) {
          setError(
            i18n.language === "en"
              ? "You already have an account."
              : "لديك حساب بالفعل."
          );
          setOpen(true);
        }
      } catch (err) {
        setError(
          i18n.language === "en"
            ? "Invalid national number id please use a valid number to continue."
            : "الرقم الوطني غير صحيح، يرجى إدخال رقم صحيح للمتابعة."
        );
        setOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorChoose(t("ErrorAgreeTerm"));
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCurrentStep({ step: 1, title: "/terms", completed: false });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      {error || livenessCheckError && (
        <RequestErrors
          errors={error || livenessCheckError}
          setError={setError}
          open={open}
          close={() => setOpen(false)}
        />
      )}
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
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={13}>
          {t("nationalIDNumber")}
        </Typography>
        <Controller
          name="nationalIDNumber"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              {...field}
              variant="outlined"
              placeholder={t("nationalIDNumberPlaceholder")}
              error={!!errors.nationalIDNumber}
              helperText={errors.nationalIDNumber?.message}
              onBlur={async () => {
                field.onBlur();
                await trigger("nationalIDNumber");
              }}
              onChange={handlenationalIDNumberChange}
              InputProps={{
                endAdornment: !field.value && (
                  <Typography color="error" pt={2}>*</Typography>
                ),
              }}
            />
          )}
        />
        <br />
        {/* link to pdf terms */}
        <a
          href={i18n.language === "en" ? "/TC-en.pdf" : "/TC-ar.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            fontFamily:
              i18n.language === "en" ? "Exo SemiBold" : "TheSansArabic-Light",
            fontSize: "1.2rem",
          }}
        >
          {t("Terms and Conditions")}
        </a>
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
