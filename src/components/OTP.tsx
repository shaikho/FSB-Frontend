import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { MarkEmailRead } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "../ui/MainLayout";
import CountdownTimer from "../utility/CountdownTimer";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleNext } from "../utility/navigationUtils";
import NavigationBtns from "../ui/NavigationBtns";
import { sendOTP, verifyOTP } from "../axios";
import RequestErrors from "../ui/RequestErrors";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^[0-9]$/)
    )
    .length(6),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTP: React.FC = () => {
  usePreventBackNavigation();
  const { setCurrentStep, steps, currentStep } = useNavigation();
  const [tries, setTries] = useState<number>(0);
  const { t, i18n } = useTranslation();
  const { nationalIDNumber, email, mobileNumber, reqId, setReqId } = useAuth();
  const [resend, setResend] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });
  const language = i18n.language;

  const navigate = useNavigate();
  const onSubmit = async (data: OTPFormValues) => {
    if (tries === 2) {
      setError(
        i18n.language === "en"
          ? "OTP has expired after 3 failed attempts."
          : "الرمز انتهت صلاحيته بعد 3 محاولات فاشلة."
      );
      setOpen(true);
      setResend(true);
      return;
    }
    setResend(false);
    const otpValue = data.otp.join("");
    try {
      const response = await verifyOTP(
        email,
        mobileNumber,
        new Date(),
        reqId,
        otpValue
      );
      if (response.responseCode === 0) {
        setCurrentStep({ step: 2, title: "/otp", completed: true });
        setError("");
        handleNext(setCurrentStep, currentStep.step, steps, navigate);
        setReqId(undefined);
        setTries(0);
        setResend(false);
      } else {
        setTries((prev) => prev + 1);
        setError(
          i18n.language === "en"
            ? "The code is not correct or has timed out"
            : "الرمز غير صحيح او انتهت المدة"
        );
        setOpen(true);
        setValue("otp", ["", "", "", "", "", ""], { shouldValidate: true });
      }
    } catch (error) {
      if (error) {
        setTries((prev) => prev + 1);
        setError(
          i18n.language === "en"
            ? "The code is not correct or has timed out"
            : "الرمز غير صحيح او انتهت المدة"
        );
        setOpen(true);
      }
    }
  };

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      setValue(`otp.${index}`, value);
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      setValue(`otp.${index}`, "");
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };
  const [loading, setLoading] = useState(false);
  const resendHandler = async () => {
    setValue("otp", ["", "", "", "", "", ""], { shouldValidate: true });
    setTries(0);
    setLoading(true);
    try {
      const response = await sendOTP(email, mobileNumber, nationalIDNumber, new Date(), language);
      if (response.responseCode === 0) {
        setReqId(response.reqId);
        setError("");
        setTries(0);
        setResend(false);
        setLoading(false);
      } else {
        setError(
          i18n.language === "en"
            ? "An error occurred while sending OTP. Please try again."
            : "حدث خطأ غير متوقع الرجاء المحاولة مرة اخرى"
        );
        setResend(true);
        setOpen(true);
        setLoading(false);
      }
    } catch (error) {
      if (error) {
        setError("An error occurred while sending OTP. Please try again.");
        setOpen(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setCurrentStep({ step: 2, title: "/otp", completed: false });
  }, [setCurrentStep]);

  return (
    <MainLayout>
      {error !== "" && (
        <RequestErrors
          errors={error}
          open={open}
          setError={setError}
          close={() => setOpen(false)}
        />
      )}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          minHeight: "calc(100% - 26px)",
          flexDirection: "column",
          flexGrow: 1,
          gap: "1rem",
        }}
      >
        {isSubmitting ? <Spinner /> : null}

        <Grid
          container
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1" fontWeight="600" color="primary">
            {t("email3")}
          </Typography>
          <MarkEmailRead color="primary" sx={{ fontSize: 100 }} />
          <Typography variant="h2" color="primary" mb={0}>
            {t("email4")}
          </Typography>
          <Typography variant="body1" textAlign="center" mb={0}>
            {email}
          </Typography>
          <Typography variant="h2" color="primary" m={0}>
            {i18n.language === "en" ? "or" : "أو"}
          </Typography>
          <Typography variant="body1" textAlign="center" mb={2}>
            {mobileNumber}
          </Typography>
        </Grid>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            direction: "ltr",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item key={index} xs={2}>
                <Controller
                  name={`otp.${index}` as const}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      type="tel"
                      autoFocus={index === 0}
                      {...field}
                      id={`otp-${index}`}
                      variant="outlined"
                      inputProps={{
                        style: { textAlign: "center", padding: 0 },
                        maxLength: 1,
                      }}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, event.target.value)
                      }
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLInputElement>
                      ) => handleKeyDown(index, event)}
                      onPaste={(
                        event: React.ClipboardEvent<HTMLInputElement>
                      ) => {
                        const pastedText = event.clipboardData.getData("text");
                        const otpValues = pastedText.split("").slice(0, 6); // Assuming OTP length is 6
                        otpValues.forEach((value, idx) => {
                          if (/^[0-9]$/.test(value)) {
                            setValue(`otp.${idx}`, value);
                          }
                        });
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" mt={2}>
            {resend ? (
              <Button variant="text" onClick={resendHandler} disabled={loading}>
                {t("sendOTP")}
              </Button>
            ) : (
              <>
                <span>{t("resend")}</span>{" "}
                <CountdownTimer
                  setResend={setResend}
                  setReqId={setReqId}
                  resend={resend}
                  tries={tries}
                />
              </>
            )}
          </Box>
          <NavigationBtns isSubmitting={isSubmitting} />
        </form>
      </Box>
    </MainLayout>
  );
};

export default OTP;
