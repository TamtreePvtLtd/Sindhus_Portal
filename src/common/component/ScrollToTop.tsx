import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      {showTopBtn && (
        <KeyboardArrowUpIcon
          sx={{ color: "white" }}
          onClick={goToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "100px",
            height: "30px",
            width: "30px",
            cursor: "pointer",
            backgroundColor: "#038265",
            // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            zIndex: "1",
            borderRadius: "50%",
          }}
        />
      )}
    </Box>
  );
};

export default ScrollToTop;
