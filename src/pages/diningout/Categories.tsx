import Box from "@mui/material/Box";
import { Container, Grid, Typography } from "@mui/material";
import { IBannerData, ICategory, ICategoryTitleDispay } from "../../interface/types";
import { useEffect, useState } from "react";
import PageBanner from "../../common/component/pageBanner";
import theme from "../../theme/theme";
import { getPageTitle } from "../../services/api";

interface IProps {
  onSubMenuClick(submenuId: string): void;
  categories: ICategory[];
  selectedSubMenuId?: string;
}

function Categories({ onSubMenuClick, categories, selectedSubMenuId }: IProps) {
  const [loadedCategories, setLoadedCategories] =
    useState<ICategory[]>(categories);

  useEffect(() => {
    setLoadedCategories(categories);
  }, [categories]);

  useEffect(() => {
    async function fetchBannerData() {
      const pagetitle = "3";
      const bannerData: IBannerData = await getPageTitle(pagetitle);
      // Assuming bannerData structure matches the expected shape
      setBannerData(bannerData);
    }
    fetchBannerData();
  }, []); // Empty dependency array ensures it runs only once

  const [bannerData, setBannerData] = useState<IBannerData | null>(null);

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

      {loadedCategories && loadedCategories.length > 0 && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          columnGap={4}
          spacing={2}
          marginTop="15px"
        >
          <Grid
            item
            xs={4}
            sm={4}
            md={4}
            lg={"auto"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            key={"all-category"}
          >
            <Typography
              sx={{
                fontWeight: selectedSubMenuId === "" ? 700 : 500,
                color:
                  selectedSubMenuId === ""
                    ? theme.palette.primary.main
                    : "text.primary",
                borderBottom:
                  selectedSubMenuId === "" ? "1px solid #038265" : "none",
                textDecorationColor:
                  selectedSubMenuId === "" ? "#038265" : "none",
                textDecorationThickness: "1.5px",
                textDecorationStyle: "solid",
                display: "inline-block",
                fontFamily: "revert-layer",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: "1",
                cursor: "pointer",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() => onSubMenuClick("")}
            >
              All
            </Typography>
          </Grid>

          {loadedCategories.map((category) => (
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              lg={"auto"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              key={category._id}
            >
              <Typography
                sx={{
                  fontWeight: selectedSubMenuId === category._id ? 700 : 400,
                  color:
                    selectedSubMenuId === category._id
                      ? theme.palette.primary.main
                      : "text.primary",
                  borderBottom:
                    selectedSubMenuId === category._id
                      ? "1px solid #038265"
                      : "none",
                  margin: 0,
                  lineHeight: "1.2",
                  fontFamily: "revert-layer",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",

                  textWrap: "nowrap",
                  display: "inline-block",
                  cursor: "pointer",

                  textDecoration: "none",
                  "&:hover": {
                    color: "black",
                  },
                }}
                onClick={() => onSubMenuClick(category._id)}
              >
                {category.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default Categories;
