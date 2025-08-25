import React, { useEffect, useMemo, useState, useCallback } from "react";
import MainLayout from "../ui/MainLayout";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleNext } from "../utility/navigationUtils";
import { countryCodes } from "../data/data";
import Spinner from "../ui/Spinner";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { lazy } from "react";
import { sendOTP } from "../axios";

const RequestErrors = lazy(() => import("../ui/RequestErrors"));
const NavigationBtns = lazy(() => import("../ui/NavigationBtns"));
const EmailVerification: React.FC = () => {
  const { setCurrentStep, steps, currentStep } = useNavigation();
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const {
    setEmail,
    email = "",
    setPhoneNumber,
    setCountryCode,
    phoneNumber,
    setReqId,
    nationalIDNumber
  } = useAuth();

  const schema = z.object({
    email: z.string().email(t("emailError")).regex(/^\S+$/),
    countryCode: z.string().min(1).max(5),
    phoneNumber: z
      .string()
      .min(8, t("phoneMaxError"))
      .max(10, t("phoneMaxError"))
      .regex(/^\d+$/)
      .refine(
        (string) => {
          const number = parseFloat(string);
          return !isNaN(number) && isFinite(number);
        },
        { message: t("phoneMaxError") }
      )
      .refine((string) => string !== "0".repeat(string.length), {
        message: t("phoneMaxError"),
      }),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email, countryCode: "+249", phoneNumber: phoneNumber },
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const language = i18n.language;
  const onSubmit: SubmitHandler<FormFields> = useCallback(
    async (data) => {
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setCountryCode(data.countryCode);
      try {
        const responseCode = await sendOTP(
          data.email.trim(),
          data.countryCode.slice(1) + data.phoneNumber,
          nationalIDNumber
        );
        if (responseCode === 200) {
          setCurrentStep({ step: 3, title: "/email-verifcation", completed: true });
          handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
        } else {
          setError(
            i18n.language === "en"
              ? "An error occurred while sending OTP. Please try again."
              : "حدث خطأ اثناء ارسال OTP. الرجاء المحاولة مرة اخرى."
          );
          setOpen(true);
        }
      } catch (error) {
        if (error) {
          setError(
            i18n.language === "en"
              ? "An error occurred while sending OTP. Please try again."
              : "حدث خطأ اثناء ارسال OTP. الرجاء المحاولة مرة اخرى."
          );
          setOpen(true);
        }
      }
    },
    [
      setEmail,
      setPhoneNumber,
      setCountryCode,
      setReqId,
      setCurrentStep,
      currentStep.step,
      steps,
      navigate,
      i18n.language,
    ]
  );

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && (value.length <= 8 || value.length <= 10)) {
        if (value[0] === "0") {
          setValue("phoneNumber", value.slice(1, value.length), {
            shouldValidate: true,
          });
        } else setValue("phoneNumber", value, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const sortedCountries = useMemo(() => {
    return countryCodes.sort((a, b) => {
      const titleA = t(a.label);
      const titleB = t(b.label);
      return titleA.localeCompare(titleB, "ar");
    });
  }, [t]);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s/g, "");
      setValue("email", value, { shouldValidate: true });
    },
    [setValue]
  );

  // const handlenationalIDNumberChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     if (/^\d*$/.test(value) && (value.length <= 11)) {
  //       if (value[0] === "0") {
  //         setValue("nationalIDNumber", value.slice(1, value.length), {
  //           shouldValidate: true,
  //         });
  //       } else setValue("nationalIDNumber", value, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  useEffect(() => {
    setCurrentStep({ step: 3, title: "/email-verifcation", completed: false });
  }, [setCurrentStep]);

  return (
    <MainLayout>
      {error && (
        <RequestErrors
          errors={error}
          setError={setError}
          open={open}
          close={() => setOpen(false)}
        />
      )}
      {isSubmitting ? <Spinner /> : null}
      <Box
        sx={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" color="primary">
          {t("email")}
        </Typography>
        <MoveToInboxIcon color="primary" sx={{ fontSize: 100 }} />
        <Typography variant="h2">{t("email2")}</Typography>
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {/* <Controller
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
          /> */}
        {/* <Grid container alignItems="center" my={2}>
            <Grid item xs={5}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h2" sx={{ textAlign: "center", margin: 0 }}>
                {i18n.language === "en" ? "and" : "و"}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Divider />
            </Grid>
          </Grid> */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              {...field}
              variant="outlined"
              placeholder={t("emailPlaceholder")}
              error={!!errors.email}
              helperText={errors.email?.message}
              onBlur={async () => {
                field.onBlur();
                await trigger("email");
              }}
              onChange={handleEmailChange}
              InputProps={{
                endAdornment: !field.value && (
                  <Typography color="error" pt={2}>*</Typography>
                ),
              }}
            />
          )}
        />
        <Grid container alignItems="center" my={2}>
          <Grid item xs={5}>
            <Divider />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h2" sx={{ textAlign: "center", margin: 0 }}>
              {i18n.language === "en" ? "and" : "و"}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Divider />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          flexWrap="nowrap"
        >
          <Grid item xs={6} sx={{ flexGrow: 1, flexShrink: 0 }}>
            <FormControl fullWidth>
              <InputLabel id="country-code-label" sx={{ display: "none" }}>
                {t("Country Code")}
              </InputLabel>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="country-code-label"
                    id="Country Codes"
                    label={t("Country Code")}
                    error={Boolean(errors.countryCode)}
                    onBlur={async () => {
                      field.onBlur();
                      await trigger("countryCode");
                    }}
                  >
                    {i18n.language === "en"
                      ? countryCodes.map((option) => (
                        <MenuItem key={option.label} value={option.code}>
                          {t(`${option.label}`)} (
                          {i18n.language === "en"
                            ? option.code
                            : `${option.code.slice(
                              1,
                              option.code.length
                            )}+`}
                          )
                        </MenuItem>
                      ))
                      : sortedCountries.map((option) => (
                        <MenuItem key={option.label} value={option.code}>
                          {t(`${option.label}`)} (
                          {i18n.language === "en"
                            ? option.code
                            : `${option.code.slice(
                              1,
                              option.code.length
                            )}+`}
                          )
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} sx={{ flexGrow: 0, flexShrink: 1 }}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  dir={i18n.language === "en" ? "ltr" : "rtl"}
                  inputProps={{
                    style: {
                      direction: i18n.language === "en" ? "ltr" : "rtl",
                    },
                  }}
                  type="tel"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  placeholder={t("PhoneNumberPlaceholder")}
                  onBlur={async () => {
                    field.onBlur();
                    await trigger("phoneNumber");
                  }}
                  onChange={handlePhoneNumberChange}
                  InputProps={{
                    endAdornment: !field.value && (
                      <Typography color="error" pt={2}>*</Typography>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </MainLayout>
  );
};

export default EmailVerification;
