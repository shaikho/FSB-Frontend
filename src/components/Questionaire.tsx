import React, { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import NavigationBtns from "../ui/NavigationBtns";
import { useNavigation } from "../contexts/NavigationProvider";
import { useNavigate } from "react-router-dom";
import { handleNext } from "../utility/navigationUtils";
import { steps } from "../data/data";

const Questionaire: React.FC = () => {
  const { setCurrentStep, currentStep } = useNavigation();
  const [errorChoose, setErrorChoose] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const questions1: TQuestion[] = [
    { id: 1, title: "WorkedInGoverment" }
  ];
  const questions2: TQuestion[] = [
    { id: 2, title: "UsCitizen" },
    { id: 3, title: "UsResident" },
    { id: 4, title: "UsTaxPayer" },
    { id: 5, title: "UsAccount" }
  ];
  const { submittedData, setSubmittedData } = useAuth();
  const schema = z.object({
    WorkedInGoverment: z.boolean().refine((val) => val !== undefined),
    UsCitizen: z.boolean().refine((val) => val !== undefined),
    UsResident: z.boolean().refine((val) => val !== undefined),
    UsAccount: z.boolean().refine((val) => val !== undefined),
    UsTaxPayer: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are subject to US taxpayer."
          : "يرجى الإشارة ما إذا كنت تخضع للضرائب في الولايات المتحدة.",
    }),
  });
  type FormFields = z.infer<typeof schema>;
  type TQuestion = {
    id: number;
    title: keyof FormFields;
  };
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      WorkedInGoverment: submittedData.WorkedInGoverment,
      UsCitizen: submittedData.UsCitizen,
      UsResident: submittedData.UsResident,
      UsTaxPayer: submittedData.UsTaxPayer,
      UsAccount: submittedData.UsAccount
    },
  });

  const submitFunction = (formdata: FormFields) => {
    if (isChecked) {

      setCurrentStep({ step: 2, title: "/personal-info", completed: true });
      setSubmittedData({
        ...submittedData,
        WorkedInGoverment: formdata.WorkedInGoverment,
        UsCitizen: formdata.UsCitizen,
        UsResident: formdata.UsResident,
        UsTaxPayer: formdata.UsTaxPayer,
        UsAccount: formdata.UsAccount
      });
      handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
    } else {
      const error = t("ErrorAgreeTerm");
      setErrorChoose(error);
    }
  };

  const isSmallScreen = useMediaQuery("(max-width:384px)");
  return (
    <>
      <form
        onSubmit={handleSubmit(submitFunction)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {questions1.map((question) => (
          <FormControl
            key={`${question.id}-frmc`}
            component="fieldset"
            error={Boolean(errors[question.title]?.message)}
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              marginTop: "10px",
              padding: "10px 0",
            }}
          >
            <FormLabel
              key={`${question.id}-lbl3`}
              component="legend"
              sx={{
                padding: 0,
                margin: 0,
                maxWidth: isSmallScreen ? "15ch" : "100%",
              }}
            >
              {t(question.title)}
            </FormLabel>
            <FormGroup
              key={`${question.id}-gb`}
              row
              sx={{ marginTop: "-40px" }}
            >
              <Controller
                key={`${question.id}-control`}
                name={question.title}
                control={control}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      key={`${question.id}-lbl2`}
                      control={
                        <Checkbox
                          key={`${question.id}-check2`}
                          {...field}
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          color="primary"
                        />
                      }
                      label={i18n.language === "en" ? "Yes" : "نعم"}
                    />
                    <FormControlLabel
                      key={`${question.id}-lbl`}
                      control={
                        <Checkbox
                          key={`${question.id}-check`}
                          {...field}
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          color="primary"
                        />
                      }
                      label={i18n.language === "en" ? "No" : "لا"}
                    />
                  </>
                )}
              />
            </FormGroup>
          </FormControl>
        ))}

        <Typography
          variant="h1"
          fontWeight="600"
          color="primary"
          textAlign="center"
          m={2}
        >
          {t("vaticaQuestions")}
        </Typography>

        {questions2.map((question) => (
          <FormControl
            key={`${question.id}-frmc`}
            component="fieldset"
            error={Boolean(errors[question.title]?.message)}
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              marginTop: "10px",
              padding: "10px 0",
            }}
          >
            <FormLabel
              key={`${question.id}-lbl3`}
              component="legend"
              sx={{
                padding: 0,
                margin: 0,
                maxWidth: isSmallScreen ? "15ch" : "100%",
              }}
            >
              {t(question.title)}
            </FormLabel>
            <FormGroup
              key={`${question.id}-gb`}
              row
              sx={{ marginTop: "-10px" }}
            >
              <Controller
                key={`${question.id}-control`}
                name={question.title}
                control={control}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      key={`${question.id}-lbl2`}
                      control={
                        <Checkbox
                          key={`${question.id}-check2`}
                          {...field}
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          color="primary"
                        />
                      }
                      label={i18n.language === "en" ? "Yes" : "نعم"}
                    />
                    <FormControlLabel
                      key={`${question.id}-lbl`}
                      control={
                        <Checkbox
                          key={`${question.id}-check`}
                          {...field}
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          color="primary"
                        />
                      }
                      label={i18n.language === "en" ? "No" : "لا"}
                    />
                  </>
                )}
              />
            </FormGroup>
          </FormControl>
        ))}
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
        <Box p={2} pb={4}>
          <a
            href={i18n.language === "en" ? "/TC-vatica-en.pdf" : "/TC-vatica-ar.pdf"}
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
        </Box>
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
};

export default Questionaire;
