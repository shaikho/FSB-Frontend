import { AppBar, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ini from "ini";
import { useEffect, useState } from "react";

export default function AppbarUI() {
  const [values, setValues] = useState({
    logo: "",
    logoAr: "",
  });
  const { i18n } = useTranslation();
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config.ini");
        const text = await response.text();
        const parsedConfig = ini.parse(text);
        setValues({
          logo: parsedConfig.logo,
          logoAr: parsedConfig.logoAr,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchConfig();
  }, []);
  return (
    <AppBar
      aria-label="App Bar"
      position="relative"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #000051 0%, #1a1a7e 25%, #000082 50%, #2d2db8 75%, #0000a0 100%)",
      }}
    >
      <Toolbar
        aria-label="Nav Bar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          direction: i18n.language === "ar" ? "ltr" : "rtl",
        }}
      >
        <LanguageSwitcher />
        <img
          src={i18n.language === "ar" ? values.logoAr : values.logo}
          width={90}
          height={80}
          alt="Pearl logo"
          style={{ color: "#fff", marginLeft: 50, marginBottom: 3 }}
        />
        <span></span>
      </Toolbar>
    </AppBar>
  );
}
