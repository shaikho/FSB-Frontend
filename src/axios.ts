import axios from "axios";
import { TDocumentData } from "./types/types";
import ini from "ini";

const fetchConfig = async () => {
  try {
    const response = await fetch("/config.ini");
    const text = await response.text();
    const parsedConfig = ini.parse(text);
    const BASE_URL = parsedConfig.baseUrl;
    return BASE_URL;
  } catch (error) {
    console.log(error);
  }
};
const getBaseUrl = async () => {
  const baseUrl = await fetchConfig();
  return baseUrl;
};

export const getToken = async (): Promise<string> => {
  const BASE_URL = await getBaseUrl();
  const url = `${BASE_URL}/getToken`;
  try {
    const response = await axios.get(url, {});
    const token: string = response.data.access_token;
    if (!token) {
      throw new Error("Token not found in response");
    }
    return token;
  } catch (err) {
    console.error("Error fetching token:", err);
    throw err;
  }
};

interface SendOTPResponse {
  responseCode: number;
  reqId?: string;
  responseMessage: string;
}

interface SendOTPResponseA {
  result: {
    responseCode: number;
    reqId?: string;
    responseMessage: string;
  };
}
interface VerifyOTPResponse {
  result: {
    reqId?: string;
    status?: string;
    responseCode: number;
    responseMessage: string;
  };
}
interface VerifyOTPResponseA {
  reqId?: string;
  status?: string;
  responseCode: number;
  responseMessage: string;
}

interface OpenCIF {
  result: {
    cif?: number;
    account?: number;
    responseCode: number;
    responseMessage: string;
    status?: string;
  };
  id?: number;
  exception?: string;
  isCanceled?: boolean;
  isCompleted?: boolean;
  isCompletedSuccessfully?: boolean;
  creationOptions?: number;
  asyncState?: string;
  isFaulted?: boolean;
}

export const sendOTP = async (
  email: string | undefined,
  mobileNumber: string,
  datetime: Date,
  language: string
): Promise<SendOTPResponse> => {
  const BASE_URL = await getBaseUrl();
  const url = `${BASE_URL}/SendOtp`;
  try {
    const response = await axios.post(
      url,
      { email, mobileNumber }
    );
    const sendOTPResponse: SendOTPResponse = {
      responseCode: response.data.responseCode,
      reqId: response.data.reqId,
      responseMessage: response.data.responseMessage,
    };
    return sendOTPResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { responseCode: -1, responseMessage: error.message, reqId: "" };
    }
    return { responseCode: -1, responseMessage: "Error unexpected", reqId: "" };
  }
};

export const verifyOTP = async (
  email: string | undefined,
  mobileNumber: string,
  datetime: Date,
  ReqId: string | undefined,
  otp: string
): Promise<VerifyOTPResponseA> => {
  const BASE_URL = await getBaseUrl();
  const url = `${BASE_URL}/verifyOTP`;
  try {
    const response = await axios.post(
      url,
      { email, mobileNumber, otp }
    );
    const verifyOTPResponse: VerifyOTPResponseA = {
      responseCode: response.data.responseCode,
      responseMessage: response.data.responseMessage
    };
    return verifyOTPResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { responseCode: -1, responseMessage: error.message };
    }
    return {
      responseCode: -1,
      responseMessage: "An unexpected error occurred",
    };
  }
};

interface OpenCIF {
  cif?: string;
  account?: string;
  responseCode: number;
  responseMessage: string;
}
interface Tdata {
  documentData: TDocumentData;
  email: string;
  currency: number[];
  residency: number;
  mobileNumber: string;
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
  signature: string | ArrayBuffer | null;
  document: number;
  photo: string;
  language: string;
}

export const openCIF = async (
  data: any
): Promise<{ done: boolean; message: string }> => {
  const BASE_URL = await getBaseUrl();
  const url = `${BASE_URL}/openAccount`;
  try {
    const response = await axios.post(url, data, {});
    console.log(response);
    if (response.data.responseCode === 0) {
      return { done: true, message: response.data.responseMessage };
    } else return { done: false, message: response.data.responseMessage };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { done: false, message: error.message };
    }
    console.log(error);
    return { done: false, message: "حدث خطأ" };
  }
};