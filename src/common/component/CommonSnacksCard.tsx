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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface IProps {
  product: IProductCardList;
}

function CommonSnacksCard(props: IProps) {
  const { product } = props;
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const theme = useTheme();

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
        height: "260px",
        border: "1px solid #ddd",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box sx={{ height: "72%", width: "100%", overflow: "hidden" }}>
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
        sx={{ height: "28%", overflow: "hidden", paddingTop: "2px" }}
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
              {product.itemSizeWithPrice.map((priceItem, index) => (
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
      </CardContent>
    </Card>
  );
}

export default CommonSnacksCard;
