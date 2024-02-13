import CommonProductCard from "../../common/component/CommonProductCard";
import SnacksMenuItem from "./SnacksMenuItem";
import { useGetSnacksProductsBySubMenuId } from "../../customRQHooks/Hooks";
import { useState, useEffect } from "react";
import Rotate from "react-reveal/Rotate";
import Fade from "react-reveal/Fade";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";

function SnacksPage() {
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<string>("");

  const theme = useTheme();
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { data: snacksPageData, refetch: refetchSnacks } =
    useGetSnacksProductsBySubMenuId(selectedSubMenuId);

  useEffect(() => {
    refetchSnacks();
  }, [selectedSubMenuId]);

  const handleSubMenuClick = (subMenuId: string) => {
    setSelectedSubMenuId(subMenuId);
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
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
                    src="/assets/images/wave-sweets.png"
                    alt="sweets"
                    height={"140px"}
                    style={{
                      borderRadius: "50px",
                      position: "absolute",
                      left: "-5px",
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
                  Snacks
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
                    src="/assets/images/wave-karam.png"
                    alt="savouries"
                    height={"150px"}
                    style={{
                      borderRadius: "50px",
                      position: "absolute",
                      right: "-25px",
                      top: 4,
                    }}
                  />
                </Rotate>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      <Container sx={{ mb: 2 }}>
      
          <SnacksMenuItem
            onSubMenuClick={handleSubMenuClick}
            snacksSubMenus={snacksPageData?.subMenus ?? []}
            selectedSubMenuId={selectedSubMenuId}
          ></SnacksMenuItem>
        <Box sx={{ mt: 5 }}>
          {snacksPageData &&
          snacksPageData.products &&
          snacksPageData.products.length > 0 ? (
            <Grid container spacing={3}>
              {snacksPageData.products.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                  key={product._id}
                >
                  <CommonProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoProductsAvailable />
          )}
        </Box>
      </Container>
    </>
  );
}

export default SnacksPage;
