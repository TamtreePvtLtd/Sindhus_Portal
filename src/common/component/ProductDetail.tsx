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
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

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
  const [quantity, setQuantity] = useState<number>(0);
  const { state } = useLocation();

  const isFromCatering = state && state.previousPath === paths.CATERING;
  const isFromDiningOut = state && state.previousPath === paths.DAILYMENU;
  const isFromSnacks = state && state.previousPath === paths.SNACKS;

  const isBelowMediumSize = useMediaQuery(theme.breakpoints.down("md"));

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

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

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
                                  Size(s) with Prices:
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
                          {isFromSnacks && (
                            <>
                              {menuDetail.itemSizeWithPrice &&
                                menuDetail.itemSizeWithPrice.length > 0 && (
                                  <>
                                    <Typography variant="h6">
                                      Size(s) with Prices:
                                    </Typography>
                                    {menuDetail.itemSizeWithPrice.map(
                                      (item, index) => (
                                        <div key={index}>
                                          <Typography
                                            sx={{
                                              fontSize: "18px",
                                              fontWeight: "500",
                                              margin: "8px 0",
                                            }}
                                          >
                                            Size: {item.size}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: "18px",
                                              fontWeight: "500",
                                              margin: "8px 0",
                                            }}
                                          >
                                            Price: ${item.price}
                                          </Typography>
                                        </div>
                                      )
                                    )}
                                    
                                  </>
                                )}
                                
                            </>
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
                            {menuDetail.itemSizeWithPrice.map((item, index) => (
                              <div key={index}>
                                <Typography
                                  key={item._id}
                                  sx={{ color: "#038265", fontWeight: 500 }}
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
                            ))}
                          </>
                        )}
                                      <Box sx={{marginTop:2}}>
                                        <ButtonGroup
                                          sx={{
                                            lineHeight: 1,
                                            padding: 0,
                                            border: "1px solid #038265",
                                            "& .MuiButtonGroup-grouped": {
                                              minWidth: "32px",
                                            },
                                          }}
                                          size="large"
                                        >
                                          <Button
                                            onClick={() => handleDecrement()}
                                            sx={{
                                              color: "black",
                                              fontSize: "16px",
                                            }}
                                          >
                                            -
                                          </Button>
                                          <Button
                                            sx={{
                                              color: "black",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {" "}
                                            {quantity}
                                          </Button>
                                          <Button
                                            onClick={() => handleIncrement()}
                                            sx={{
                                              color: "black",
                                              fontSize: "16px",
                                            }}
                                          >
                                            +
                                          </Button>
                                        </ButtonGroup>
                                      </Box>
                                      <Box sx={{marginTop:2}}>
                                        <Button
                                        fullWidth
                                          sx={{
                                            border: "2px solid #038265",
                                            borderRadius: "30px",
                                            fontSize: "18px",
                                            color: "#038265",
                                            fontWeight: 700,
                                            textAlign: "center",
                                            textJustify: "center",
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
                    </>
                  )}
                </>
              )}
            </>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProductDetail;
