import SnacksMenuItem from "./SnacksMenuItem";
import { useGetSnacksProductsBySubMenuId } from "../../customRQHooks/Hooks";
import { useState, useEffect } from "react";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonSnacksCard from "../../common/component/CommonSnacksCard";
import PageBanner from "../../common/component/pageBanner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "@mui/material";

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

const sliderSettings = {
  dots: true,
  // infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows:false
};

const bannerImages = [
  {
    url: "assets/snacksPage-newBanner.jpg",
    content: "Snacks",
    description:
      "Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!",
  },
  {
    url: "assets/images/mysorepak.jpg",
    content: "Snacks",
    description:
      "Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!",
  },
  {
    url: "assets/images/mixure-banner.jpg",
    content: "Snacks",
    description:
      "Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!",
  },
  {
    url: "assets/images/laddu-banner.jpg",
    content: "Taste the Tradition",
    description: "Discover traditional snacks with a modern twist!",
  },
  {
    url: "assets/images/ribbonpakkaoda-banner.jpg",
    content: "Taste the Tradition",
    description: "Discover traditional snacks with a modern twist!",
  },
  // Add more images as needed
];


  return (
    <>
      {/* <Box>
        {" "}
        <PageBanner
          imageUrl="public/assets/snacksPage-newBanner.jpg"
          content="Snacks"
          description="Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!"
        />
      </Box> */}
      <Box>
        <Slider {...sliderSettings}>
          {bannerImages.map((banner, index) => (
            <Box key={index} position="relative">
              <img
                src={banner.url}
                alt={banner.content}
                style={{ width: "100%", height: "auto" }}
              />
              <Box
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                height="auto"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-end"
                color="white"
                textAlign="center"
                // bgcolor="rgba(0, 0, 0, 0.3)"
                fontFamily="Yeseva One"
                fontWeight="bold"
                // py={2}
              >
                {/* <Box >
                  <Typography variant="h3" gutterBottom>
                    {banner.content}
                  </Typography>
                  <Typography variant="h6">{banner.description}</Typography>
                </Box> */}
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      <Container
        sx={{
          marginTop: "10px",
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
