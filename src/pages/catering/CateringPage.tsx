import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CateringProduct from "./CateringProduct";
import SearchBar from "./SearchBar";
import Fade from "react-reveal/Fade";
import { useState } from "react";

import CateringSpecial from "./CateringSpecial";

import { Button } from "@mui/material";
import { RefObject, useRef } from "react";
import Menus from "./CateringNavmenu";
import { useHref } from "react-router-dom";
import CateringEnquiryForm from "../../common/component/CateringEnquiryForm";

function CateringPage() {
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const footerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);

  const handleEnquiryButtonOpenClick = () => {
    setIsEnquiryFormOpen(true);

    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleEnquiryButtonCloseClick = () => {
    setIsEnquiryFormOpen(false);
  };
  const handleMenuSelection = (menuId: string) => {
    setSelectedMenuId(menuId);
  };

  const handleNavMenuTitleClick = (menuId: string) => {
    setSelectedMenuId(menuId);
  };

  return (
    <>
      <Box>
        <Box>
          <Fade top>
            <Typography
              variant="h4"
              sx={{
                color: "#038265",
                textAlign: "center",
                padding: "10px",
                fontWeight: 600,
              }}
            ></Typography>
          </Fade>
          <Button
            variant="contained"
            onClick={handleEnquiryButtonOpenClick}
            sx={{
              position: "fixed",
              top: 160,
              right: 0,
              margin: "-55px",
              height: "40px",
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
              transform: "rotate(90deg) translate(50%, 50%)",
            }}
          >
            Enquire Now
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <CateringSpecial></CateringSpecial>
      </Box>
      <Container sx={{ mt: 2 }}>
        <SearchBar
          onSelectMenu={(menuId: string) => setSelectedMenuId(menuId)}
          onSelectProduct={(productId: string) =>
            setSelectedProductId(productId)
          }
          selectedMenuId={selectedMenuId}
        />
      </Container>
      <Menus
        onSelectMenu={handleMenuSelection}
        onNavMenuTitleClick={handleNavMenuTitleClick}
        selectedMenuId={selectedMenuId}
      />
      <CateringProduct
        selectedMenuId={selectedMenuId}
        selectedProductId={selectedProductId}
      />
      {isEnquiryFormOpen && (
        <CateringEnquiryForm
          onClose={handleEnquiryButtonCloseClick}
          isOpen={isEnquiryFormOpen}
        />
      )}{" "}
    </>
  );
}

export default CateringPage;
