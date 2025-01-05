import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../ui/Spinner";
import DisplayPersonalInfo from "../components/DisplayPersonalInfo";
const OnboardingScreen = lazy(() => import("../components/OnboardingScreen"));
const EmailVerification = lazy(() => import("../components/EmailVerification"));
const ErrorPage = lazy(() => import("../components/ErrorPage"));
const OTP = lazy(() => import("../components/OTP"));
const Currency = lazy(() => import("../components/Currency"));
const Residency = lazy(() => import("../components/Residency"));
const Identity = lazy(() => import("../components/Identity"));
const IdentityVerification = lazy(() => import("../ui/IdentityVerification"));
const PersonalInfo = lazy(() => import("../components/PersonalInfo"));
const Signeture = lazy(() => import("../components/Signeture"));
const Done = lazy(() => import("../components/Done"));
const Scan = lazy(() => import("../components/Scan"));

export default function RouterWrapper() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<OnboardingScreen />} />
          <Route
            path="/terms"
            element={
           //   <ProtectedRoute>
                <OnboardingScreen />
           //   </ProtectedRoute>
            }
          />
          <Route
            path="/personal-info"
            element={
             // <ProtectedRoute>
                <PersonalInfo />
           //   </ProtectedRoute>
            }
          />
          <Route
            path="/email-verifcation"
            element={
            //  <ProtectedRoute>
                <EmailVerification />
            //  </ProtectedRoute>
            }
          />
          <Route
            path="/residency"
            element={
             // <ProtectedRoute>
                <Residency />
            //  </ProtectedRoute>
            }
          />
          <Route
            path="/otp"
            element={
             // <ProtectedRoute>
                <OTP />
            //  </ProtectedRoute>
            }
          />
          <Route
            path="/currency"
            element={
             // <ProtectedRoute>
                <Currency />
             // </ProtectedRoute>
            }
          />
          <Route
            path="/identity"
            element={
             // <ProtectedRoute>
                <Identity />
             // </ProtectedRoute>
            }
          />
          <Route
            path="/identity-verification"
            element={
              //<ProtectedRoute>
                <IdentityVerification />
             // </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              //<ProtectedRoute>
                <Scan />
              //</ProtectedRoute>
            }
          />
          <Route
            path="/display-personal-info"
            element={
              //<ProtectedRoute>
                <DisplayPersonalInfo />
              //</ProtectedRoute>
            }
          />
          <Route
            path="/signeture"
            element={
              //<ProtectedRoute>
                <Signeture />
              //</ProtectedRoute>
            }
          />
          <Route
            path="/done"
            element={
              //<ProtectedRoute>
                <Done />
              //</ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
