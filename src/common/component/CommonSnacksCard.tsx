import CardContent from "@mui/material/CardContent";
import { IProductCardList } from "../../interface/types";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { paths } from "../../routes/path";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

interface IProps {
  product: IProductCardList;
}

function CommonSnacksCard(props: IProps) {
  const { product } = props;
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  useEffect(() => {
    if (product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0) {
      setSelectedPrice(product.itemSizeWithPrice[0]?.price || null);
    }
  }, [product.itemSizeWithPrice]);

  const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPrice(event.target.value as number);
  };

  return (
    <Card
      sx={{
        mr: 2,
        width: "200px",
        height: "285px",
        border: "1px solid #ddd",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box sx={{ height: "60%", width: "100%", overflow: "hidden" }}>
        <Link
          to={`/detail/${product._id}`}
          state={{ previousPath: paths.SNACKS }}
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
        sx={{ height: "40%", overflow: "hidden", paddingTop: "2px"}}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
            textAlign: "left",
          }}
          component="div"
        >
          {product.title}
        </Typography>
        <Box sx={{ mt: "3px" }}>
          {product.itemSizeWithPrice && product.itemSizeWithPrice.length > 1 ? (
            <Select
              value={selectedPrice || ""}
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
              {product.itemSizeWithPrice.map((priceItem) => (
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
              {selectedPrice !== null && product.itemSizeWithPrice
                ? `${product.itemSizeWithPrice[0].size} - $${selectedPrice}`
                : ""}
            </Typography>
          )}
        </Box>
        <Box
          marginY={1}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight:"5px"
          }}
        >
          <Button
            sx={{
              border: "1.5px solid #038265",
              borderRadius: "30px",
              fontSize: "13px",
              color: "#038265",
              fontWeight: 700,
              padding: "2px",
              width: "159px",
              height:"32px",
              textAlign:"center",
              textJustify:"center",
              "&:hover": {
                backgroundColor: "#038265",
                color: "white",
              },
            }}
            startIcon={<AddShoppingCartIcon />}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonSnacksCard;
