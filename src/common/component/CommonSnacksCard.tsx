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
         margin:"auto"
      }}
    >
      <Box sx={{ height: "70%", width: "100%", overflow: "hidden" }}>
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
              // objectFit: "contain",
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
            marginTop:"-5px"
          }}
          component="div"
        >
          {product.title}
        </Typography>
        <Box>
          {product.itemSizeWithPrice && product.itemSizeWithPrice.length > 1 ? (
            <Select
              value={selectedPrice || ""}
              onChange={handlePriceChange}
              sx={{
                border: "solid 1px #ddd",
                padding: "8px 17px",
                borderRadius: "30px",
                width: "90%",
                height: "36px",
                fontSize: "13px",
              }}
            >
              {product.itemSizeWithPrice.map((priceItem, index) => (
                <MenuItem
                  key={priceItem._id}
                  value={priceItem.price}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "13px",
                    borderRadius: "30px",
                    alignItems: "center",

                    "&:hover": {
                      backgroundColor: "#57ccb5",
                    },
                  }}
                >
                  {priceItem.size}lb - ${priceItem.price}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography sx={{ color: "black", fontWeight: 350 }}>
              {selectedPrice !== null && product.itemSizeWithPrice
                ? `${product.itemSizeWithPrice[0].size}lb - $${selectedPrice}`
                : ""}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonSnacksCard;
