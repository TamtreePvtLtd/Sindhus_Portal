import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetAllMenuType3 } from "../../customRQHooks/Hooks";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Fade from "react-reveal";
import PageBanner from "../../common/component/pageBanner";

const Menus = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();
  const theme = useTheme();
  const [hoveredMenuId, setHoveredMenuId] = useState<null | string>(null);

  const handleMenuClick = (menuId: string | undefined) => {
    setSelectedMenuId(menuId);
  };

  const { data: menus} = useGetAllMenuType3(selectedMenuId!);
  console.log(menus);
  console.log(
    menus?.MenusWithProduct.map((menu) => {
      return {
        title: menu.title,
        products: menu.products.map((product) => {
          return {
            _id: product._id,
            title: product.title,
          };
        }),
      };
    })
  );

  useEffect(() => {
    if (!selectedMenuId && menus) {
      setSelectedMenuId("");
    }
  }, [menus, selectedMenuId]);
  console.log();

  return (
    <div>
      <Box>
        <PageBanner
          imageUrl="public/assets/sindhu-kitchen.avif"
          content="Our Menu"
          description="The following is a list of the foods available in our restaurant!"
        />
      </Box>
      <Container>
        <Box sx={{ paddingTop: "20px" }}>
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ cursor: "pointer" }}>
              <Fade left>
                <Box>
                  <Typography
                    style={{
                      marginTop: "13px",
                      fontFamily: "revert-layer",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      textTransform: "uppercase",

                      color:
                        selectedMenuId === "" || selectedMenuId === undefined
                          ? theme.palette.primary.main
                          : theme.palette.text.disabled,
                    }}
                    onClick={() => handleMenuClick(undefined)}
                  >
                    All
                  </Typography>
                </Box>
              </Fade>
            </Box>
            {menus?.menus.map((menu) => (
              <Grid
                item
                key={menu.title}
                columnGap={4}
                xs={"auto"}
                sm={3}
                md={3}
                lg={"auto"}
              >
                <Box
                  sx={{
                     textAlign: "center",
                    paddingX: "20px",
                    cursor: "pointer",
                    color:
                      selectedMenuId === menu._id || hoveredMenuId === menu._id
                        ? theme.palette.primary.main
                        : "text.disabled",
                    "&:hover": {
                      borderBottom: "1.5px solid #038265",
                    },
                  }}
                  onClick={() => handleMenuClick(menu._id)}
                  onMouseEnter={() => setHoveredMenuId(menu._id)}
                  onMouseLeave={() => setHoveredMenuId(null)}
                >
                  <Fade left>
                    <Typography
                      style={{
                        lineHeight: "2",
                        // marginBottom: "10px",
                        fontFamily: "revert-layer",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {menu.title}
                    </Typography>
                  </Fade>
                </Box>
              </Grid>
            ))}
          </Grid>

          {
            <Grid container>
              <Grid item xs={12} md={6} lg={6}>
                <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}>
                  <CardContent>
                    {menus?.MenusWithProduct.map((menu, index) => {
                      if (index % 2 === 0) {
                        return (
                          <div key={menu.title}>
                            <Typography
                              variant="h6"
                              fontFamily="Dancing Script, cursive"
                              sx={{
                                color: theme.palette.primary.main,
                                my: 1,
                                fontWeight: 700,
                                fontSize: "40px",
                                paddingLeft: "17px",
                                lineHeight: "1.6",
                                marginBottom: "10px",
                              }}
                            >
                              {menu.title}
                            </Typography>
                            {menu.products.map((product) => (
                              <Grid item key={product._id}>
                                <Fade left>
                                  <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                      <Box>
                                        <Typography>{product.title}</Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={1} textAlign="center">
                                      <ArrowRightIcon
                                        sx={{
                                          color: theme.palette.primary.main,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={5} textAlign="center">
                                      <Typography>
                                        {product.dailyMenuSizeWithPrice &&
                                        product.dailyMenuSizeWithPrice.length >
                                          0
                                          ? product.dailyMenuSizeWithPrice.map(
                                              (sizePrice, index) => {
                                                return (
                                                  <span key={index}>
                                                    {sizePrice.size}/ $
                                                    {sizePrice.price.toFixed(2)}
                                                    {index !==
                                                      product
                                                        .dailyMenuSizeWithPrice
                                                        .length -
                                                        1 && ", "}
                                                  </span>
                                                );
                                              }
                                            )
                                          : ""}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Fade>
                              </Grid>
                            ))}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}>
                  <CardContent>
                    {menus?.MenusWithProduct.map((menu, index) => {
                      if (index % 2 !== 0) {
                        return (
                          <div key={menu.title}>
                            <Typography
                              variant="h6"
                              fontFamily="Dancing Script, cursive"
                              sx={{
                                color: theme.palette.primary.main,
                                my: 1,
                                fontWeight: 700,
                                fontSize: "40px",
                                paddingLeft: "17px",
                                lineHeight: "1.6",
                                marginBottom: "10px",
                              }}
                            >
                              {menu.title}
                            </Typography>
                            {menu.products.map((product) => (
                              <Grid
                                item
                                key={product._id}
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                              >
                                <Fade left>
                                  <Grid
                                    container
                                    justifyContent="space-evenly"
                                    alignItems="center"
                                  >
                                    <Grid item xs={8}>
                                      <Box>
                                        <Typography>{product.title}</Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={1} textAlign="center">
                                      <ArrowRightIcon
                                        sx={{
                                          color: theme.palette.primary.main,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={3} textAlign="center">
                                      <Typography>
                                        {product.dailyMenuSizeWithPrice &&
                                        product.dailyMenuSizeWithPrice.length >
                                          0
                                          ? product.dailyMenuSizeWithPrice.map(
                                              (sizePrice, index) => (
                                                <span key={index}>
                                                  {sizePrice.size}/ $
                                                  {sizePrice.price.toFixed(2)}
                                                  {index !==
                                                    product
                                                      .dailyMenuSizeWithPrice
                                                      .length -
                                                      1 && ", "}
                                                </span>
                                              )
                                            )
                                          : ""}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Fade>
                              </Grid>
                            ))}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          }
        </Box>
      </Container>
    </div>
  );
};

export default Menus;
