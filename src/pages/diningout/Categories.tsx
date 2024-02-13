import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Slider from "react-slick";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import { useGetAllDiningOutMenuDatas } from "../../customRQHooks/Hooks";
import { useEffect, useState } from "react";
import { ICategory } from "../../interface/types";
import { useNavigate } from "react-router-dom";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";

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

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5.7,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 1,
          arrows: !isBelowMediumScreen,
        },
      },
    ],
  };

  const handleClickProduct = (menuId: string) => {
    navigate(`/productsByCategory/${menuId}`);
  };

  return (
    <Container>
      {categories && categories.length > 0 ? (
        <>
          <Typography
            sx={{
              fontWeight: 800,
              color: "black",
              lineHeight: 2,
              mt: 2,
            }}
            variant="h5"
          >
            Menus
          </Typography>

          <Slider {...settings}>
            {categories?.map((category, index) => (
              <Box
                key={index}
                sx={{
                  width: "10rem !important",
                  py: 2,
                }}
              >
                <Card
                  onClick={() => handleClickProduct(category._id)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    },
                    boxShadow: 2,
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      p: 1,
                      fontWeight: 500,
                      m: 0,
                    }}
                  >
                    {category.title}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Slider>
        </>
      ) : (
        <NoProductsAvailable />
      )}
    </Container>
  );
}

export default Categories;
