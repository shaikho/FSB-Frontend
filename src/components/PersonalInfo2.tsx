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
  const [selectedMaritalStatus, setSelectedMaritalStatus] = React.useState(submittedData.maritalStatus || "");
  const navigate = useNavigate();
  const maritalStatus = [
    { id: 1, title: t('single'), value: "Single" },
    { id: 2, title: t('married'), value: "Married" },
    { id: 3, title: t('divorced'), value: "Divorced" },
    { id: 4, title: t('widowed'), value: "Widowed" },
  ];
  const branches = [
    { code: "1", title: t("port_sudan") },
    { code: "2", title: t("gadaref") },
    { code: "3", title: t("white_nile") },
    { code: "4", title: t("wad_madani") },
    { code: "5", title: t("omdurman") },
    { code: "6", title: t("damazin") },
    { code: "7", title: t("managil") },
    { code: "8", title: t("sinnar") },
    { code: "9", title: t("blue_nile") },
    { code: "10", title: t("halfa_jadida") },
    { code: "11", title: t("sajana") },
    { code: "12", title: t("rabak") },
    { code: "13", title: t("hasahisa") },
    { code: "14", title: t("souk_libya") },
    { code: "15", title: t("khartoum") },
    { code: "16", title: t("khartoum_2") },
    { code: "17", title: t("khartoum_bahri") },
    { code: "18", title: t("jumhuriya") },
    { code: "19", title: t("local_market") },
    { code: "20", title: t("garden_city") },
    { code: "21", title: t("riyadh") },
    { code: "22", title: t("atbara") },
    { code: "23", title: t("mamoura") },
    { code: "24", title: t("janeed") },
    { code: "25", title: t("kadro") },
  ];
  const schma = z.object({
    address: z.string().min(5, {
      message:
        i18n.language === "en" ? "Address is required." : "العنوان مطلوب.",
    }),
    occupation: z.string().min(1, {
      message:
        i18n.language === "en" ? "Occupation is required." : "المهنة مطلوبة.",
    }).refine((val) => {
      return !/\d/.test(val);
    }, {
      message: i18n.language === "en" ? "Occupation cannot contain numbers." : "المهنة لا يمكن أن تحتوي على أرقام.",
    }),
    employer: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Employer is required."
          : "الجهة العاملة مطلوبة.",
    }).refine((val) => {
      return !/\d/.test(val);
    }, {
      message: i18n.language === "en" ? "Employer cannot contain numbers." : "الجهة العاملة لا يمكن أن تحتوي على أرقام.",
    }),
    averageIncome: z
      .string()
      .regex(/^\d*\.?\d*$/, {
        message: i18n.language === "en" ? "Invalid format." : "صيغة غير صالحة.",
      })
      .refine((val) => {
        // Accept empty string (optional), or a number > 0
        if (!val) return false;
        const num = Number(val);
        return !isNaN(num) && num > 0;
      }, {
        message: i18n.language === "en" ? "Income must be greater than 0." : "الدخل يجب أن يكون أكبر من 0.",
      }),
    MotherName: z.string().min(1, {
      message: i18n.language === "en" ? "Mother name is required." : "اسم الأم مطلوب.",
    }).refine((val) => {
      return !/\d/.test(val); // No numbers allowed
    }, {
      message: i18n.language === "en" ? "Mother name cannot contain numbers." : "اسم الأم لا يمكن أن يحتوي على أرقام.",
    }),
    partnerName: z.string().refine((val) => {
      if (selectedMaritalStatus !== "Married") return true;
      if (!val) return false;
      if (/\d/.test(val)) return false; // No numbers allowed
      return true;
    }, {
      message: i18n.language === "en"
        ? "Partner name is required and cannot contain numbers."
        : "اسم الزوج مطلوب ولا يمكن أن يحتوي على أرقام.",
    }),
    maritalStatus: z.string().min(1, {
      message: t('maritalStatusErrorMessage')
    }),
    placeOfResidency: z.string().optional(),
    branch: z.string().min(1, {
      message: i18n.language === "en" ? "Branch is required." : "الفرع مطلوب.",
    }),
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
    setSubmittedData({
      ...submittedData, // Spread the existing submittedData first
      MotherName: formdata.MotherName ? formdata.MotherName : "",
      partnerName: formdata.partnerName ? formdata.partnerName : "",
      occupation: formdata.occupation,
      address: formdata.address,
      averageIncome: formdata.averageIncome,
      employer: formdata.employer,
      placeOfResidency: formdata.placeOfResidency ? formdata.placeOfResidency : "N/A",
      branch: formdata.branch,
    });
    console.log('mother name:', formdata.MotherName);
    console.log('partner name:', formdata.partnerName);
    setPersonalInfoStep(2);
    handleNext(setCurrentStep, currentStep.step, steps, navigate);
  };

  const addressRef = useRef<HTMLInputElement>(null);
  const employerRef = useRef<HTMLInputElement>(null);
  const averageIncomeRef = useRef<HTMLInputElement>(null);
  const maritialStatusRef = useRef<HTMLSelectElement>(null);
  const occupationRef = useRef<HTMLInputElement>(null);

  // Refs for name inputs
  const motherNameRef = useRef<HTMLInputElement>(null);
  const partnerNameRef = useRef<HTMLInputElement>(null);

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
          placeholder={t("MotherName")}
          error={errors.MotherName?.message !== undefined}
          helperText={errors.MotherName ? errors.MotherName.message : ""}
          {...register("MotherName")}
          sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", marginBottom: "8px" }}
          tabIndex={1}
          inputRef={motherNameRef}
          onBlur={async () => {
            await trigger("MotherName");
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              maritialStatusRef.current?.focus();
            }
          }}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedMaritalStatus !== "Single") {
                      partnerNameRef.current?.focus();
                    } else {
                      occupationRef.current?.focus();
                    }
                  }
                }}
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
        {selectedMaritalStatus !== "Single" && (
          <>
            <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
              {t('partnerName')}
            </Typography>
            <TextField
              type="text"
              placeholder={t('partnerName')}
              error={errors.partnerName?.message !== undefined}
              helperText={errors.partnerName ? errors.partnerName.message : ""}
              {...register("partnerName")}
              sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", marginBottom: "8px" }}
              tabIndex={3}
              inputRef={partnerNameRef}
              onBlur={async () => {
                await trigger("partnerName");
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  occupationRef.current?.focus();
                }
              }}
            />
          </>
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
        <Typography variant="body1" color="initial" m={0} p={0} fontSize={10}>
          {t("closestbranch")}
        </Typography>
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                handleChange("branch")(e);
              }}
              label={t("closestbranch")}
              error={!!errors.placeOfResidency}
              tabIndex={7}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.code} value={branch.code}>
                  {branch.title}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
