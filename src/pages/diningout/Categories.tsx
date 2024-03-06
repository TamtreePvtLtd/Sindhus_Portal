import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Container from "@mui/material/Container";
import { useGetAllDiningOutMenuDatas } from "../../customRQHooks/Hooks";
import { useEffect, useState } from "react";
import { ICategory } from "../../interface/types";
import { useNavigate } from "react-router-dom";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import PageBanner from "../../common/component/pageBanner";
import { Grid } from "@mui/material";

function Categories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const { data } = useGetAllDiningOutMenuDatas();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setCategories([...data]);
    }
  }, [data]);

  const theme = useTheme();
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickProduct = (menuId: string) => {
    navigate(`/productsByCategory/${menuId}`);
  };

  return (
    <>
      <Box>
        <PageBanner
          imageUrl="assets/Menuimage.jpg"
          content="Menu"
          description="Delight in our globally inspired dishes, crafted with locally sourced ingredients for an unforgettable culinary experience."
        />
      </Box>
      <Container>
        {categories && categories.length > 0 ? (
          <Grid
            container
            justifyContent="center"
            spacing={4}
            sx={{ marginTop: "20px" }}
          >
            {categories.map((category, index) => (
              <Grid item key={index} xs={12} sm={6} md={3} lg="auto">
                <Box
                  onClick={() => handleClickProduct(category._id)}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    color: (theme) =>
                      selectedMenuId === category._id ||
                      hoveredMenuId === category._id
                        ? theme.palette.text.primary // Change to black color when hovered
                        : theme.palette.text.disabled,
                    textDecoration: "none",
                    "&:hover": {
                      color: (theme) => theme.palette.text.primary,
                      textDecoration: "underline",
                      textDecorationColor: "#038265", // Change to green color when hovered
                    },
                  }}
                >
                  <Typography
                    style={{
                      margin: 0,
                      lineHeight: "2",
                      marginBottom: "10px",
                      fontFamily: "revert-layer",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {category.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoProductsAvailable />
        )}
      </Container>
    </>
  );
}

export default Categories;
