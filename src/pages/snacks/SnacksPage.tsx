import SnacksMenuItem from "./SnacksMenuItem";
import { useGetSnacksProductsBySubMenuId } from "../../customRQHooks/Hooks";
import { useState, useEffect } from "react";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonSnacksCard from "../../common/component/CommonSnacksCard";

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

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url("public/assets/snacks-banner-2.jpg")`,
          backgroundSize: {
            xs: "contain", 
            sm: "contain", 
            md: "cover", 
          },

          backgroundRepeat: "no-repeat",
          backgroundPosition: "none",
          width: {
            xs: "100%", // full width for mobile
            sm: "100%", // full width for tablets
            md: "100%", // 80% width for medium screens
            lg: "100%", // full width for larger screens
          },
          height: {
            xs: "250px", // adjust height for mobile (50% of viewport height)
            sm: "410px", // adjust height for tablets
            md: "125vh", // adjust height for medium screens
            lg: "125vh", // height for larger screens
          },
          // display: "flex", // if you want to align content inside the banner
          // justifyContent: "center",
          // alignItems: "center",
          margin: "0 auto", // center the box when not full width
          zIndex: 99,
        }}
      />

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
