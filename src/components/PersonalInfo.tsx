import { useEffect } from "react";
import MainLayout from "../ui/MainLayout";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PersonalInfo1 from "./PersonalInfo1";
import PersonalInfo2 from "./PersonalInfo2";
import Questionaire from "./Questionaire";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useNavigation } from "../contexts/NavigationProvider";
export default function PersonalInfo() {
  usePreventBackNavigation();
  const { setCurrentStep, personalInfoStep, setPersonalInfoStep } =
    useNavigation();

  const { t } = useTranslation();

  const personalInfo = [
    {
      id: 0,
      component: <PersonalInfo1 setPersonalInfoStep={setPersonalInfoStep} />,
    },
    {
      id: 1,
      component: <PersonalInfo2 setPersonalInfoStep={setPersonalInfoStep} />,
    },

    {
      id: 2,
      component: <Questionaire />,
    },
  ];
  useEffect(() => {
    if (setCurrentStep) {
      setCurrentStep({ step: 8, title: "/personal-info", completed: false });
    }
  }, [setCurrentStep]);
  return (
    <MainLayout>
      <Box
        component="div"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1
        }}
      >
        <Typography
          variant="h1"
          fontWeight="600"
          color="primary"
          textAlign="center"
          m={2}
        >
          {personalInfoStep === 2 ? t("questions") : t("personal info")}
        </Typography>
        {personalInfo[personalInfoStep].component}
      </Box>
    </MainLayout>
  );
}
