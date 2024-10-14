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
      <Grid
        style={{
          width: "100%",
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
