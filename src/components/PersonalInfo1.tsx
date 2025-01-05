import { MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { gender } from "../data/data";
import { useAuth } from "../contexts/AuthProvider";
import NavigationBtns from "../ui/NavigationBtns";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../ui/Spinner";
import { useNavigation } from "../contexts/NavigationProvider";
import { openCIF } from "../axios";
import { handleNext } from "../utility/navigationUtils";
import { useNavigate } from "react-router-dom";

type TPersonalInfo1Props = {
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function PersonalInfo1({
  setPersonalInfoStep,
}: TPersonalInfo1Props) {
  const { documentData, submittedData, setSubmittedData } = useAuth();
  const {
    setDone,
    setCurrentStep,
    steps,
    currentStep,
    setError,
  } = useNavigation(); const { t, i18n } = useTranslation();
  const contextValue = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const schema = z.object({
    fullNameEnglish: z.string(),
    fullNameArabic: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Full name in Arabic is required."
          : "الاسم الكامل باللغة العربية مطلوب.",
    }),
    dateofBirth: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Date of birth is required."
          : "تاريخ الميلاد مطلوب.",
    }),
    placeofBirth: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Place of birth is required."
          : "مكان الميلاد مطلوب.",
    }),
    gender: z.string().length(1, {
      message: i18n.language === "en" ? "Gender is required." : "الجنس مطلوب.",
    }),
    IDNumber: z.string().refine((val) => val.length === 9, {
      message:
        i18n.language === "en"
          ? `ID number must be ${"9"} characters long.`
          : `يجب أن يكون رقم الهوية ${"9"} أحرف.`,
    }),
    nationalIDNumber: z
      .string()
      .min(1, {
        message:
          i18n.language === "en"
            ? "National ID number is required."
            : "الرقم القومي مطلوب.",
      })
      .optional(),
    placeofIssue: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Place of issue is required."
          : "مكان الإصدار مطلوب.",
    }),
    dateofIssue: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Date of issue is required."
          : "تاريخ الإصدار مطلوب.",
    }),
    dateofexpiry: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Date of expiry is required."
          : "تاريخ الانتهاء مطلوب.",
    }),
    identityNumber: z.string(),
  });

  type FormFields = z.infer<typeof schema>;
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
    control,
    register,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullNameEnglish: documentData.fullName,
      fullNameArabic: documentData.fullNameArabic,
      dateofBirth: documentData.dateOfBirthFormatted.toString(),
      placeofBirth: documentData.placeOfBirth,
      gender: documentData.sex,
      IDNumber: documentData.documentNumber,
      identityNumber: documentData.identityNumber,
      placeofIssue: documentData.placeOfIssue,
      dateofIssue: documentData.issueDateFormatted.toString(),
      dateofexpiry: documentData.dateOfExpiryFormatted.toString(),
    },
  });

  const submitFunction = async (formdata: FormFields) => {
    setIsLoading(true);
    setSubmittedData({
      ...submittedData,
      fullNameArabic: formdata.fullNameArabic,
      fullNameEnglish: formdata.fullNameEnglish,
      dateofBirth: formdata.dateofBirth,
      placeofBirth: formdata.placeofBirth,
      gender: formdata.gender,
      IDNumber: formdata.IDNumber,
      identityNumber: formdata.identityNumber,
      placeofIssue: formdata.placeofIssue,
      dateofIssue: formdata.dateofIssue,
      dateofexpiry: formdata.dateofexpiry,
    });
    // submit data to the server
    const data = {
      documentData: contextValue.documentData,
      email: contextValue.email,
      currency: contextValue.currency,
      residency: contextValue.residency,
      mobileNumber: contextValue.mobileNumber,
      fullNameEnglish: contextValue.documentData.fullName,
      fullNameArabic: contextValue.documentData.fullNameArabic,
      dateofBirth: contextValue.documentData.dateOfBirthFormatted,
      placeofBirth: contextValue.documentData.placeOfBirth,
      gender: contextValue.documentData.sex,
      IDNumber: contextValue.documentData.documentNumber,
      nationalIDNumber: contextValue.documentData.identityNumber,
      placeofIssue: contextValue.documentData.placeOfIssue,
      dateofIssue: contextValue.documentData.issueDateFormatted,
      dateofexpiry: contextValue.documentData.dateOfExpiryFormatted,
      AcountryCode: contextValue.submittedData.AcountryCode,
      AphoneNumber: contextValue.submittedData.AphoneNumber,
      address: contextValue.submittedData.address,
      occupation: contextValue.submittedData.occupation,
      employer: contextValue.submittedData.employer,
      averageIncome: contextValue.submittedData.averageIncome,
      PresidentFamilyMember: contextValue.submittedData.PresidentFamilyMember,
      MinisterPolitician: contextValue.submittedData.MinisterPolitician,
      MemberofParliament: contextValue.submittedData.MemberofParliament,
      MilitaryHighRank: contextValue.submittedData.MilitaryHighRank,
      SeniorOfficial: contextValue.submittedData.SeniorOfficial,
      ForeignDiplomatic: contextValue.submittedData.ForeignDiplomatic,
      SubjecttoUSAtaxpayer: contextValue.submittedData.SubjecttoUSAtaxpayer,
      MotherName: contextValue.submittedData.MotherName,
      identityNumber: contextValue.submittedData.identityNumber,
      signature: contextValue.signeture,
      document: contextValue.document,
      photo: contextValue.photo,
      language: i18n.language.toUpperCase(),
      WorkedInGoverment: contextValue.submittedData.WorkedInGoverment,
      UsCitizen: contextValue.submittedData.UsCitizen,
      UsResident: contextValue.submittedData.UsResident,
      UsTaxPayer: contextValue.submittedData.UsTaxPayer,
      UsAccount: contextValue.submittedData.UsAccount,
    };
    const { done, message } = await openCIF(data);
    setDone(done);
    setError(message);
    setIsLoading(false);
    setCurrentStep({ step: 8, title: "/display-personal-info", completed: true });
    handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
  };
  useEffect(() => {
    setCurrentStep({ step: 8, title: "/display-personal-info", completed: false });
  }, [setCurrentStep]);
  return (
    <>
      {isSubmitting ? <Spinner /> : null}
      <form
        onSubmit={handleSubmit(submitFunction)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("fullNameEnglish")}
        </Typography>
        <TextField
          type="text"
          disabled={contextValue.documentData.fullName !== ""}
          id="fullNameEnglish"
          {...register("fullNameEnglish")}
          error={errors.fullNameEnglish?.message !== undefined}
          helperText={
            errors.fullNameEnglish ? errors.fullNameEnglish.message : ""
          }
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => {
            await trigger("fullNameEnglish");
          }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("fullNameArabic")}
        </Typography>
        <TextField
          disabled={true}
          type="text"
          id="fullNameArabic"
          {...register("fullNameArabic")}
          error={errors.fullNameArabic?.message !== undefined}
          helperText={
            errors.fullNameArabic ? errors.fullNameArabic.message : ""
          }
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => {
            await trigger("fullNameArabic");
          }}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("dateofBirth")}
        </Typography>
        <TextField
          disabled={true}
          type="text"
          id="dateofBirth"
          {...register("dateofBirth")}
          error={errors.dateofBirth?.message !== undefined}
          helperText={errors.dateofBirth ? errors.dateofBirth.message : ""}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("dateofBirth")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("placeofBirth")}
        </Typography>
        <TextField
          type="text"
          disabled={true}
          id="placeofBirth"
          {...register("placeofBirth")}
          error={errors.placeofBirth?.message !== undefined}
          helperText={errors.placeofBirth ? errors.placeofBirth.message : ""}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("placeofBirth")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("gender")}
        </Typography>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              id="gender"
              disabled={watch("gender") !== ""}
              {...field}
              error={errors.gender?.message !== undefined}
              sx={{ width: "100%" }}
              displayEmpty
              inputProps={{ "aria-label": "Select gender" }}
              onBlur={async () => await trigger("gender")}
            >
              <MenuItem value="" disabled>
                {t("select gender")}
              </MenuItem>
              {gender.map((gender) => (
                <MenuItem key={gender.id} value={gender.id}>
                  <Typography variant="body2" color="black">
                    {t(`${gender.title}`)}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <Typography variant="body1" color="error">
          {errors.gender ? errors.gender.message : ""}
        </Typography>
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("IDNumber")}
        </Typography>
        <TextField
          type="text"
          id="IDNumber"
          disabled={true}
          error={errors.IDNumber?.message !== undefined}
          helperText={errors.IDNumber ? errors.IDNumber.message : ""}
          maxLength={9}
          {...register("IDNumber")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("IDNumber")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("nationalIDNumber")}
        </Typography>
        <TextField
          type="text"
          id="identityNumber"
          disabled={true}
          maxLength={15}
          error={errors.identityNumber?.message !== undefined}
          helperText={
            errors.identityNumber ? errors.identityNumber.message : ""
          }
          {...register("identityNumber")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("identityNumber")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("placeofIssue")}
        </Typography>
        <TextField
          type="text"
          id="placeofIssue"
          disabled={true}
          error={errors.placeofIssue?.message !== undefined}
          helperText={errors.placeofIssue ? errors.placeofIssue.message : ""}
          {...register("placeofIssue")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("placeofIssue")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("dateofIssue")}
        </Typography>
        <TextField
          disabled={true}
          type="text"
          id="dateofIssue"
          error={errors.dateofIssue?.message !== undefined}
          helperText={errors.dateofIssue ? errors.dateofIssue.message : ""}
          {...register("dateofIssue")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          onBlur={async () => await trigger("dateofIssue")}
        />
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("dateofexpiry")}
        </Typography>
        <TextField
          disabled={true}
          type="text"
          id="dateofexpiry"
          error={errors.dateofexpiry?.message !== undefined}
          helperText={errors.dateofexpiry ? errors.dateofexpiry.message : ""}
          {...register("dateofexpiry")}
          sx={{
            borderRadius: "10px",
            margin: 0,
            fontSize: "12px",
            marginBottom: "1rem",
          }}
          onBlur={async () => await trigger("dateofexpiry")}
        />

        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
