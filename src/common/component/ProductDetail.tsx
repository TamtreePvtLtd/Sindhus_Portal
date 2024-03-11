import Slider from "react-slick";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../services/api";
import { IProduct } from "../../interface/types";
import { useSnackBar } from "../../context/SnackBarContext";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { useLocation } from "react-router-dom";
import { paths } from "../../routes/path";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

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
                            height: "350px",
                            width: "100%",
                            overflow: "hidden",
                            border: "1px solid #ddd",
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
                      fontWeight: "bolder",
                      fontSize: "20px",
                    }}
                  >
                    {menuDetail.title}
                  </Typography>
                  {/* <Typography sx={{ mt: 1, display: "flex" }}>
                    <Typography>By&nbsp;&nbsp; </Typography>
                    <Typography
                      sx={{
                        fontFamily: "clearface ts bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      SINDHU'S&nbsp;
                    </Typography>
                  </Typography> */}
                  <Divider sx={{ margin: "10px 0" }} />
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
                              // fontSize: "18px",
                              // fontWeight: "500",
                              // margin: "8px 0",
                              marginTop: "8px",
                            }}
                          >
                            Daily Menu size(s)
                          </Typography>
                          {menuDetail.dailyMenuSizeWithPrice.map(
                            (sizePrice) => (
                              <Typography
                                key={sizePrice._id}
                                sx={{ color: "#038265", fontWeight: 500 }}
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
