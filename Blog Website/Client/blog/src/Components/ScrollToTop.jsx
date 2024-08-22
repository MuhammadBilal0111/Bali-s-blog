import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
function ScrollToTop() {
  const location = useLocation().pathname;
  useEffect(() => {
    window.scroll(0, 0);
  }, [location]);

  return null;
}

export default ScrollToTop;
