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

function CateringPage() {
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const footerRef: RefObject<HTMLDivElement | null> = useRef(null);

  const handleEnquiryButtonClick = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMenuSelection = (menuId:string) => {
    setSelectedMenuId(menuId);
  };

  const handleNavMenuTitleClick = (menuId:string) => {
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
            >
              Catering Menu
            </Typography>
          </Fade>

          <Box sx={{ textAlign: "center", fontWeight: "400", py: 2 }}>
            <Button variant="contained" onClick={handleEnquiryButtonClick}>
              Enquiry Now
            </Button>
          </Box>
        </Box>
      </Box>

      <CateringSpecial></CateringSpecial>

      <Container sx={{ mt: 2 }}>
        <SearchBar
          onSelectMenu={(menuId: string) => setSelectedMenuId(menuId)}
          onSelectProduct={(productId: string) =>
            setSelectedProductId(productId)
          }
          selectedMenuId={selectedMenuId} // Pass selectedMenuId here
        />  
      </Container>
      
      <Menus 
        onSelectMenu={handleMenuSelection}
        onNavMenuTitleClick={handleNavMenuTitleClick}
        selectedMenuId={selectedMenuId} // Pass selectedMenuId here
      />
      
      <CateringProduct
        selectedMenuId={selectedMenuId}
        selectedProductId={selectedProductId}
      />
      
      <Box ref={footerRef}></Box>
    </>
  );
}

export default CateringPage;
