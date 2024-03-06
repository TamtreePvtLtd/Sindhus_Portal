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
import CommonSnacksCard from "../../common/component/CommonSnacksCard";
import PageBanner from "../../common/component/pageBanner";

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
      <Box>
        <PageBanner
          imageUrl="assets/images/snacks-banner-image.jpg"
          content="Snacks"
          description="Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!"
        />
      </Box>
      {/* <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "#57ccb5",
          padding: "20px",
          fontWeight: 600,
        }}
      >
        Snacks
      </Typography> */}

      <Container
        sx={{
          marginTop: "20px",
          my: 5,
          p: 2,
        }}
      >
        <SnacksMenuItem
          onSubMenuClick={handleSubMenuClick}
          snacksSubMenus={snacksPageData?.subMenus ?? []}
          selectedSubMenuId={selectedSubMenuId}
        ></SnacksMenuItem>
        <Box sx={{ mt: 5 }}>
          {snacksPageData &&
          snacksPageData.products &&
          snacksPageData.products.length > 0 ? (
            <Grid container spacing={5}>
              {snacksPageData.products.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  lg={2.4}
                  // sx={{ display: "flex", justifyContent: "center" }}
                  key={product._id}
                >
                  <CommonSnacksCard product={product} />
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
