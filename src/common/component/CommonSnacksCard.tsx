import React, { useState, useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import { IProductCardList } from "../../interface/types";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { paths } from "../../routes/path";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, ButtonGroup, Grid } from "@mui/material";

interface IProps {
  product: IProductCardList;
}

function CommonSnacksCard(props: IProps) {
  const { product } = props;
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    if (product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0) {
      setSelectedPrice(product.itemSizeWithPrice[0]?.price || null);
      setSelectedSize(product.itemSizeWithPrice[0]?.size || null);
    }
  }, [product.itemSizeWithPrice]);


  const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedPriceValue = event.target.value as number;
    setSelectedPrice(selectedPriceValue);

    const selectedSizeItem = product.itemSizeWithPrice!.find(
      (item) => item.price === selectedPriceValue
    );
    if (selectedSizeItem) {
      setSelectedSize(selectedSizeItem.size);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

const handleAddToCart = () => {
    if (selectedSize !== null && selectedPrice !== null) {
      const itemDetails = {
        productId: product._id,
        sizes: [
          {
            size: selectedSize,
            qty: quantity,
            price: selectedPrice,
          },
        ],
      };

      // Save to localStorage
      const existingItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      existingItems.push(itemDetails);
      localStorage.setItem("cartItems", JSON.stringify(existingItems));
    }
  };

  return (
    <Card
      sx={{
        mr: 2,
        width: "220px",
        height: "350px",
        border: "1px solid #ddd",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box sx={{ height: "68%", width: "100%", overflow: "hidden" }}>
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
              height: "95%",
              transition: "transform 400ms",
            }}
            loading="lazy"
          />
        </Link>
      </Box>
      <CardContent
        sx={{ height: "32%", overflow: "hidden", paddingTop: "2px" }}
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
        <Grid
          container
          sx={{ marginTop: 1.5 }}
          padding={0}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
          margin={0}
        >
          <Grid item>
            <ButtonGroup
              sx={{
                padding:0,
                height:"25px",
                width:"30px",
                "& .MuiButtonGroup-grouped": {
                  minWidth: "30px",
                },
              }}
              size="small"
              
              aria-label="small outlined button group"
            >
              <Button
                onClick={() => handleDecrement()}
                sx={{
                  color: "black",
                  fontSize: "16px",
                  borderTopLeftRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  border: "1px solid #038265",
                  padding:"2px"
                }}
              >
                -
              </Button>
              <Button
                sx={{
                  color: "black",
                  fontSize: "16px",
                  border: "1px solid #038265",
                  padding:"2px"
                }}
              >
                {quantity}
              </Button>
              <Button
                onClick={() => handleIncrement()}
                sx={{
                  color: "black",
                  fontSize: "16px",
                  borderTopRightRadius: "20px",
                  borderBottomRightRadius: "20px",
                  border: "1px solid #038265",
                  padding:"2px"
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item>
            <Button
            onClick={handleAddToCart}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffffff",
                fontSize: "15px",
                fontWeight: 500,
                height: "25px",
                width: "35px",
                borderRadius: "16px",
                border: "1px solid #038265",
                color: "black",
                "&:hover": {
                  backgroundColor: "#038265",
                  color: "white",
                  border: "none",
                  boxShadow: "none",
                },
              }}
              startIcon={
                <img
                  src="/assets/images/sindhus-logo.png"
                  alt="icon"
                  style={{
                    height: "15px",
                    width: "15px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                />
              }
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CommonSnacksCard;
