import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { countryCodes } from "../data/data";
import NavigationBtns from "../ui/NavigationBtns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "../ui/Spinner";

type TPersonalInfo2Props = {
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function PersonalInfo2({
  setPersonalInfoStep,
}: TPersonalInfo2Props) {
  const { t, i18n } = useTranslation();
  const { setSubmittedData, submittedData } = useAuth();

  const schma = z.object({
    AcountryCode: z
      .string()
      .min(1)
      .max(5, {
        message:
          i18n.language === "en"
            ? "Country code is required."
            : "كود البلد مطلوب.",
      }),
    AphoneNumber: z
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
    address: z.string().min(5, {
      message:
        i18n.language === "en" ? "Address is required." : "العنوان مطلوب.",
    }),
    occupation: z.string().min(1, {
      message:
        i18n.language === "en" ? "Occupation is required." : "المهنة مطلوبة.",
    }),
    employer: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Employer is required."
          : "الجهة العاملة مطلوبة.",
    }),
    averageIncome: z.string().regex(/^\d*\.?\d*$/, {
      message: i18n.language === "en" ? "Invalid format." : "صيغة غير صالحة.",
    }),
    MotherName: z.string().optional(),
  });
  type FormFields = z.infer<typeof schma>;
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
    control,
    register,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(schma),
    defaultValues: {
      AcountryCode: submittedData.AcountryCode,
      AphoneNumber: submittedData.AphoneNumber,
      MotherName: submittedData.MotherName,
      occupation: submittedData.occupation,
      address: submittedData.address,
      averageIncome: submittedData.averageIncome,
      employer: submittedData.employer,
    },
  });
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && (value.length <= 8 || value.length <= 10)) {
      if (value[0] === "0") {
        setValue("AphoneNumber", value.slice(1, value.length), {
          shouldValidate: true,
        });
      } else setValue("AphoneNumber", value, { shouldValidate: true });
    }
  };

  const averageIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      (/^\d*\.?\d+$/.test(value) && value.length <= 15) ||
      value[value.length - 1] === "."
    ) {
      setValue("averageIncome", value, { shouldValidate: true });
    } else
      setValue("averageIncome", value.slice(0, value.length - 1), {
        shouldValidate: true,
      });
  };

  const sortedCountries = useMemo(() => {
    return countryCodes.sort((a, b) => {
      const titleA = t(a.label);
      const titleB = t(b.label);
      return titleA.localeCompare(titleB, "ar");
    });
  }, [t]);

  const submitFunction = (formdata: FormFields) => {
    setSubmittedData({
      ...submittedData, // Spread the existing submittedData first
      AcountryCode: formdata.AcountryCode,
      AphoneNumber: formdata.AphoneNumber,
      MotherName: formdata.MotherName ? formdata.MotherName : "",
      occupation: formdata.occupation,
      address: formdata.address,
      averageIncome: formdata.averageIncome,
      employer: formdata.employer,
    });
    setPersonalInfoStep(2);
  };
  return (
    <>
      {isSubmitting ? <Spinner /> : null}
      <form
        onSubmit={handleSubmit(submitFunction)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("AnotherPhoneNumber")}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          flexWrap="nowrap"
          spacing={1}
        >
          <Grid item xs={6} sx={{ flexGrow: 1, flexShrink: 0 }}>
            <FormControl fullWidth>
              <InputLabel id="country-code-label" sx={{ display: "none" }}>
                {t("Country Code")}
              </InputLabel>
              <Controller
                name="AcountryCode"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    aria-label="Country Codes"
                    labelId="country-code-label"
                    label="ACountry Code"
                    error={Boolean(errors.AcountryCode)}
                    onBlur={async () => {
                      await trigger("AcountryCode");
                    }}
                  >
                    <MenuItem value=""></MenuItem>
                    {i18n.language === "en"
                      ? countryCodes.map((option) => (
                          <MenuItem key={option.label} value={option.code}>
                            {t(`${option.label}`)} (
                            {i18n.language === "en"
                              ? option.code
                              : `${option.code.slice(1, option.code.length)}+`}
                            )
                          </MenuItem>
                        ))
                      : sortedCountries.map((option) => (
                          <MenuItem key={option.label} value={option.code}>
                            {t(`${option.label}`)} (
                            {i18n.language === "en"
                              ? option.code
                              : `${option.code.slice(1, option.code.length)}+`}
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
              name="AphoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  type="number"
                  id="AphoneNumber"
                  error={!!errors.AphoneNumber}
                  helperText={errors.AphoneNumber?.message}
                  placeholder={t("PhoneNumberPlaceholder")}
                  onBlur={async () => {
                    await trigger("AphoneNumber");
                  }}
                  onChange={handlePhoneNumberChange}
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("MotherName")}
        </Typography>
        <TextField
          type="text"
          id="MotherName"
          {...register("MotherName")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("address")}
        </Typography>
        <TextField
          type="text"
          id="address"
          error={errors.address?.message !== undefined}
          helperText={errors.address ? errors.address.message : ""}
          {...register("address")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => {
            await trigger("address");
          }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("occupation")}
        </Typography>
        <TextField
          type="text"
          id="occupation"
          error={errors.occupation?.message !== undefined}
          helperText={errors.occupation ? errors.occupation.message : ""}
          {...register("occupation")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => {
            await trigger("occupation");
          }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("employer")}
        </Typography>
        <TextField
          type="text"
          id="employer"
          error={errors.employer?.message !== undefined}
          helperText={errors.employer ? errors.employer.message : ""}
          {...register("employer")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => {
            await trigger("employer");
          }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("averageIncome")}
        </Typography>
        <TextField
          type="tel"
          id="averageIncome"
          error={errors.averageIncome?.message !== undefined}
          helperText={errors.averageIncome ? errors.averageIncome.message : ""}
          {...register("averageIncome")}
          sx={{
            borderRadius: "10px",
            margin: 0,
            fontSize: "12px",
            marginBottom: "1rem",
          }}
          onBlur={async () => {
            await trigger("averageIncome");
          }}
          onChange={averageIncomeChange}
        />
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
