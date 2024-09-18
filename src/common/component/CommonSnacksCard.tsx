// import CardContent from "@mui/material/CardContent";
// import { IProductCardList } from "../../interface/types";
// import { Link } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import useTheme from "@mui/material/styles/useTheme";
// import Card from "@mui/material/Card";
// import CardMedia from "@mui/material/CardMedia";
// import { paths } from "../../routes/path";
// import { useEffect, useState } from "react";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import { Button } from "@mui/material";

// interface IProps {
//   product: IProductCardList;
// }

// function CommonSnacksCard(props: IProps) {
//   const { product } = props;
//   const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
//   const theme = useTheme();

//   useEffect(() => {
//     if (product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0) {
//       setSelectedPrice(product.itemSizeWithPrice[0]?.price || null);
//     }
//   }, [product.itemSizeWithPrice]);

//   const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     setSelectedPrice(event.target.value as number);
//   };

//    const handleAddToCart = () => {
//      // Implement your add to cart logic here
//      console.log("Added to cart:", product.title, selectedPrice);
//    };

//   return (
//     <Card
//       sx={{
//         mr: 2,
//         width: "180px",
//         height: "400px",
//         border: "1px solid #ddd",
//         boxShadow: "none",
//         margin: "auto",
//       }}
//     >
//       <Box sx={{ height: "72%", width: "100%", overflow: "hidden" }}>
//         <Link
//           to={`/detail/${product._id}`}
//           state={{ previousPath: paths.SNACKS }}
//           style={{ textDecoration: "none" }}
//         >
//           <CardMedia
//             component="img"
//             src={product.posterURL}
//             sx={{
//               width: "100%",
//               height: "80%",
//               transition: "transform 400ms",
//             }}
//             loading="lazy"
//           />
//         </Link>
//       </Box>
//       <CardContent
//         sx={{ height: "28%", overflow: "hidden", paddingTop: "2px" }}
//       >
//         <Typography
//           variant="body1"
//           sx={{
//             fontWeight: 500,
//             display: "-webkit-box",
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//             WebkitLineClamp: 1,
//             textAlign: "left",
//           }}
//           component="div"
//         >
//           {product.title}
//         </Typography>
//         <Box sx={{ mt: "3px" }}>
//           {product.itemSizeWithPrice && product.itemSizeWithPrice.length > 1 ? (
//             <Select
//               value={selectedPrice || ""}
//               onChange={handlePriceChange}
//               sx={{
//                 padding: "8px 3px",
//                 borderRadius: "30px",
//                 width: "96%",
//                 borderColor: "#038265",
//                 borderWidth: "1px",
//                 borderStyle: "solid",
//                 color: "#038265",
//                 height: "30px",
//                 fontWeight: 500,
//               }}
//             >
//               {product.itemSizeWithPrice.map((priceItem, index) => (
//                 <MenuItem
//                   key={priceItem._id}
//                   value={priceItem.price}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "flex-start",

//                     fontSize: "13px",
//                     alignItems: "center",

//                     "&:hover": {
//                       backgroundColor: "#57ccb5",
//                     },
//                   }}
//                 >
//                   {priceItem.size} - ${priceItem.price}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : (
//             <Typography sx={{ color: "#038265", fontWeight: 500 }}>
//               {selectedPrice !== null && product.itemSizeWithPrice
//                 ? `${product.itemSizeWithPrice[0].size} - $${selectedPrice}`
//                 : ""}
//             </Typography>
//           )}
//         </Box>
//         {/* Add to Cart Button */}
//         <Button
//           variant="contained"
//           sx={{
//             mt: 2, // Adds margin-top
//             backgroundColor: "#038265",
//             color: "#fff",
//             width: "100%",
//             fontWeight: 500,
//             "&:hover": {
//               backgroundColor: "#025e46",
//             },
//           }}
//           onClick={handleAddToCart}
//         >
//           Add to Cart
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// export default CommonSnacksCard;
import React, { useEffect, useState } from "react";
import {
  CardContent,
  Card,
  CardMedia,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { IProductCardList } from "../../interface/types";
import { Link } from "react-router-dom";
import { CartItem, useCart } from "../../context/CartContext";
import { paths } from "../../routes/path";
import { useSnackBar } from "../../context/SnackBarContext";

interface IProps {
  product: IProductCardList;
}


function CommonSnacksCard(props: IProps) {
  const { product } = props;
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { cartItems, setCartItems, setCartCount } = useCart();
const { updateSnackBarState } = useSnackBar();
  useEffect(() => {
    if (product.itemSizeWithPrice && product.itemSizeWithPrice.length > 0) {
      const initialPrice = product.itemSizeWithPrice[0]?.price || null;
      const initialSize = product.itemSizeWithPrice[0]?.size || null;
      setSelectedPrice(initialPrice);
      setSelectedSize(initialSize);
    }
  }, [product.itemSizeWithPrice]);

  const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newPrice = event.target.value as number;
    setSelectedPrice(newPrice);

    // Find the corresponding size for the selected price
    const selectedSizeItem = product.itemSizeWithPrice?.find(
      (item) => item.price === newPrice
    );

    if (selectedSizeItem) {
      setSelectedSize(selectedSizeItem.size);
    }
  };

  const handleAddToCart = () => {
    if (selectedPrice !== null && selectedSize !== null) {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product._id && item.size === selectedSize
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item
        updatedItems = [...cartItems];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          // Calculate the total price based on the updated quantity
          totalPrice: (existingItem.quantity + 1) * existingItem.price,
        };
      } else {
        // Add new item
        updatedItems = [
          ...cartItems,
          {
            id: product._id,
            title: product.title,
            size: selectedSize,
            price: selectedPrice,
            quantity: 1,
            // Calculate the total price for the new item
            totalPrice: selectedPrice,
          },
        ];
         updateSnackBarState(true, "Item added to cart", "success");
      }

      // Update the cart state and local storage
      setCartItems(updatedItems);
      setCartCount(
        updatedItems.reduce((count, item) => count + item.quantity, 0)
      );

      console.log("Added to cart:", product.title, selectedSize, selectedPrice);
    }
  };

  return (
    <Card
      sx={{
        mr: 2,
        width: "220px",
        height: "360px",
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

        <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#038265",
              color: "#fff",
              width: "70%",
              borderRadius: "10px",
              height: "30px",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#025e46",
              },
            }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonSnacksCard;
