import { IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FlagIcon } from "react-flag-kit";
import { Language } from "@mui/icons-material";
import { useState } from "react";

function LanguageSwitcher() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const { i18n } = useTranslation();
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = value;
    i18n.changeLanguage(selectedLanguage);
    setMenuAnchor(null);
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleMenuOpen}
          sx={{ color: "#fff" }}
          title="language button"
        >
          <Language />
        </IconButton>
        <span>{i18n.language === "en" ? "English" : "العربية"}</span>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleLanguageChange("en")}>
          <FlagIcon code="US" style={{ paddingInlineEnd: 10 }} />
          <Typography variant="body2" color="black">
            English
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("ar")}>
          <FlagIcon code="SA" style={{ paddingInlineEnd: 10 }} />
          <Typography variant="body2" color="black">
            العربية
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default LanguageSwitcher;
