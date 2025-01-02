import { useEffect } from "react";
import RouterWrapper from "./router/RouterWrapper";
import AppbarUI from "./ui/AppbarUI";
import { useTranslation } from "react-i18next";
import i18n from "./components/i18n";
import { isMobile } from "react-device-detect";
import { Box, Typography } from "@mui/material";

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("siteTitle");
    document.dir = i18n.language === "en" ? "ltr" : "rtl";
  }, [t]);

  if (isMobile) {
    return (
      <>
        <AppbarUI />
        <RouterWrapper />
      </>
    );
  } else {
    return (
      <Box
        component="div"
        sx={{ display: "grid", placeItems: "center", minHeight: "100svh" }}
      >
        <Typography variant="h3" sx={{ color: "#fff" }}>
          {t("browserError")}
        </Typography>
      </Box>
    );
  }

  // return (
  //   <>
  //     <AppbarUI />
  //     <RouterWrapper />
  //   </>
  // );
}

export default App;
