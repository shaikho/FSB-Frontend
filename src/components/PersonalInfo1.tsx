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
import { IsVerified, updateIsVerified } from "../axios";
import { handleBack, handleNext } from "../utility/navigationUtils";
import { useNavigate } from "react-router-dom";

type TPersonalInfo1Props = {
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function PersonalInfo1({
  setPersonalInfoStep,
}: TPersonalInfo1Props) {
  const { document, setLivenessCheck, livenessCheckSessionId, documentData, submittedData, setSubmittedData, uqudoToken, setShowNationalNumberForm } = useAuth();
  const {
    setDone,
    setCurrentStep,
    steps,
    currentStep,
    setError,
  } = useNavigation();
  const { t, i18n } = useTranslation();
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
    const nationalIDNumber = documentData.identityNumber.replace(/-/g, "");
    const isVerified = await IsVerified(nationalIDNumber);
    setIsLoading(false); // make sure this is enabled before pushing
    if (!isVerified) {
      await updateIsVerified(nationalIDNumber, true);
      const { LivenessCheckJourney } = await import("./LivenessCheckJourney");
      const isNationalIDCheck = false;
      // TODO: call liveness check session id
      const sessionId = livenessCheckSessionId;
      const wasSuccessful = await LivenessCheckJourney({
        setError,
        navigate,
        i18n,
        setLoading: () => { },
        setOpen: () => { },
        sessionId,
        setShowNationalNumberForm,
        setLivenessCheck,
        isNationalIDCheck,
        documentData
      });
      if (wasSuccessful) {
        setCurrentStep({ step: 8, title: "/display-personal-info", completed: true });
        handleNext(setCurrentStep, currentStep.step + 1, steps, navigate);
      } else {
        // national number id error message
        if (document === 4) {
          setError(
            i18n.language === "en"
              ? "Your request for opening an account has been received already and being processed, you will be notified using the registered Email and phone number."
              : "تم استلام طلبك لفتح الحساب وجارٍ معالجته. سيتم إشعارك عبر البريد الإلكتروني ورقم الهاتف المسجلين."
          );
        } else {
          // passport error message
          setError(
            i18n.language === "en"
              ? "Already you have Fib account"
              : "لديك حساب بالفعل."
          );
        }
        setCurrentStep({ step: 1, title: "/", completed: false });
        handleBack(setCurrentStep, currentStep.step, steps, navigate)
      }
    } else { // user already has an account
      setError(
        i18n.language === "en"
          ? "Already you have Fib account"
          : "لديك حساب بالفعل."
      );
      setCurrentStep({ step: 1, title: "/", completed: false });
      handleNext(setCurrentStep, 0, steps, navigate)
    }
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
            marginBottom: "5.5rem",
          }}
          onBlur={async () => await trigger("dateofexpiry")}
        />

        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
