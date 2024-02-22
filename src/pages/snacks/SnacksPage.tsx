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
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "#57ccb5",padding:"10px",
          fontWeight: 600,
        }}
      >
        Snacks
      </Typography>

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
            <Grid container spacing={2}>
              {snacksPageData.products.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  lg={2.4}
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
