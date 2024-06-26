import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            bottom: "5px",
            right: "3px",
            height: "40px",
            width: "40px",
            cursor: "pointer",
            backgroundColor: "#038265",
            zIndex: 99,
            borderRadius: "50%",
          }}
        />
      )}
    </Box>
  );
};

export default ScrollToTop;
