import SnacksMenuItem from "./SnacksMenuItem";
import { useGetSnacksProductsBySubMenuId } from "../../customRQHooks/Hooks";
import { useState, useEffect } from "react";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonSnacksCard from "../../common/component/CommonSnacksCard";
import { useMediaQuery, useTheme } from "@mui/material";

function SnacksPage() {
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<string>("");

  const { data: snacksPageData, refetch: refetchSnacks } =
    useGetSnacksProductsBySubMenuId(selectedSubMenuId);

  useEffect(() => {
    refetchSnacks();
  }, [selectedSubMenuId]);

  const handleSubMenuClick = (subMenuId: string) => {
    setSelectedSubMenuId(subMenuId);
  };
 const theme = useTheme();
 const isSmallScreen = useMediaQuery("(max-width:600px)");
 const isMediumScreen = useMediaQuery(
   "(min-width:601px) and (max-width:1500px)"
 );
 const isLargeScreen = useMediaQuery("(min-width:961px)");

 const getHeight = () => {
   if (isSmallScreen) return "250px";
   if (isMediumScreen) return "410px";
   if (isLargeScreen) return "125vh";
  };
   const getWidth = () => {
     if (isSmallScreen) return "100%";
     if (isMediumScreen) return "100%";
     if (isLargeScreen) return "100vw";
  };
  // const getWidth = () => {
  //   return "100vw"; // Full viewport width for all screen sizes
  // };
    const getBackgroundSize = () => {
      if (isSmallScreen || isMediumScreen) return "contain";
      return "cover";
    };
  return (
    <>
      {/* <Box
        sx={{
          backgroundImage: `url("public/assets/snacks-banner-2.jpg")`,
          backgroundSize: getBackgroundSize(),
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: getWidth(),
          height: getHeight(),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // margin: "0 auto",
          zIndex: 99,
        }}
      >
      </Box> */}
      <Grid
        style={{
          width: "100%",
          // height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="public/assets/snacks-banner-2.jpg"
          alt="Snacks Banner"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Grid>

      <Container
        sx={{
          marginTop: "none",
          p: 2,
        }}
      >
        <SnacksMenuItem
          onSubMenuClick={handleSubMenuClick}
          snacksSubMenus={snacksPageData?.subMenus ?? []}
          selectedSubMenuId={selectedSubMenuId}
        ></SnacksMenuItem>
        <Box sx={{ mt: 3 }}>
          {snacksPageData &&
          snacksPageData.products &&
          snacksPageData.products.length > 0 ? (
            <Grid container spacing={5}>
              {snacksPageData.products.map((product) => (
                <Grid item xs={12} sm={4} md={3} lg={2.4} key={product._id}>
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
