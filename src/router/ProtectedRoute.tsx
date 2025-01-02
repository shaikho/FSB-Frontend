import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentStep } = useNavigation();

  useLayoutEffect(() => {
    if (currentStep.completed === false) {
      navigate(currentStep.title, { replace: true });
    }
  }, [navigate, currentStep]);

  return <>{children}</>;
};

export default ProtectedRoute;
