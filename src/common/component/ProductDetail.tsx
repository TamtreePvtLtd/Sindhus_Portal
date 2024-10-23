import Slider from "react-slick";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../services/api";
import { IProduct } from "../../interface/types";
import { useSnackBar } from "../../context/SnackBarContext";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useLocation } from "react-router-dom";
import { paths } from "../../routes/path";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { CartItem, useCart } from "../../context/CartContext";

function ProductDetail() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const { productId } = useParams();
  const { updateSnackBarState } = useSnackBar();
  const [menuDetail, setMenuDetail] = useState<IProduct>();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const { cartItems, setCartItems, setCartCount } = useCart();

  const { state } = useLocation();

  const isFromCatering = state && state.previousPath === paths.CATERING;
  const isFromDiningOut = state && state.previousPath === paths.DAILYMENU;
  const isFromSnacks = state && state.previousPath === paths.SNACKS;

  const isBelowMediumSize = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (
      menuDetail &&
      menuDetail.itemSizeWithPrice &&
      menuDetail.itemSizeWithPrice.length > 0
    ) {
      const firstItem = menuDetail.itemSizeWithPrice[0];
      setSelectedSize(firstItem.size);
      setSelectedPrice(firstItem.price);
    }
  }, [menuDetail]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetchProductById(productId);
      setMenuDetail(response.data.data);
      document.title = response.data.data.title ?? "Sindhu's";
    } catch (error: any) {
      if (error.response && error.response.data) {
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  const handleAddToCart = () => {
    if (!menuDetail || !isFromSnacks) return;

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === productId && item.size === selectedSize
    );

    // Ensure productId is defined or handle undefined case
    if (!productId) {
      updateSnackBarState(true, "Product ID is missing", "error");
      return;
    }

    let updatedItems = [...cartItems];

    if (existingItemIndex > -1) {
      // Update existing item
      const existingItem = updatedItems[existingItemIndex];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,

        totalPrice: (existingItem.quantity + 1) * existingItem.price,
      };
    } else {
     
      const newCartItem: CartItem = {
        id: productId, 
        title: menuDetail.title,
        size: selectedSize,
        price: selectedPrice,
        imageUrl: menuDetail.images[0] || "",
        quantity: 1,
        totalPrice: selectedPrice,
      };
      updatedItems = [...updatedItems, newCartItem];
      updateSnackBarState(true, "Item added to cart", "success");
    }

    // Update cart items
    setCartItems(updatedItems);

    // Update cart count
    setCartCount(updatedItems.length);

    // Show confirmation
    
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  return (
    <Container>
      <IconButton
        sx={{
          float: "left",
          pl: 0,
          my: 1,
          color: theme.palette.primary.main,
        }}
        onClick={() => navigate(-1)}
      >
        {/* <ArrowBackIcon fontSize="large" /> */}
        <ArrowCircleLeftIcon fontSize="large" />
      </IconButton>
      <Box sx={{ my: 1 }}>
        <Grid
          container
          spacing={isBelowMediumSize ? 0 : 6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item md={6} xs={9} sx={{ paddingTop: "10px !important" }}>
            <Slider {...settings}>
              {menuDetail?.posterURL &&
                [menuDetail.posterURL]
                  .concat(menuDetail.images)
                  .map((image, index) => (
                    <Box key={index}>
                      <Card sx={{ boxShadow: "none" }}>
                        <Box
                          sx={{
                            height: isBelowMediumSize ? "auto" : "350px",
                            width: "100%",
                            overflow: "hidden",
                            background: "#fff",
                          }}
                        >
                          <CardMedia
                            component="img"
                            alt="sindhus-menu"
                            height="100%"
                            width="100%"
                            src={image}
                            sx={{ objectFit: "contain" }}
                          />
                        </Box>
                      </Card>
                    </Box>
                  ))}
            </Slider>
          </Grid>
          <Grid item md={5} xs={12} sx={{ paddingTop: "10px !important" }}>
            <>
              {menuDetail && (
                <>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "22px",
                      marginBottom: "10px",
                    }}
                  >
                    {menuDetail.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    Description
                    <Typography variant="body2">
                      {menuDetail.description}
                    </Typography>
                  </Typography>
                  {menuDetail.servingSizeDescription && (
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: "500",
                        margin: "5px 0",
                      }}
                    >
                      servingSizeDescription
                      <Typography
                        sx={{
                          whiteSpace: "pre-line",
                        }}
                      >
                        {menuDetail.servingSizeDescription}
                      </Typography>
                    </Typography>
                  )}
                  {isFromCatering &&
                    menuDetail.cateringMenuSizeWithPrice &&
                    menuDetail.cateringMenuSizeWithPrice.length > 0 && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: "600",
                            // margin: "8px 0",
                            marginTop: "8px",
                          }}
                        >
                          Catering Sizes
                        </Typography>
                        {menuDetail.cateringMenuSizeWithPrice.map(
                          (size, index) => (
                            <Typography
                              sx={{
                                display: "flex",
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                              }}
                              key={index}
                            >
                              <span
                                style={{
                                  color: theme.palette.primary.main,
                                  fontWeight: 500,
                                }}
                              >
                                {size.size}-
                              </span>
                              &nbsp; [${size.price}]
                            </Typography>
                          )
                        )}
                      </>
                    )}
                  {isFromDiningOut && (
                    <>
                      {menuDetail.dailyMenuSizeWithPrice &&
                      menuDetail.dailyMenuSizeWithPrice.length > 0 ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginTop: "8px",
                            }}
                          >
                            Daily Menu size(s)
                          </Typography>
                          {menuDetail.dailyMenuSizeWithPrice.map(
                            (sizePrice) => (
                              <Typography
                                key={sizePrice._id}
                                sx={{
                                  color: "#038265",
                                  fontWeight: 500,
                                  marginBottom: "8px",
                                }}
                              >
                                <span
                                  style={{ color: "#038265", fontWeight: 500 }}
                                >
                                  {sizePrice.size}-
                                </span>
                                &nbsp;${sizePrice.price}
                              </Typography>
                            )
                          )}
                        </>
                      ) : (
                        <>
                          {menuDetail.itemSizeWithPrice &&
                            menuDetail.itemSizeWithPrice.length > 0 && (
                              <>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    marginTop: "8px",
                                  }}
                                >
                                  {/* Size(s) with Prices: */}
                                </Typography>
                                {menuDetail.itemSizeWithPrice.map(
                                  (item, index) => (
                                    <div key={index}>
                                      <Typography
                                        key={item._id}
                                        sx={{
                                          color: "#038265",
                                          fontWeight: 500,
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#038265",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {item.size}-
                                        </span>
                                        &nbsp;${item.price}
                                      </Typography>
                                    </div>
                                  )
                                )}
                              </>
                            )}
                          {isFromSnacks &&
                            menuDetail.itemSizeWithPrice &&
                            menuDetail.itemSizeWithPrice.length > 0 && (
                              <FormControl fullWidth>
                                <InputLabel id="size-price-label">
                                  Size(s) with Prices
                                </InputLabel>
                                <Select
                                  labelId="size-price-label"
                                  defaultValue=""
                                  label="Size(s) with Prices"
                                >
                                  {menuDetail.itemSizeWithPrice.map(
                                    (item, index) => (
                                      <MenuItem key={index} value={item.size}>
                                        <Typography
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Size: {item.size} - Price: $
                                          {item.price}
                                        </Typography>
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                            )}
                        </>
                      )}
                    </>
                  )}
                  {isFromSnacks && (
                    <>
                      {console.log(
                        "itemSizeWithPrice:",
                        menuDetail?.itemSizeWithPrice
                      )}
                      {menuDetail.itemSizeWithPrice &&
                        menuDetail.itemSizeWithPrice.length > 0 && (
                          <>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "18px",
                                fontWeight: "600",
                                marginTop: "8px",
                              }}
                            >
                              Size(s) with Prices:
                            </Typography>
                            <FormControl fullWidth>
                              <Select
                                labelId="size-price-label"
                                defaultValue={
                                  menuDetail.itemSizeWithPrice[0]?.size
                                }
                                sx={{
                                  height: "35px", // Adjust height here
                                  width: "60%", // Ensure it takes the full width of FormControl
                                }}
                                onChange={(e) => {
                                  const selectedItem =
                                    menuDetail.itemSizeWithPrice.find(
                                      (item) => item.size === e.target.value
                                    );

                                  if (selectedItem) {
                                    console.log("Selected Item:", selectedItem);
                                    setSelectedSize(selectedItem.size);
                                    setSelectedPrice(selectedItem.price);
                                  } else {
                                    console.error(
                                      "Selected item not found, setting to first item"
                                    );
                                    const firstItem =
                                      menuDetail.itemSizeWithPrice[0];
                                    setSelectedSize(firstItem.size);
                                    setSelectedPrice(firstItem.price);
                                  }
                                }}
                              >
                                {menuDetail.itemSizeWithPrice.map(
                                  (item, index) => (
                                    <MenuItem key={index} value={item.size}>
                                      <Typography
                                        sx={{
                                          fontSize: "16px",
                                          fontWeight: "400",
                                        }}
                                      >
                                        Size: {item.size} - Price: ${item.price}
                                      </Typography>
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </>
                        )}
                    </>
                  )}
                </>
              )}
            </>
            <Box>
              {menuDetail?.availability === "true" ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#038265",
                    color: "#fff",
                    width: "30%",
                    mt: "10px",
                    borderRadius: "10px",
                    height: "35px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#025e46",
                    },
                  }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              ) : (
                <Button
                  variant="contained"
                  // disabled
                  sx={{
                    backgroundColor: "#ff6666",
                    color: "#fff",
                    width: "30%",
                    borderRadius: "10px",
                    mt: "10px",
                    height: "35px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#ff6666",
                    },
                  }}
                  // onClick={() =>
                  //   updateSnackBarState(
                  //     true,
                  //     "The product is not available",
                  //     "error"
                  //   )
                  // }
                >
                  Sold Out
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProductDetail;
