import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const usePreventBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the default action of the back button
      event.preventDefault();
      // Navigate to the current path to prevent back navigation
      navigate(location.pathname, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, location.pathname]);
};

export default usePreventBackNavigation;
