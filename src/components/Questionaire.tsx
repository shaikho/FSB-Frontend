import React from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import {
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
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const questions: TQuestion[] = [
    { id: 1, title: "PresidentFamilyMember" },
    { id: 2, title: "MinisterPolitician" },
    { id: 3, title: "MemberofParliament" },
    { id: 4, title: "MilitaryHighRank" },
    { id: 5, title: "SeniorOfficial" },
    { id: 6, title: "ForeignDiplomatic" },
    { id: 7, title: "SubjecttoUSAtaxpayer" },
  ];
  const { submittedData, setSubmittedData } = useAuth();
  const schema = z.object({
    PresidentFamilyMember: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are a family member of the President."
          : "يرجى الإشارة ما إذا كنت من أفراد أسرة الرئيس.",
    }),
    MinisterPolitician: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are a Minister or Politician."
          : "يرجى الإشارة ما إذا كنت وزيرًا أو سياسيًا.",
    }),
    MemberofParliament: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are a Member of Parliament."
          : "يرجى الإشارة ما إذا كنت عضوًا في البرلمان.",
    }),
    MilitaryHighRank: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you hold a Military High Rank."
          : "يرجى الإشارة ما إذا كنت تحمل رتبة عسكرية عالية.",
    }),
    SeniorOfficial: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are a Senior Official."
          : "يرجى الإشارة ما إذا كنت مسؤولًا كبيرًا.",
    }),
    ForeignDiplomatic: z.boolean().refine((val) => val !== undefined, {
      message:
        i18n.language === "en"
          ? "Please indicate if you are a Foreign Diplomatic."
          : "يرجى الإشارة ما إذا كنت دبلوماسيًا أجنبيًا.",
    }),
    SubjecttoUSAtaxpayer: z.boolean().refine((val) => val !== undefined, {
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
      PresidentFamilyMember: submittedData.PresidentFamilyMember,
      MinisterPolitician: submittedData.MinisterPolitician,
      MemberofParliament: submittedData.MemberofParliament,
      MilitaryHighRank: submittedData.MilitaryHighRank,
      SeniorOfficial: submittedData.SeniorOfficial,
      ForeignDiplomatic: submittedData.ForeignDiplomatic,
      SubjecttoUSAtaxpayer: submittedData.SubjecttoUSAtaxpayer,
    },
  });

  const submitFunction = (formdata: FormFields) => {
    setSubmittedData({
      ...submittedData,
      PresidentFamilyMember: formdata.PresidentFamilyMember,
      MinisterPolitician: formdata.MinisterPolitician,
      MemberofParliament: formdata.MemberofParliament,
      MilitaryHighRank: formdata.MilitaryHighRank,
      SeniorOfficial: formdata.SeniorOfficial,
      ForeignDiplomatic: formdata.ForeignDiplomatic,
      SubjecttoUSAtaxpayer: formdata.SubjecttoUSAtaxpayer,
    });
    setCurrentStep({ step: 8, title: "/personal-info", completed: true });
    handleNext(setCurrentStep, currentStep.step, steps, navigate);
  };
  const isSmallScreen = useMediaQuery("(max-width:384px)");
  return (
    <>
      <Typography variant="body1" color="initial">
        {t("areYou")}
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
        {questions.map((question) => (
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
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
};

export default Questionaire;
