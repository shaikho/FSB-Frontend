import { IUqudoSdkConfig } from "uqudosdk-web";
import { getToken } from "../axios";
import { NavigateFunction } from "react-router-dom";
import { i18n } from "i18next";
import { TDocumentData, } from "../types/types";

async function getConfig(): Promise<IUqudoSdkConfig> {
    const token = await getToken();
    return {
        accessToken: token,
    };
}

export async function LivenessCheckJourney({
    setError,
    navigate,
    i18n,
    setLoading,
    setOpen,
    sessionId,
    setShowNationalNumberForm,
    setLivenessCheck,
    isNationalIDCheck,
    documentData
}: {
    setError: React.Dispatch<React.SetStateAction<string>>;
    navigate: NavigateFunction;
    i18n: i18n;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sessionId: string;
    setShowNationalNumberForm: React.Dispatch<React.SetStateAction<boolean>>;
    setLivenessCheck: React.Dispatch<React.SetStateAction<boolean>>;
    isNationalIDCheck: boolean;
    documentData: TDocumentData
}): Promise<boolean> {

    try {
        const { default: uqudoSdkFactory } = await import("uqudosdk-web");
        const config = await getConfig();
        const uqudoSdk = uqudoSdkFactory.create(config);

        return await new Promise<boolean>((resolve) => {
            uqudoSdk.faceSession({
                sessionId: sessionId,
                maxAttempts: 3,
                onSuccess: async () => {
                    if (isNationalIDCheck) {
                        setShowNationalNumberForm(true);
                        navigate("/nationalNumberInfo");
                        setLivenessCheck(true);
                    } else {
                        // const nationalIDNumber = documentData.identityNumber.replace(/-/g, "");
                        // await updateIsVerified(nationalIDNumber, true);
                    }
                    resolve(true);
                },
                onError: (error) => {
                    console.log(error);
                    resolve(false);
                },
            });
        });
    } catch (error) {
        setLoading(false);
        setError(
            i18n.language === "en"
                ? "An unexpected error occurred. Please try again."
                : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
        );
        setOpen(true);
        console.error(error);
        return false;
    }
}
