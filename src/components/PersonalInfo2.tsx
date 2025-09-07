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
  // State for individual name parts
  const [motherNameParts, setMotherNameParts] = React.useState(() => {
    const fullName = submittedData.MotherName || "";
    const parts = fullName.split(" ");
    return {
      first: parts[0] || "",
      second: parts[1] || "",
      third: parts[2] || "",
      fourth: parts[3] || ""
    };
  });

  const [partnerNameParts, setPartnerNameParts] = React.useState(() => {
    const fullName = submittedData.partnerName || "";
    const parts = fullName.split(" ");
    return {
      first: parts[0] || "",
      second: parts[1] || "",
      third: parts[2] || "",
      fourth: parts[3] || ""
    };
  });

  // Handle individual name part changes
  const handleNamePartChange = (
    nameType: "mother" | "partner",
    part: "first" | "second" | "third" | "fourth"
  ) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Prevent numeric input
    if (/\d/.test(value)) {
      return;
    }

    // Allow more flexible word count per field, but check total limit
    const words = value.trim().split(/\s+/);
    if (value.trim() !== "" && words.length > 4) {
      // Limit individual fields to maximum 4 words to prevent abuse
      return;
    }

    if (nameType === "mother") {
      const newParts = { ...motherNameParts, [part]: value };
      // Check total word count across all fields
      const totalWords = [newParts.first, newParts.second, newParts.third, newParts.fourth]
        .filter(p => p.trim())
        .map(p => p.trim().split(/\s+/).length)
        .reduce((sum, count) => sum + count, 0);
      
      if (totalWords > 8) {
        // If total exceeds 8 words, don't update
        return;
      }
      
      setMotherNameParts(newParts);
      // Create combined name - only include if ALL four parts are filled
      const allPartsFilled = newParts.first.trim() && newParts.second.trim() && newParts.third.trim() && newParts.fourth.trim();
      if (allPartsFilled) {
        const fullName = [newParts.first, newParts.second, newParts.third, newParts.fourth]
          .map(p => p.trim())
          .join(" ");
        setValue("MotherName", fullName, { shouldValidate: true });
      } else {
        // If not all parts are filled, set empty string to trigger validation error
        setValue("MotherName", "", { shouldValidate: true });
      }
      await trigger("MotherName");
    } else {
      const newParts = { ...partnerNameParts, [part]: value };
      // Check total word count across all fields
      const totalWords = [newParts.first, newParts.second, newParts.third, newParts.fourth]
        .filter(p => p.trim())
        .map(p => p.trim().split(/\s+/).length)
        .reduce((sum, count) => sum + count, 0);
      
      if (totalWords > 8) {
        // If total exceeds 8 words, don't update
        return;
      }
      
      setPartnerNameParts(newParts);
      // Create combined name - only include if ALL four parts are filled
      const allPartsFilled = newParts.first.trim() && newParts.second.trim() && newParts.third.trim() && newParts.fourth.trim();
      if (allPartsFilled) {
        const fullName = [newParts.first, newParts.second, newParts.third, newParts.fourth]
          .map(p => p.trim())
          .join(" ");
        setValue("partnerName", fullName, { shouldValidate: true });
      } else {
        // If not all parts are filled, set empty string to trigger validation error
        setValue("partnerName", "", { shouldValidate: true });
      }
      await trigger("partnerName");
    }
  };
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
    }),
    employer: z.string().min(1, {
      message:
        i18n.language === "en"
          ? "Employer is required."
          : "الجهة العاملة مطلوبة.",
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
    MotherName: z.string().refine((val) => {
      if (!val) return false; // Required field
      if (/\d/.test(val)) return false; // No numbers allowed
      
      // We need to validate based on the individual parts, not just the combined string
      // This validation will be triggered when the combined name is set
      const words = val.trim().split(/\s+/).filter(word => word.length > 0);
      // Check total word count (4-8 words total, meaning each field has at least 1 word)
      if (words.length < 4) return false; // Minimum 4 words (one per field)
      if (words.length > 8) return false; // Maximum 8 words total
      return true;
    }, {
      message: i18n.language === "en" ? "Mother name must have all four parts filled (at least one word each), with 4-8 words total, and does not allow numbers." : "اسم الأم يجب أن يحتوي على الأجزاء الأربعة مملوءة (كلمة واحدة على الأقل لكل جزء)، من 4-8 كلمات إجمالية، ولا يحتوي على أرقام.",
    }),
    partnerName: z.string().refine((val) => {
      if (selectedMaritalStatus !== "Married") return true;
      if (!val) return false;
      if (/\d/.test(val)) return false; // No numbers allowed
      
      // We need to validate based on the individual parts, not just the combined string
      const words = val.trim().split(/\s+/).filter(word => word.length > 0);
      // Check total word count (4-8 words total, meaning each field has at least 1 word)
      if (words.length < 4) return false; // Minimum 4 words (one per field)
      if (words.length > 8) return false; // Maximum 8 words total
      return true;
    }, {
      message: i18n.language === "en"
        ? "Partner name must have all four parts filled (at least one word each), with 4-8 words total, and does not allow numbers."
        : "اسم الزوج يجب أن يحتوي على الأجزاء الأربعة مملوءة (كلمة واحدة على الأقل لكل جزء)، من 4-8 كلمات إجمالية، ولا يحتوي على أرقام.",
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

  // Refs for mother name parts
  const motherFirstRef = useRef<HTMLInputElement>(null);
  const motherSecondRef = useRef<HTMLInputElement>(null);
  const motherThirdRef = useRef<HTMLInputElement>(null);
  const motherFourthRef = useRef<HTMLInputElement>(null);

  // Refs for partner name parts
  const partnerFirstRef = useRef<HTMLInputElement>(null);
  const partnerSecondRef = useRef<HTMLInputElement>(null);
  const partnerThirdRef = useRef<HTMLInputElement>(null);
  const partnerFourthRef = useRef<HTMLInputElement>(null);

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
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <TextField
            type="text"
            placeholder={i18n.language === "en" ? "First" : "الأول"}
            value={motherNameParts.first}
            onChange={handleNamePartChange("mother", "first")}
            sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
            tabIndex={1}
            inputRef={motherFirstRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                motherSecondRef.current?.focus();
              }
            }}
          />
          <TextField
            type="text"
            placeholder={i18n.language === "en" ? "Second" : "الثاني"}
            value={motherNameParts.second}
            onChange={handleNamePartChange("mother", "second")}
            sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
            inputRef={motherSecondRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                motherThirdRef.current?.focus();
              }
            }}
          />
          <TextField
            type="text"
            placeholder={i18n.language === "en" ? "Third" : "الثالث"}
            value={motherNameParts.third}
            onChange={handleNamePartChange("mother", "third")}
            sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
            inputRef={motherThirdRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                motherFourthRef.current?.focus();
              }
            }}
          />
          <TextField
            type="text"
            placeholder={i18n.language === "en" ? "Fourth" : "الرابع"}
            value={motherNameParts.fourth}
            onChange={handleNamePartChange("mother", "fourth")}
            sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
            inputRef={motherFourthRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                maritialStatusRef.current?.focus();
              }
            }}
          />
        </div>
        {errors.MotherName && (
          <Typography variant="body2" color="error" sx={{ fontSize: "12px", mb: 1 }}>
            {errors.MotherName.message}
          </Typography>
        )}
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
                      partnerFirstRef.current?.focus();
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
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <TextField
                type="text"
                placeholder={i18n.language === "en" ? "First" : "الأول"}
                value={partnerNameParts.first}
                onChange={handleNamePartChange("partner", "first")}
                sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
                tabIndex={3}
                inputRef={partnerFirstRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    partnerSecondRef.current?.focus();
                  }
                }}
              />
              <TextField
                type="text"
                placeholder={i18n.language === "en" ? "Second" : "الثاني"}
                value={partnerNameParts.second}
                onChange={handleNamePartChange("partner", "second")}
                sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
                inputRef={partnerSecondRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    partnerThirdRef.current?.focus();
                  }
                }}
              />
              <TextField
                type="text"
                placeholder={i18n.language === "en" ? "Third" : "الثالث"}
                value={partnerNameParts.third}
                onChange={handleNamePartChange("partner", "third")}
                sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
                inputRef={partnerThirdRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    partnerFourthRef.current?.focus();
                  }
                }}
              />
              <TextField
                type="text"
                placeholder={i18n.language === "en" ? "Fourth" : "الرابع"}
                value={partnerNameParts.fourth}
                onChange={handleNamePartChange("partner", "fourth")}
                sx={{ borderRadius: "10px", margin: 0, fontSize: "12px", flex: 1 }}
                inputRef={partnerFourthRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    occupationRef.current?.focus();
                  }
                }}
              />
            </div>
            {errors.partnerName && (
              <Typography variant="body2" color="error" sx={{ fontSize: "12px", mb: 1 }}>
                {errors.partnerName.message}
              </Typography>
            )}
          </>
        )}

        {/* Hidden inputs to register the combined names with the form */}
        <input type="hidden" {...register("MotherName")} />
        <input type="hidden" {...register("partnerName")} />

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
        <NavigationBtns isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
