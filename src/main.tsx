import React from "react";
import "./index.css";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "./components/i18n";
import RtlProvider from "./components/RtlProvider";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./themes/theme";
import { AuthProvider } from "./contexts/AuthProvider";
import { NavigationProvider } from "./contexts/NavigationProvider";
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavigationProvider>
          <I18nextProvider i18n={i18n}>
            <RtlProvider>
              <App />
            </RtlProvider>
          </I18nextProvider>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
