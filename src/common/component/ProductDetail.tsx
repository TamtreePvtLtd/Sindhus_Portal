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
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <Box sx={{ my: 2 }}>
        <Grid
          container
          spacing={isBelowMediumSize ? 0 : 6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item md={6} xs={9}>
            <Slider {...settings}>
              {menuDetail?.posterURL &&
                [menuDetail.posterURL]
                  .concat(menuDetail.images)
                  .map((image, index) => (
                    <Box>
                      <Card key={index}>
                        <Box
                          sx={{
                            height: "350px",
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <CardMedia
                            component="img"
                            alt="sindhus-menu"
                            height="100%"
                            width="100%"
                            src={image}
                          ></CardMedia>
                        </Box>
                      </Card>
                    </Box>
                  ))}
            </Slider>
          </Grid>
          <Grid item md={5} xs={12}>
            <>
              {menuDetail && (
                <>
                  <Typography sx={{ fontWeight: "bolder", fontSize: "28px" }}>
                    {menuDetail.title}
                  </Typography>

                  <Typography sx={{ mt: 2 }}>
                    By &nbsp;
                    <span style={{ textDecoration: "underline" }}>
                      Sindhu's Kitchen
                    </span>
                  </Typography>
                  <Divider sx={{ margin: "10px 0" }} />
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                  >
                    Description
                    <Typography sx={{ fontSize: "small", my: 1 }}>
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
                            fontWeight: "500",
                            margin: "8px 0",
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
                              }}
                              key={index}
                            >
                              <span style={{ color: "black", opacity: 0.8 }}>
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
                              fontWeight: "500",
                              margin: "8px 0",
                            }}
                          >
                            DailyMenu Sizes
                          </Typography>
                          {menuDetail.dailyMenuSizeWithPrice.map(
                            (sizePrice) => (
                              <Typography
                                key={sizePrice._id}
                                sx={{ color: theme.palette.primary.main }}
                              >
                                <span style={{ color: "black", opacity: 0.8 }}>
                                  {sizePrice.size}-
                                </span>
                                &nbsp;${sizePrice.price}
                              </Typography>
                            )
                          )}
                        </>
                      ) : (
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "500",
                              margin: "8px 0",
                            }}
                          >
                            Price
                          </Typography>
                          <Typography
                            sx={{ color: theme.palette.primary.main }}
                          >
                            &nbsp;${menuDetail.price}
                          </Typography>
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
