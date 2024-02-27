import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
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
          sx={{ color: "white",my: 40 }}
          onClick={goToTop}
          style={{
            position: "fixed",
            top: "20px",
            right: "30px",
            height: "35px",
            width: "35px",
            cursor: "pointer",
            backgroundColor: " #57ccb5",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
            zIndex: "1",
            borderRadius: "50%",
          }}
        />
      )}
    </Box>
  );
};

export default ScrollToTop;
