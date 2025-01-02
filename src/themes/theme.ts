import { createTheme } from "@mui/material";
import i18n from "../components/i18n";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // Allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}

// Update Material-UI components to use the new variant
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

// Define breakpoints separately
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Create theme with breakpoints and typography
export const theme = createTheme({
  breakpoints,
  direction: i18n.language === "en" ? "ltr" : "rtl",
  palette: {
    primary: {
      main: "#000096",
    },
    secondary: {
      main: "#666666",
    },
  },
  typography: {
    h1: {
      fontWeight: "900",
      textAlign: "center",
      margin: "2.2rem 0",
      color: "primary",
      fontFamily: i18n.language === "en" ? "Exo Bold" : "TheSansArabic-Bold",
      fontSize: "1.5rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "2.5rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "3rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "3.5rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "4rem",
      },
    },
    h2: {
      fontWeight: "900",
      textAlign: "center",
      color: "primary",
      margin: "2.2rem 0",
      fontFamily:
        i18n.language === "en" ? "Exo SemiBold" : "TheSansArabic-Bold",
      fontSize: "0.875rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.5rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.75rem",
      },
    },
    h5: {
      fontWeight: "900",
      textAlign: "center",
      margin: "40px 0",
      color: "primary",
      fontFamily: i18n.language === "en" ? "Exo Bold" : "TheSansArabic-Bold",
      fontSize: "1rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.5rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.75rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "2rem",
      },
    },
    h6: {
      fontWeight: "900",
      textAlign: "center",
      color: "primary",
      margin: "2.2rem 0",
      fontFamily:
        i18n.language === "en" ? "Exo SemiBold" : "TheSansArabic-Bold",
      fontSize: "0.875rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.5rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.75rem",
      },
    },
    body1: {
      fontFamily: i18n.language === "en" ? "Exo light" : "TheSansArabic-Bold",
      fontWeight: "Bold",
      marginBottom: "10px",
      fontSize: "1rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1.125rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.375rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.5rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.125rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.375rem",
      },
    },
    body3: {
      fontFamily: i18n.language === "en" ? "Exo light" : "TheSansArabic-Bold",
      fontWeight: "Bold",
      marginBottom: "10px",
      fontSize: "1rem",
      color: "primary",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1.125rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.375rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.5rem",
      },

    },
    caption: {
      fontSize: "0.75rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "0.875rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.125rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.25rem",
      },
    },
    button: {
      fontSize: "0.875rem",
      [`@media (min-width:${breakpoints.values.sm}px)`]: {
        fontSize: "1rem",
      },
      [`@media (min-width:${breakpoints.values.md}px)`]: {
        fontSize: "1.125rem",
      },
      [`@media (min-width:${breakpoints.values.lg}px)`]: {
        fontSize: "1.25rem",
      },
      [`@media (min-width:${breakpoints.values.xl}px)`]: {
        fontSize: "1.375rem",
      },
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          padding: "0.25rem 0.5rem",
          borderRadius: "5px",
          fontFamily:
            i18n.language === "en" ? "Exo Bold" : "TheSansArabic-Bold",
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        inputProps: {
          style: {
            fontSize: "12px",
          },
        },
      },
      styleOverrides: {
        root: {
          outline: 0,
          fontWeight: "normal",
          color: "#7d7d7d",
          padding: "2px",
          fontSize: "12px",
          border: "1px solid #7d7d7d",
          borderRadius: "6px",
          height: "41px",
          marginBottom: 0,
          "& .MuiInput-underline:before": {
            border: "none",
          },
          "&:hover .MuiInput-underline:before": {
            border: "none",
          },
          "& .MuiInput-underline:after": {
            border: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: "none",
          textTransform: "capitalize",
        },
      },
    },
  },
});
