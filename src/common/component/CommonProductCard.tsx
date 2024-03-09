import { useEffect, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";
import { paths } from "../../routes/path";
import { IProductCardList } from "../../interface/types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";

interface IProps {
  product: IProductCardList;
}

function CommonProductCard(props: IProps) {
  const { product } = props;
  const [selectedSize, setSelectedSize] = useState(
    product.dailyMenuSizeWithPrice?.[0]?.size || ""
  );

  useEffect(() => {
    if (
      product.dailyMenuSizeWithPrice &&
      product.dailyMenuSizeWithPrice.length > 0
    ) {
      setSelectedSize(String(product.dailyMenuSizeWithPrice[0]?.price) || "");
    }
  }, [product.dailyMenuSizeWithPrice]);

  const handlePriceChange = (event: SelectChangeEvent<string>) => {
    setSelectedSize(event.target.value);
  };
  return (
    <Card
      sx={{
        mr: 2,
        width: "200px",
        height: "260px",
        border: "1px solid #ddd",
        background: "#fff",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          height: "65%",
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

      <CardContent sx={{ height: "35%", overflow: "hidden" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
          }}
          component="div"
        >
          {product.title}
        </Typography>

        <Box sx={{ mt: "5px" }}>
          {product.dailyMenuSizeWithPrice &&
          product.dailyMenuSizeWithPrice.length > 1 ? (
            <Select
              value={selectedSize || ""}
              onChange={handlePriceChange}
              sx={{
                padding: "8px 3px",
                borderRadius: "30px",
                width: "96%",
                borderColor: "#038265",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#038265",
                height: "30px",
                fontWeight: 500,
              }}
            >
              {product.dailyMenuSizeWithPrice.map((priceItem, index) => (
                <MenuItem
                  key={priceItem._id}
                  value={priceItem.price}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",

                    fontSize: "13px",

                    alignItems: "center",

                    "&:hover": {
                      backgroundColor: "#57ccb5",
                    },
                  }}
                >
                  {priceItem.size} - ${priceItem.price}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography sx={{ color: "#038265", fontWeight: 500 }}>
              {selectedSize !== null &&
              product.dailyMenuSizeWithPrice &&
              product.dailyMenuSizeWithPrice.length > 0
                ? `${product.dailyMenuSizeWithPrice[0]?.size} - $${selectedSize}`
                : ""}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonProductCard;
