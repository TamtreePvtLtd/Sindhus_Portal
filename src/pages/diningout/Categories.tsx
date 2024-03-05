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

function Categories() {
  const [categories, setCategories] = useState<ICategory[]>([]);

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
          imageUrl="assets/images/snacks-banner-image.jpg"
          content="Menu"
          description="Delight in our globally inspired dishes, crafted with locally sourced ingredients for an unforgettable culinary experience."
        />
      </Box>
      <Container>
        {categories && categories.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {categories.map((category, index) => (
              <Box
                key={index}
                onClick={() => handleClickProduct(category._id)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  fontSize: "1.5rem",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#038265",
                  },
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "10rem",
                  py: 5,
                  mx: 1,
                }}
              >
                <Typography
                  gutterBottom
                  component="div"
                  sx={{
                    textAlign: "center",
                    fontWeight: 500,
                    m: 0,
                  }}
                >
                  {category.title}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <NoProductsAvailable />
        )}
      </Container>
    </>
  );
}

export default Categories;
