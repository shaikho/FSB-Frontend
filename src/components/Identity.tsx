import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import MainLayout from "../ui/MainLayout";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "../contexts/NavigationProvider";
import { useNavigate } from "react-router-dom";
import { handleNext } from "../utility/navigationUtils";
import { identityTypes } from "../data/data";
import NavigationBtns from "../ui/NavigationBtns";
import Spinner from "../ui/Spinner";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import RequestErrors from "../ui/RequestErrors";

const Identity: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { setCurrentStep, steps, currentStep, setError, error } =
    useNavigation();
  const { setDocument, identityType, setIdentityType } = useAuth();
  const handleChange = (event: SelectChangeEvent) => {
    setIdentityType(event.target.value);
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    if (identityType !== "") {
      if (identityType === "passport") {
        setDocument(3);
      } else if (identityType === "nationalId") {
        setDocument(2);
      } else setDocument(0);
      setCurrentStep({ step: 6, title: "/identity", completed: true });
      handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
      setIsLoading(false);
      setOpen(false);
    } else {
      setError(
        i18n.language === "en"
          ? "Identity type selection is required."
          : "يرجى تحديد نوع الهوية."
      );
      setOpen(true);
    }
  };
  usePreventBackNavigation();
  useEffect(() => {
    setCurrentStep({ step: 6, title: "/identity", completed: false });
  }, [setCurrentStep]);
  return (
    <MainLayout>
      {error === "" ? null : (
        <RequestErrors
          open={open}
          close={setOpen}
          errors={error}
          setError={setError}
        />
      )}
      {isLoading ? <Spinner /> : null}
      <Typography
        variant="h1"
        fontWeight="600"
        color="primary"
        textAlign="center"
        sx={{ marginBottom: "40px" }}
      >
        {t("ID type")}
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" color="initial" fontWeight="500" mb={1}>
          {t("ID")}
        </Typography>
        <Select
          value={identityType}
          onChange={handleChange}
          sx={{ width: "100%", display: "flex" }}
          displayEmpty
          inputProps={{ "aria-label": "Select identity type" }}
        >
          <MenuItem value="" disabled>
            {t("selectID")}
          </MenuItem>
          {identityTypes.map((type) => (
            <MenuItem key={type.id} value={type.title}>
              <Typography variant="body2" color="black">
                {t(`${type.title}`)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        <NavigationBtns isSubmitting={isLoading} />
      </form>
    </MainLayout>
  );
};

export default Identity;
