import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography, Autocomplete } from "@mui/material";
import { useTranslation } from "react-i18next";
import MainLayout from "../ui/MainLayout";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationProvider";
import { useAuth } from "../contexts/AuthProvider";
import { handleNext } from "../utility/navigationUtils";
import { countries } from "../data/data";
import NavigationBtns from "../ui/NavigationBtns";
import { FlagIcon } from "react-flag-kit";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { TCountry } from "../types/types";

const Residency: React.FC = () => {
  const { setCurrentStep, steps, currentStep } = useNavigation();
  const { t, i18n } = useTranslation();
  const { residency, setResidency } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    if (!isNaN(residency)) {
      setCurrentStep({ step: 5, title: "/residency", completed: true });
      handleNext(setCurrentStep, currentStep.step, steps, navigate);
      setIsLoading(false);
    } else {
      // Implement error handling or feedback to indicate that residency selection is required
      console.error("Residency selection is required.");
    }
  };

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: TCountry | null
  ) => {
    console.log(event);
    setResidency(value ? value.id : 729);
  };

  const getOptionLabel = (option: TCountry) => {
    return t(option.title);
  };
  usePreventBackNavigation();
  useEffect(() => {
    setCurrentStep({ step: 5, title: "/residency", completed: false });
  }, [setCurrentStep]);

  const sortedCountries = useMemo(() => {
    return countries.sort((a, b) => {
      const titleA = t(a.title);
      const titleB = t(b.title);
      return titleA.localeCompare(titleB, "ar");
    });
  }, [t]);
  return (
    <MainLayout>
      {isLoading ? <Spinner /> : null}
      <Typography variant="h1" color="primary">
        {t("residency")}
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Typography variant="body1">{t("residencyLabel")}</Typography>
        <Autocomplete
          options={i18n.language === "en" ? countries : sortedCountries}
          getOptionLabel={getOptionLabel}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: "flex", gap: 2 }}>
              <FlagIcon code={option.code} />
              {t(option.title)}
            </Box>
          )}
          value={countries.find((country) => country.id === residency)}
          onChange={handleChange}
          isOptionEqualToValue={(option, value) =>
            option.title === value.title
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {residency && (
                      <FlagIcon
                        code={
                          countries.find(
                            (country) => country.id === residency
                          )?.code || "SD"
                        }
                        size={16}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <NavigationBtns isSubmitting={isLoading} />
      </form>
    </MainLayout>
  );
};

export default Residency;
