import {
  ReturnEnrollmentType,
  OperationError,
} from "uqudosdk-preview-web";
import { IUqudoSdkConfig } from "uqudosdk-preview-web";
import { parseJwt } from "./AuthAPI";
import { handleNext } from "../utility/navigationUtils";
import { TConfig, TDocumentData, TSteps } from "../types/types";
import { Dispatch, SetStateAction } from "react";
import { steps } from "../data/data";
import { NavigateFunction } from "react-router-dom";
import { getToken } from "../axios";
import { uqudoObjectArabic, uqudoObjectEnglish } from "../data/uqudo";
import { i18n } from "i18next";
// Function to get the configuration for the SDK

async function getConfig(): Promise<IUqudoSdkConfig> {
  const token = await getToken();
  return {
    accessToken: token,
  };
}

// Define the type for the function parameters
type OnboardingParams = {
  navigate: NavigateFunction;
  setCurrentStep: Dispatch<SetStateAction<TSteps>>;
  step: number;
  document: number;
  setDocumentData: React.Dispatch<React.SetStateAction<TDocumentData>>;
  i18n: i18n;
  setPhoto: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonalInfoStep: React.Dispatch<React.SetStateAction<number>>;
  values: TConfig;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export async function onboardingJourney({
  setError,
  navigate,
  setCurrentStep,
  step,
  document: documentAuth,
  setPhoto,
  setDocumentData,
  i18n,
  setOpen,
  setPersonalInfoStep,
  setLoading,
  values,
}: OnboardingParams) {
  const {
    idPhotoTamperingDetection,
    idPrintDetection,
    idScreenDetection,
    minimumAge,
    disableExpiryValidation,
  } = values;
  try {
    const { default: uqudoSdkFactory, DocumentType } = await import(
      "uqudosdk-preview-web"
    );
    // Get the SDK configuration
    const config = await getConfig();
    const uqudoSdk = uqudoSdkFactory.create(config);

    // Determine document type
    const docType =
      documentAuth === 3 ? DocumentType.PASSPORT : DocumentType.SDN_ID;
    setLoading(false);
    // Start the enrollment process
    await uqudoSdk.enrollment({
      assets: {
        logo: "",
      },
      texts: i18n.language === "en" ? uqudoObjectEnglish : uqudoObjectArabic,
      returnDataForIncompleteSession: true,
      scan: {
        documentType: docType,
        disableExpiryValidation: disableExpiryValidation,
        enableAgeVerification: minimumAge,
      },
      face: {
        enableFacialRecognition: true,
        maxAttempts: 3,
      },
      onSuccess: (result: ReturnEnrollmentType) => {
        const { data } = parseJwt(result);
        if (data.documents.length > 0) {
          if (
            data.verifications[0].idScreenDetection.score >= idScreenDetection
          ) {
            setError(
              i18n.language === "en"
                ? `Looks like your ${documentAuth === 3 ? "Passport" : "National ID"
                } was scanned from a screen Kindly try again and scan a real document`
                : `يبدو انك قمت بمسح نسخة من ${documentAuth === 3 ? "جواز سفرك" : "بطاقة هويتك"
                } من شاشة او جهاز , الرجاء المحاولة مرة اخرى وذلك بمسح المستند الاصلي`
            );
            setOpen(true);
            navigate("/scan");
          } else if (
            data.verifications[0].idPrintDetection.score >= idPrintDetection
          ) {
            setError(
              i18n.language === "en"
                ? `Looks like your ${documentAuth === 3 ? "Passport" : "National ID"
                } was scanned from a copy of your document Kindly try again and scan a real document`
                : `يبدو انك قمت بمسح نسخة من ${documentAuth === 3 ? "جواز سفرك" : "بطاقة هويتك"
                } من نسخة مطبوعة , الرجاء المحاولة مرة اخرى وذلك بمسح المستند الاصلي`
            );
            setOpen(true);
            navigate("/scan");
          } else if (
            data.verifications[0].idPhotoTamperingDetection.score >=
            idPhotoTamperingDetection
          ) {
            setError(
              i18n.language === "en"
                ? `Looks like your ${documentAuth === 3 ? "Passport" : "National ID"
                } was scanned from a document with a photo that was tampered or manipulated, Kindly try again and scan a real document`
                : `يبدو انك قمت بمسح نسخة من ${documentAuth === 3 ? "جواز سفرك" : "بطاقة هويتك"
                } من نسخة تم التلاعب بها وتعديل الصورة الشخصية , الرجاء المحاولة مرة اخرى وذلك بمسح المستند الاصلي`
            );
            setOpen(true);
            setLoading(false);
            navigate("/scan");
          } else {
            const scanData = data.documents[0].scan;
            const photoImg = data.documents[0].scan.faceImageId;
            setPhoto(photoImg);
            setDocumentData({
              fullName:
                documentAuth === 3
                  ? scanData.front.fullName
                  : scanData.back.fullName,
              fullNameArabic:
                documentAuth === 3
                  ? scanData.front.fullNameArabic
                  : scanData.front.name,
              ...scanData.front,
              ...scanData.back,
              frontImageId: scanData.frontImageId,
              backImageId: scanData.backImageId,
              sessionScanConfiguration: scanData.sessionScanConfiguration,
              reading: data.documents[0].reading,
              face: data.documents[0].face,
              lookup: data.documents[0].lookup,
            });
            setOpen(false);
            setError("");
            setLoading(false);
            setCurrentStep({ step: 7, title: "/scan", completed: true });
            handleNext(setCurrentStep, step + 1, steps, navigate);
            setPersonalInfoStep(0);
          }
        } else {
          setError(
            i18n.language === "en"
              ? "unexpected error try again"
              : "حدث خطأ غير متوقع اعد المحاولة"
          );
          setOpen(true);
          navigate("/scan");
        }
      },
      onError: (error: OperationError) => {
        console.info("Error: ", error);
        setOpen(true);
        if (error.data) {
          const parsedError = parseJwt(error.data);
          setDocumentData(parsedError);
          setError(
            i18n.language === "en"
              ? "unexpected error try again"
              : "حدث خطأ غير متوقع اعد المحاولة"
          );
          navigate("/scan");
        } else {
          setError(
            i18n.language === "en"
              ? "unexpected error try again"
              : "حدث خطأ غير متوقع اعد المحاولة"
          );
          setOpen(true);
          navigate("/scan");
        }
      },
      onFinally: () => {
        console.log("Enrollment process completed.");
        setLoading(false);
        setOpen(false);
        setError("");
      },
    });
  } catch (error) {
    setError(
      i18n.language === "en"
        ? "unexpected error try again"
        : "حدث خطأ غير متوقع اعد المحاولة"
    );
    setOpen(true);
    throw error;
  }
}
