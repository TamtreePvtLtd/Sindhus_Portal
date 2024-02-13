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

function CateringPage() {
  const theme = useTheme();
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ position: "relative", height: "200px" }}>
        <Box
          sx={{
            mt: 3,
          }}
        >
          <div
            style={{
              backgroundImage: "url('assets/images/sssurf7.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(180deg)",
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: -1,
              top: 0,
            }}
          ></div>

          <Grid container spacing={3} sx={{ overflow: "hidden" }}>
            {!isBelowMediumScreen && (
              <Grid
                item
                xs={3}
                sx={{
                  position: "relative",
                  display: "block",
                }}
              >
                <Rotate top left>
                  <img
                    src="/assets/images/wave-vegetables.png"
                    alt="sweets"
                    height={"140px"}
                    style={{
                      borderRadius: "50px",
                      position: "absolute",
                      left: "-35px",
                      top: 5,
                    }}
                  />
                </Rotate>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              lg={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "150px",
              }}
            >
              <Fade top>
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Catering Menu
                </Typography>
              </Fade>
            </Grid>
            {!isBelowMediumScreen && (
              <Grid
                item
                xs={3}
                sx={{
                  position: "relative",
                  display: "block",
                }}
              >
                <Rotate top right>
                  <img
                    src="/assets/images/wave-spices.png"
                    alt="savouries"
                    height={"150px"}
                    style={{
                      borderRadius: "50px",
                      position: "absolute",
                      right: "-60px",
                      top: 4,
                    }}
                  />
                </Rotate>
              </Grid>
            )}
          </Grid>
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
