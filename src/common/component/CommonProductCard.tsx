import CardContent from "@mui/material/CardContent";
import { IProductCardList } from "../../interface/types";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { paths } from "../../routes/path";
import { useEffect, useState } from "react";

interface IProps {
  product: IProductCardList;
  menuType?: number;
}

function CommonProductCard(props: IProps) {
  const { product } = props;

  const [selectedSize, setSelectedSize] = useState(
    product.dailyMenuSizeWithPrice?.[0]?.size || ""
  );
  const theme = useTheme();

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    setSelectedSize(product.dailyMenuSizeWithPrice?.[0]?.size || "");
  }, [product.dailyMenuSizeWithPrice]);

  return (
    <Card
      sx={{
        mr: 2,
        width: "200px",
        height: "260px",
        border: "gray",
      }}
    >
      <Box
        sx={{
          height: "140px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Link
          to={`/detail/${product._id}`}
          state={{ previousPath: paths.DAILYMENU }}
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            src={product.posterURL}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "transform 400ms",
            }}
            loading="lazy"
          />
        </Link>
      </Box>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
                          }}
          component="div"
        >
          {product.title}
        </Typography>

        <Box>
          {product.dailyMenuSizeWithPrice &&
          product.dailyMenuSizeWithPrice.length > 0 ? (
            <>
              <Box
                sx={{
                  marginBottom: "5px",
                  display: "flex",
                }}
              >
                {product.dailyMenuSizeWithPrice.map((sizePrice) => (
                  <Typography
                    key={sizePrice.size}
                    onClick={() => handleSizeClick(sizePrice.size)}
                    sx={{
                      color:
                        selectedSize === sizePrice.size
                          ? theme.palette.primary.main
                          : "gray",

                      border: `1px solid ${
                        selectedSize === sizePrice.size
                          ? theme.palette.primary.main
                          : ""
                      }`,
                      opacity: "0.8",
                      padding: "3px",
                      marginRight: "10px",
                      cursor: "pointer",
                      fontSize: "0.6rem",
                      fontWeight: selectedSize === sizePrice.size ? 800 : 400,
                    }}
                  >
                    {sizePrice.size}
                  </Typography>
                ))}
              </Box>
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              >
                $
                {product.dailyMenuSizeWithPrice.find(
                  (sizePrice) => sizePrice.size === selectedSize
                )?.price || product.price}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            >
              ${product.price}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonProductCard;
