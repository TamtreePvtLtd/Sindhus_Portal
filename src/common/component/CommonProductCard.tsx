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
  const [selectedSize, setSelectedSize] = useState<string | number>(
    product.dailyMenuSizeWithPrice?.[0]?.size || ""
  );
  const [selectedSnackSize, setSelectedSnackSize] = useState<string | number>(
    product.itemSizeWithPrice?.[0]?.size || ""
  );

  useEffect(() => {
    if (
      product.dailyMenuSizeWithPrice &&
      product.dailyMenuSizeWithPrice.length > 0
    ) {
      setSelectedSize(product.dailyMenuSizeWithPrice[0]?.price || "");
    }
    if (product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0) {
      setSelectedSnackSize(product.itemSizeWithPrice[0]?.price || "");
    }
  }, [product.dailyMenuSizeWithPrice, product.itemSizeWithPrice]);

  const handlePriceChange = (
    event: SelectChangeEvent<string>,
    type: string
  ) => {
    if (type === "dailyMenuSize") {
      setSelectedSize(event.target.value);
    } else if (type === "itemSize") {
      setSelectedSnackSize(event.target.value);
    }
  };

  return (
    <Card
      sx={{
        mr: 2,
        width: "200px",
        height: "260px",
        border: "1px solid #ddd",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          height: "72%",
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
              transition: "transform 400ms",
            }}
            loading="lazy"
          />
        </Link>
      </Box>

      <CardContent
        sx={{ height: "28%", overflow: "hidden", paddingTop: "3px" }}
      >
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

        <Box>
          {product.dailyMenuSizeWithPrice &&
          product.dailyMenuSizeWithPrice.length > 1 ? (
            <Select
              value={selectedSize || ""}
              onChange={(event) => handlePriceChange(event, "dailyMenuSize")}
              sx={{
                borderRadius: "30px",
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

          {product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0 ? (
            <Select
              value={selectedSnackSize || ""}
              onChange={(event) => handlePriceChange(event, "itemSize")}
              sx={{
                borderRadius: "30px",
                borderColor: "#038265",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#038265",
                height: "30px",
                fontWeight: 500,
              }}
            >
              {product.itemSizeWithPrice.map((item, index) => (
                <MenuItem
                  key={item._id}
                  value={item.price}
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
                  {item.size} - ${item.price}
                </MenuItem>
              ))}
            </Select>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonProductCard;
