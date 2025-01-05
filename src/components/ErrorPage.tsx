import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #000051, #000082 )",
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        lineHeight: "1.5em",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          fontSize: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#000",
          direction: "rtl",
        }}
      >
        <img
          src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
          alt="404"
          style={{ margin: "85px auto 20px", height: "342px" }}
        />
        <Typography variant="h1">404 PAGE</Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "19px", margin: "30px 0 15px 0" }}
        >
          {t("errorPageContent")}
        </Typography>
        <Button component={Link} to="/">
          {t("Home")}
        </Button>
      </Box>
    </Box>
  );
}
