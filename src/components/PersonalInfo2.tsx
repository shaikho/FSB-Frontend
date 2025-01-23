import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
// import { maritalStatus } from "../data/data";
import NavigationBtns from "../ui/NavigationBtns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "../ui/Spinner";
import { handleNext } from "../utility/navigationUtils";
import { useNavigation } from "../contexts/NavigationProvider";
import { useNavigate } from "react-router-dom";

type TPersonalInfo2Props = {
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function PersonalInfo2({
  setPersonalInfoStep,
}: TPersonalInfo2Props) {
  const { t, i18n } = useTranslation();
  const { setSubmittedData, submittedData } = useAuth();
  const { setCurrentStep, currentStep, steps, } = useNavigation();
  const [selectedMaritalStatus, setSelectedMaritalStatus] = React.useState("");
  const navigate = useNavigate();
  const maritalStatus = [
    { id: 1, title: t('single'), value: "Single" },
    { id: 2, title: t('married'), value: "Married" },
    { id: 3, title: t('divorced'), value: "Divorced" },
    { id: 4, title: t('widowed'), value: "Widowed" },
  ];
  const schma = z.object({
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
    partnerName: z.string().refine((val) => {
      if (selectedMaritalStatus === "Married" && !val) {
        return false;
      }
      return true;
    }, {
      message: t('partnerNameErrorMessage')
    }),
    maritalStatus: z.string().min(1, {
      message: t('maritalStatusErrorMessage')
    }),
    placeOfResidency: z.string().optional()
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
      MotherName: submittedData.MotherName,
      occupation: submittedData.occupation,
      address: submittedData.address,
      averageIncome: submittedData.averageIncome,
      employer: submittedData.employer,
      partnerName: submittedData.partnerName,
      maritalStatus: submittedData.maritalStatus,
      placeOfResidency: submittedData.placeOfResidency
    },
  });

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

  const handleChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setSubmittedData({
      ...submittedData,
      [field]: event.target.value,
    });
    if (field === "maritalStatus") {
      setSelectedMaritalStatus(event.target.value);
    }
  };

  const submitFunction = (formdata: FormFields) => {
    console.log(submittedData);
    setSubmittedData({
      ...submittedData, // Spread the existing submittedData first
      MotherName: formdata.MotherName ? formdata.MotherName : "",
      occupation: formdata.occupation,
      address: formdata.address,
      averageIncome: formdata.averageIncome,
      employer: formdata.employer,
      placeOfResidency: formdata.placeOfResidency ? formdata.placeOfResidency : "N/A",
    });
    setPersonalInfoStep(2);
    handleNext(setCurrentStep, currentStep.step, steps, navigate);
  };

  const addressRef = useRef(null);
  const employerRef = useRef(null);
  const averageIncomeRef = useRef(null);
  const maritialStatusRef = useRef(null);
  const partnerNameRef = useRef(null);
  const occupationRef = useRef(null);

  const handleKeyDown = (e: any, nextRef: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current.focus();
    }
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
          {t("MotherName")}
        </Typography>
        <TextField
          type="text"
          id="MotherName"
          {...register("MotherName")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          tabIndex={1}
          onKeyDown={(e) => handleKeyDown(e, maritialStatusRef)}
        />
        <FormControl fullWidth>
          <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
            {t('maritalStatus')}
          </Typography>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  handleChange("maritalStatus")(e);
                }}
                label={t('maritalStatus')}
                error={!!errors.maritalStatus}
                tabIndex={2}
                inputRef={maritialStatusRef}
                onKeyDown={(e) => handleKeyDown(e, partnerNameRef)}
              >
                {maritalStatus.map((status) => (
                  <MenuItem key={status.id} value={status.value}>
                    {status.title}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t('partnerName')}
        </Typography>
        <TextField
          type="text"
          id="partnerName"
          {...register("partnerName")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px" }}
          tabIndex={3}
          inputRef={partnerNameRef}
        />
        {errors.partnerName && (
          <Typography variant="body2" color="error">
            {errors.partnerName.message}
          </Typography>
        )}
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
          tabIndex={4}
          inputRef={occupationRef}
          onKeyDown={(e) => handleKeyDown(e, addressRef)}
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
          tabIndex={4}
          inputRef={addressRef}
          onKeyDown={(e) => handleKeyDown(e, employerRef)}
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
          tabIndex={5}
          inputRef={employerRef}
          onKeyDown={(e) => handleKeyDown(e, averageIncomeRef)}
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
          tabIndex={6}
          onBlur={async () => {
            await trigger("averageIncome");
          }}
          onChange={averageIncomeChange}
          inputRef={averageIncomeRef}
          onKeyDown={(e) => handleKeyDown(e, null)}
        />
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
      <Typography>
        {Object.keys(errors).length > 0 && (
          <div>
            {Object.entries(errors).map(([key, error]) => (
              <Typography key={key} variant="body2" color="error">
                {error.message}
              </Typography>
            ))}
          </div>
        )}
      </Typography>
    </>
  );
}
