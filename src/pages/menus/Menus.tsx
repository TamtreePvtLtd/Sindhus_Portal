import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import { ICategory, ICategoryTitleDispay } from "../../interface/types";
import { useEffect, useState } from "react";
import PageBanner from "../../common/component/pageBanner";

interface IProps {
  onSubMenuClick(submenuId: string): void;
  categories: ICategory[];
  selectedSubMenuId?: string;
}

function Menus({ onSubMenuClick, categories, selectedSubMenuId }: IProps) {
  const [loadedCategories, setLoadedCategories] =
    useState<ICategory[]>(categories);

  useEffect(() => {
    setLoadedCategories(categories);
  }, [categories]);

  return (
    <>
      <Box>
        <PageBanner
          imageUrl="public/assets/sindhu-kitchen.avif"
          content="Our Menu"
          description="The following is a list of the foods available in our restaurant!"
        />
      </Box>
      {loadedCategories && loadedCategories.length > 0 && (
        <Grid
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          columnGap={4}
          marginTop="15px"
        >
          <Box>
            <Typography
              sx={{
                fontWeight: selectedSubMenuId === "" ? 700 : 500,
                color:
                  selectedSubMenuId === "" ? "text.primary" : "text.disabled",
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
                lineHeight: "2",
                "&:hover": {
                  color: "black",
                },
              }}
              onClick={() => onSubMenuClick("")}
            >
              All
            </Typography>
          </Box>

          {loadedCategories.map((category) => (
            <Box key={category._id}>
              <Typography
                sx={{
                  fontWeight: selectedSubMenuId === category._id ? 700 : 500,
                  color:
                    selectedSubMenuId === category._id
                      ? "text.primary"
                      : "text.disabled",
                  borderBottom:
                    selectedSubMenuId === category._id
                      ? "1px solid #038265"
                      : "none",
                  margin: 0,
                  lineHeight: "2",
                  fontFamily: "revert-layer",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  display: "inline-block",
                  textDecoration: "none",
                  "&:hover": {
                    color: "black",
                  },
                }}
                onClick={() => onSubMenuClick(category._id)}
              >
                {category.title}
              </Typography>
            </Box>
          ))}
        </Grid>
      )}
    </>
  );
}

export default Menus;
