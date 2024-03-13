import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import { ICategory } from "../../interface/types";
import { useEffect, useState } from "react";
import PageBanner from "../../common/component/pageBanner";
import theme from "../../theme/theme";

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
          content="Menu"
          description="Tantalizing glimpse into the culinary delights awaiting you at our restaurant"
        />
      </Box>

      <Box>
        {loadedCategories && loadedCategories.length > 0 && (
          <Grid
            container
            display={"flex"}
            flexDirection={"row"}
            // paddingX={3}
            justifyContent={"center"}
            alignItems={"center"}
            columnGap={4}
            spacing={2}
            marginTop="15px"
          >
            <Grid
              item
              xs={4}
              sm={6}
              md={4}
              lg={"auto"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              key={"all-category"}
            >
              <Typography
                sx={{
                  fontWeight: selectedSubMenuId === "" ? 700 : 400,
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
                  lineHeight: "1.2",
                  "&:hover": {
                    color: "black",
                  },
                  cursor: "pointer",
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
                sm={6}
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
                    display: "inline-block",
                    textDecoration: "none",
                    "&:hover": {
                      color: "black",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => onSubMenuClick(category._id)}
                >
                  {category.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default Menus;
