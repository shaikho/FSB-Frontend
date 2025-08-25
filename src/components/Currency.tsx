import React, { useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import MainLayout from "../ui/MainLayout";
import { z } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencies } from "../data/data";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationProvider";
import { handleNext } from "../utility/navigationUtils";
import NavigationBtns from "../ui/NavigationBtns";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const Currency: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setCurrency, currency } = useAuth();
  const { currentStep, steps, setCurrentStep } = useNavigation();

  const schema = z.object({
    currencyValues: z
      .array(z.number())
      .min(1, { message: t("currencyRequired") }),
  });

  type FormFields = z.infer<typeof schema>;
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { currencyValues: currency },
  });

  const submitFunction: SubmitHandler<FormFields> = (data) => {
    let nowCurrncy = data.currencyValues;
    nowCurrncy = nowCurrncy.filter((item) => item !== 938);
    nowCurrncy.push(938);
    setCurrency(nowCurrncy);
    setCurrentStep({ step: 7, title: "/currency", completed: true });
    handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
  };

  usePreventBackNavigation();

  useEffect(() => {
    setCurrentStep({ step: 7, title: "/currency", completed: false });
  }, [setCurrentStep]);

  return (
    <MainLayout>
      {isSubmitting ? <Spinner /> : null}
      <Typography variant="h1" color="primary">
        {t("currency type")}
      </Typography>
      <form
        onSubmit={handleSubmit(submitFunction)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" mb={4}>
          {t("currency")}
        </Typography>
        <Grid container flexDirection="column" gap={1.6}>
          {currencies.map((currencyOption) => (
            <Grid item key={currencyOption.id}>
              <FormControlLabel
                control={
                  <Controller
                    name="currencyValues"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value.includes(currencyOption.id)}
                        disabled={currencyOption.id === 938}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, currencyOption.id]
                            : field.value.filter(
                              (val) => val !== currencyOption.id
                            );
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />
                }
                label={t(currencyOption.title)}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily:
                      i18n.language === "en"
                        ? "Exo Bold"
                        : "TheSansArabic-Bold",
                    fontSize: "20px",
                    fontWeight: "bold",
                    padding: 0,
                    margin: 0,
                    paddingInlineStart: "0.5rem",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </MainLayout>
  );
};

export default Currency;
