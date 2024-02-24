import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CateringProduct from "./CateringProduct";
import SearchBar from "./SearchBar";
import Fade from "react-reveal/Fade";
import { useState } from "react";
import Rotate from "react-reveal/Rotate";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import CateringSpecial from "./CateringSpecial";
import Marquee from "react-fast-marquee";

function CateringPage() {
  const theme = useTheme();
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box>
        <Box>
          <Fade top>
            <Typography
              variant="h4"
              sx={{
                color: "#57ccb5",
                textAlign: "center",
                padding: "10px",
                fontWeight: 600,
              }}
            >
              Catering Menu
            </Typography>
          </Fade>

          <Box>
            <Marquee>
              <Typography
                variant="h5"
                color="secondary"
                sx={{ fontSize: "25px", fontWeight: "bold" }}
              >
                For catering inquiries, please fill out the form below.
              </Typography>
            </Marquee>
          </Box>
        </Box>
      </Box>

      <CateringSpecial></CateringSpecial>

      <Container sx={{ mt: 2 }}>
        <SearchBar
          onSelectMenu={(menuId: string) => {
            setSelectedMenuId(menuId);
          }}
          onSelectProduct={(productId: string) =>
            setSelectedProductId(productId)
          }
        />
      </Container>
      <CateringProduct
        selectedMenuId={selectedMenuId}
        selectedProductId={selectedProductId}
      />
    </>
  );
}

export default CateringPage;
