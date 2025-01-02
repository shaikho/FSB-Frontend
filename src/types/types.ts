import { FlagIconCode } from "react-flag-kit";

export type TCurrencies = {
  id: number;
  title: string;
};

export type TConfig = {
  idPhotoTamperingDetection: number;
  idPrintDetection: number;
  idScreenDetection: number;
  minimumAge: number;
  disableExpiryValidation: boolean;
};

export type TCountry = {
  id: number;
  title: string;
  code: FlagIconCode;
};
export type TSteps = {
  step: number;
  title: string;
  completed: boolean;
};

export type TIdentityType = {
  id: number;
  title: string;
};

export type TDocumentData = {
  fullName: string;
  fullNameArabic: string;
  placeOfBirth: string;
  issueDateFormatted: Date;
  dateOfBirthFormatted: Date;
  dateOfExpiryFormatted: Date;
  documentNumber: string;
  identityNumber: string;
  sex: string;
  nationality: string;
  placeOfIssue: string;
  address?: string;
  nationalIDNumber?: string;
};

export type TSubmittedData = {
  fullNameEnglish: string;
  fullNameArabic: string;
  dateofBirth: string;
  placeofBirth: string;
  gender: string;
  IDNumber: string;
  nationalIDNumber: string;
  placeofIssue: string;
  dateofIssue: string;
  dateofexpiry: string;
  AcountryCode: string;
  AphoneNumber: string;
  address: string;
  occupation: string;
  employer: string;
  averageIncome: string;
  PresidentFamilyMember: boolean | undefined;
  MinisterPolitician: boolean | undefined;
  MemberofParliament: boolean | undefined;
  MilitaryHighRank: boolean | undefined;
  SeniorOfficial: boolean | undefined;
  ForeignDiplomatic: boolean | undefined;
  SubjecttoUSAtaxpayer: boolean | undefined;
  MotherName: string;
  identityNumber: string;
};
