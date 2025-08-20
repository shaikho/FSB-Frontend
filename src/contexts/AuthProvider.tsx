import React, { createContext, useContext, ReactNode, useState } from "react";
import { TDocumentData, TSubmittedData } from "../types/types";
// Define the type for your context
interface AuthContextProps {
  agree: boolean;
  setAgree: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  document: number;
  setDocument: React.Dispatch<React.SetStateAction<number>>;
  residency: number;
  setResidency: React.Dispatch<React.SetStateAction<number>>;
  currency: number[];
  setCurrency: React.Dispatch<React.SetStateAction<number[]>>;
  identityType: string;
  setIdentityType: React.Dispatch<React.SetStateAction<string>>;
  documentData: TDocumentData;
  setDocumentData: React.Dispatch<React.SetStateAction<TDocumentData>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  countryCode: string | undefined;
  setCountryCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  mobileNumber: string;
  setSubmittedData: React.Dispatch<React.SetStateAction<TSubmittedData>>;
  submittedData: TSubmittedData;
  signeture: string | ArrayBuffer | null;
  setSigneture: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null>
  >;
  setReqId: React.Dispatch<React.SetStateAction<string | undefined>>;
  reqId: string | undefined;
  setPhoto: React.Dispatch<React.SetStateAction<string>>;
  photo: string;
  nationalIDNumber: string;
  setNationalIDNumber: React.Dispatch<React.SetStateAction<string>>;
  WorkedInGoverment: boolean | undefined;
  setWorkedInGoverment: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  UsCitizen: boolean | undefined;
  setUsCitizen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  UsResident: boolean | undefined;
  setUsResident: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  UsTaxPayer: boolean | undefined;
  setUsTaxPayer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  UsAccount: boolean | undefined;
  setUsAccount: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  documentPhotoId: string | undefined;
  setDocumentPhotoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  personalPhotoId: string | undefined;
  setPersonalPhotoId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with an initial value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define a custom hook for using the auth context in components
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create a provider component that will wrap your app
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [agree, setAgree] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [nationalIDNumber, setNationalIDNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
  const [residency, setResidency] = useState<number>(729);
  const [currency, setCurrency] = useState<number[]>([938]);
  const [identityType, setIdentityType] = useState<string>("passport");
  const [document, setDocument] = useState<number>(3);
  const [signeture, setSigneture] = useState<string | ArrayBuffer | null>(null);
  const [reqId, setReqId] = useState<string | undefined>("");
  const [WorkedInGoverment, setWorkedInGoverment] = useState<boolean | undefined>(undefined);
  const [UsCitizen, setUsCitizen] = useState<boolean | undefined>(undefined);
  const [UsResident, setUsResident] = useState<boolean | undefined>(undefined);
  const [UsTaxPayer, setUsTaxPayer] = useState<boolean | undefined>(undefined);
  const [UsAccount, setUsAccount] = useState<boolean | undefined>(undefined);
  const [documentData, setDocumentData] = useState<TDocumentData>({
    fullName: "",
    fullNameArabic: "",
    placeOfBirth: "",
    issueDateFormatted: new Date(),
    dateOfBirthFormatted: new Date(),
    dateOfExpiryFormatted: new Date(),
    documentNumber: "",
    identityNumber: "",
    sex: "",
    nationality: "",
    placeOfIssue: "",
    address: "",
    nationalIDNumber: "",
  });
  const [documentPhotoId, setDocumentPhotoId] = useState<string | undefined>(undefined);
  const [personalPhotoId, setPersonalPhotoId] = useState<string | undefined>(undefined);
  const code = countryCode?.substring(1, countryCode.length);
  let phone = phoneNumber === undefined ? "" : phoneNumber;
  phone = phone[0] === "0" ? phone?.substring(1, phone.length) : phone;
  const [photo, setPhoto] = useState<string>("");
  const mobileNumber = `${code ?? ""}${phone ?? ""}`;
  const [submittedData, setSubmittedData] = useState<TSubmittedData>({
    fullNameEnglish: "",
    fullNameArabic: "",
    dateofBirth: "",
    placeofBirth: "",
    gender: "",
    IDNumber: "",
    nationalIDNumber: "",
    placeofIssue: "",
    dateofIssue: "",
    dateofexpiry: "",
    AcountryCode: "+249",
    AphoneNumber: "",
    address: "",
    occupation: "",
    employer: "",
    averageIncome: "",
    PresidentFamilyMember: undefined,
    MinisterPolitician: undefined,
    MemberofParliament: undefined,
    MilitaryHighRank: undefined,
    SeniorOfficial: undefined,
    ForeignDiplomatic: undefined,
    SubjecttoUSAtaxpayer: undefined,
    MotherName: "",
    identityNumber: "",
    maritalStatus: "",
    partnerName: "",
    placeOfResidency: "",
    WorkedInGoverment: undefined,
    UsCitizen: undefined,
    UsResident: undefined,
    UsTaxPayer: undefined,
    UsAccount: undefined,
    branch: "",
  });

  const contextValue: AuthContextProps = {
    setPhoto,
    photo,
    agree,
    setAgree,
    email,
    setEmail,
    document,
    setDocument,
    residency,
    setResidency,
    currency,
    setCurrency,
    identityType,
    setIdentityType,
    documentData,
    setDocumentData,
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    mobileNumber,
    setSubmittedData,
    submittedData,
    signeture,
    setSigneture,
    reqId,
    setReqId,
    nationalIDNumber,
    setNationalIDNumber,
    WorkedInGoverment,
    setWorkedInGoverment,
    UsCitizen,
    setUsCitizen,
    UsResident,
    setUsResident,
    UsTaxPayer,
    setUsTaxPayer,
    UsAccount,
    setUsAccount,
    documentPhotoId,
    setDocumentPhotoId,
    personalPhotoId,
    setPersonalPhotoId,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
