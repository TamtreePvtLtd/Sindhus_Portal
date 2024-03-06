import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
    Divider,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import {
    useGetAllMenus,
    useGetFetchProductsByMenuId,
  } from "../../customRQHooks/Hooks";
  import ArrowRightIcon from "@mui/icons-material/ArrowRight";
  import Fade from "react-reveal";
  import PageBanner from "../../common/component/pageBanner";
  import NoProductsAvailable from "../../common/component/NoProductsAvailable";
  
  const Menus = () => {
    const [selectedMenuId, setSelectedMenuId] = useState<string>();
    const theme = useTheme();
    const [hoveredMenuId, setHoveredMenuId] = useState<null | string>(null);
  
    const {
      data: menus,
      isLoading: menusLoading,
      isError: menusError,
    } = useGetAllMenus();
  
    const handleMenuClick = (menuId: string) => {
      setSelectedMenuId(menuId);
    };
  
    const getMenuItemsInAlphabeticalOrder = () => {
      return menus
        ? [...menus].sort((a, b) => a.title.localeCompare(b.title))
        : [];
    };
  
    useEffect(() => {
      if (!selectedMenuId && menus && menus.length > 0) {
        const firstMenuItemId = getMenuItemsInAlphabeticalOrder();
        setSelectedMenuId(firstMenuItemId[0]._id);
      }
    }, [menus, selectedMenuId]);
  
    const { data: productsData } = useGetFetchProductsByMenuId(selectedMenuId!);
  
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
          <Box sx={{ paddingTop: "60px" }}>
            {menusLoading && <p>Loading menus...</p>}
            {menusError && <p>Error fetching menus</p>}
  
            {menus && (
              <Grid
                container
                spacing={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {getMenuItemsInAlphabeticalOrder().map((menu) => (
                  <Grid
                    item
                    key={menu._id}
                    columnGap={4}
                    xs={"auto"}
                    sm={3}
                    md={3}
                    lg={"auto"}
                  >
                    <Box
                      sx={{
                        gap: 4,
                        marginTop: "5px",
                        textAlign: "center",
                        paddingX: "20px",
                        cursor: "pointer",
                        color:
                          selectedMenuId === menu._id ||
                          hoveredMenuId === menu._id
                            ? "text.primary"
                            : "text.disabled",
                        "&:hover": {
                          borderBottom:"1.5px solid #038265",
                        },
                      }}
                      onClick={() => handleMenuClick(menu._id)}
                      onMouseEnter={() => setHoveredMenuId(menu._id)}
                      onMouseLeave={() => setHoveredMenuId(null)}
                    >
                      <Box>
                        <Fade left>
                          <Typography
                            style={{
                              lineHeight: "2",
                              marginBottom: "10px",
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
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
            <Divider sx={{ marginTop: "50px" }} />
  
            {selectedMenuId && (
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        gutterBottom
                        style={{
                          color: theme.palette.primary.main,
                          fontFamily: '"Lucida Handwriting", cursive',
                          fontWeight: "bold",
                        }}
                      >
                        {menus?.find((m) => m._id === selectedMenuId)?.title}
                      </Typography>
                      {productsData &&
                      productsData.products &&
                      productsData.products.length > 0 ? (
                        <Grid container spacing={2}>
                          {productsData.products.map((product) => (
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
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                  }}
                                >
                                  <Grid item xs={8}>
                                    <Box>
                                      <Typography variant="h6">
                                        {product.title}
                                      </Typography>
                                      <Typography>
                                        {product.description}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={1} sx={{ textAlign: "center" }}>
                                    <ArrowRightIcon
                                      sx={{ color: theme.palette.primary.main }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ textAlign: "center" }}
                                  >
                                    <Typography variant="h6">
                                      {product.dailyMenuSizeWithPrice &&
                                      product.dailyMenuSizeWithPrice.length > 0
                                        ? `$${product.dailyMenuSizeWithPrice[0].price.toFixed(
                                            2
                                          )}`
                                        : ""}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Fade>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            height: "40vh",
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: 400,
                              textAlign: "center",
                              padding: 2,
                            }}
                          >
                            <NoProductsAvailable />
                          </Box>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  {productsData &&
                    productsData.products &&
                    productsData.products.length > 0 && (
                      <Fade right>
                        <Box
                          sx={{
                            position: "relative",
                            height: "100%",
                            textAlign: "center",
                            overflow: "hidden",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 6,
                          }}
                        >
                          {productsData.products && (
                            <img
                              src={productsData.products[0].posterURL}
                              width={"100%"}
                              height={"100%"}
                              alt={productsData.products[0].title}
                              loading="lazy"
                            />
                          )}
                        </Box>
                      </Fade>
                    )}
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </div>
    );
  };
  
  export default Menus;