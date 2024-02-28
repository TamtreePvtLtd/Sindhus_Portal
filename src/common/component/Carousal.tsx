import { ICategoryWithProducts } from "../../interface/types";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import CommonProductCard from "./CommonProductCard";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IProps {
  category: ICategoryWithProducts;
}

export const ProductsSliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  arrows: false,
  lazyLoad: "ondemand",
};

function Carousel(props: IProps) {
  const { category } = props;

  const navigate = useNavigate();

  const theme = useTheme();
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
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
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          arrows: !isBelowMediumScreen,
        },
      },
    ],
  };

  const handleClickViewAll = (menuId: string) => {
    navigate(`/productsByCategory/${menuId}`);
  };

  return (
    category &&
    category.menuDatas && (
      <Container>
        <Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography
              sx={{
                margin: "0px 10px 0px 0px",
                marginLeft: "20px",
                fontWeight: 500,
                color: "white",
                lineHeight: 1.5,
              }}
              variant="h6"
            >
              {category.menuDatas.title}
            </Typography>
            <Box sx={{ color: "white" }}>
              <Typography
                onClick={() => handleClickViewAll(category.menuDatas._id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                  marginRight: "20px",
                  fontSize: "1.1rem",
                }}
              >
                View All
                <KeyboardArrowRightIcon />
              </Typography>
            </Box>
          </Box>
          <Box sx={{ py: 2 }}>
            <Slider {...settings}>
              {category.menuDatas.products.length > 0 &&
                category.menuDatas.products.map((product, productIndex) => (
                  <Box
                    key={productIndex}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CommonProductCard
                      product={product}
                      menuType={category.menuDatas.menuType}
                    />
                  </Box>
                ))}
            </Slider>
          </Box>
        </Box>
      </Container>
    )
  );
}

export default Carousel;
