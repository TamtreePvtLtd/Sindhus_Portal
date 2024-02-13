import { ICategoryWithProducts } from "../../interface/types";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import CommonProductCard from "./CommonProductCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Button from "@mui/material/Button";
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
    slidesToShow: 4.2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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
            pb={1}
            mt={1}
          >
            <Typography
              sx={{
                margin: "0px 10px 0px 0px",
                fontWeight: 800,
                color: "black",
                lineHeight: 2,
              }}
              variant="h5"
            >
              {category.menuDatas.title}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleClickViewAll(category.menuDatas._id)}
            >
              View All
              <ArrowForwardIcon sx={{ fontSize: "18px" }} />
            </Button>
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
