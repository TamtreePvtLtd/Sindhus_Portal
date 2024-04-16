import React, { useState, useEffect } from "react";
import SnacksMenuItem from "./SnacksMenuItem";
import { useGetSnacksProductsBySubMenuId } from "../../customRQHooks/Hooks";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonSnacksCard from "../../common/component/CommonSnacksCard";
import PageBanner from "../../common/component/pageBanner";
import { getPageTitle } from "../../services/api";
import { httpWithoutCredentials } from "../../services/http";

interface BannerData {
  image: string;
  title: string;
  description: string;
}

function SnacksPage() {
  const [selectedSubMenuId, setSelectedSubMenuId] = useState("");

  const { data: snacksPageData, refetch: refetchSnacks } =
    useGetSnacksProductsBySubMenuId(selectedSubMenuId);

  useEffect(() => {
    refetchSnacks();
  }, [selectedSubMenuId, refetchSnacks]);

  const handleSubMenuClick = (subMenuId) => {
    setSelectedSubMenuId(subMenuId);
  };

  useEffect(() => {
    async function fetchBannerData() {
      const pagetitle = "4"; 
      const bannerData: BannerData = await getPageTitle(pagetitle);
      // Assuming bannerData structure matches the expected shape
      setBannerData(bannerData);
    }
    fetchBannerData();
  }, []); // Empty dependency array ensures it runs only once

  const [bannerData, setBannerData] = useState<BannerData | null>(null);

  return (
    <>
      <Box>
        {bannerData && (
          <PageBanner
            imageUrl={bannerData.image}
            content={bannerData.title}
            description={bannerData.description}
          />
        )}
      </Box>
      <Container sx={{ marginTop: "10px", p: 2 }}>
        <SnacksMenuItem
          onSubMenuClick={handleSubMenuClick}
          snacksSubMenus={snacksPageData?.subMenus ?? []}
          selectedSubMenuId={selectedSubMenuId}
        />
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
