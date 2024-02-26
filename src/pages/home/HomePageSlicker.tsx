import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IMenuList, IProductDropDownData } from "../../interface/types";
import { useEffect, useState } from "react";
import { useGetAllDailyMenus } from "../../customRQHooks/Hooks";
import { homePageSlicker } from "../../seed-data/seed-data";
import Fade from "react-reveal/Fade";
import { getProductsByMenuIdWithSearchTerm } from "../../services/api";
import { Link } from "react-router-dom";
import { paths } from "../../routes/path";

function HomePageSlicker() {
  const theme = useTheme();
  const isBelowMediumSize = useMediaQuery(theme.breakpoints.down("md"));
  const [menus, setMenus] = useState<IMenuList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [products, setProducts] = useState<IProductDropDownData[]>([]);

  const { data: menuData, isLoading, isError } = useGetAllDailyMenus();

  useEffect(() => {
    if (!isLoading && !isError) {
      setMenus(menuData);
    }
  }, [menuData, isLoading, isError]);

  useEffect(() => {
    let timeoutId = 0;

    if (!selectedMenuId && !!searchTerm) {
      timeoutId = setTimeout(() => {
        fetchProducts(selectedMenuId, searchTerm);
      }, 1000);
    } else {
      fetchProducts(selectedMenuId, searchTerm);
    }

    return () => clearTimeout(timeoutId);
  }, [selectedMenuId, searchTerm]);

  const fetchProducts = async (
    menuId: string = "",
    searchTerm: string = ""
  ) => {
    try {
      let response;

      if (searchTerm.length < 3 && !menuId) {
        response = await getProductsByMenuIdWithSearchTerm("", "");
      } else {
        response = await getProductsByMenuIdWithSearchTerm(menuId, searchTerm);
      }

      if (response && response.data) {
        const products: IProductDropDownData[] = response.data.map(
          (product) => ({
            _id: product._id,
            title: product.title,
            posterURL: product.posterURL,
          })
        );

        setProducts(products);
      } else {
        setProducts([]);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductSearch = (_event) => {
    const newSearchTerm = _event.target.value;
    setSearchTerm(newSearchTerm || "");
  };

  const handleMenuChange = (_event, newValue: IMenuList | null) => {
    setSearchTerm("");
    if (newValue) {
      setSelectedMenuId(newValue._id);
    } else {
      setSelectedMenuId("");
    }
  };

  useEffect(() => {
    if (!selectedMenuId && !isLoading && !isError) {
      setMenus(menuData);
    }
  }, [menuData, isLoading, isError]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box className="page-banner" style={{ position: "relative" }}>
        <img
          src={homePageSlicker.image}
          alt={homePageSlicker.heading}
          height="350px"
          width="100%"
          className="home-slicker-image"
          style={{ objectFit: "cover" }}
        />
        <Container
          sx={{
            position: "absolute",
            top: isBelowMediumSize ? "50%" : "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 2,
            width: "100%",
          }}
        >
          <Fade top>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bolder",
                fontSize: isBelowMediumSize ? "30px" : "54px",
                lineHeight: "1",
                color: "#57ccb5",
                fontFamily: "sindhus-logo-font",
              }}
            >
              {homePageSlicker.heading}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bolder",
                fontSize: isBelowMediumSize ? "18px" : "20px",
              }}
            >
              {homePageSlicker.subHeading}
            </Typography>
            <Typography
              sx={{
                fontSize: isBelowMediumSize ? "16px" : "18px",
                fontWeight: "300",
              }}
            >
              {homePageSlicker.content}
            </Typography>
          </Fade>

          <Box
            sx={{
              // position: "absolute",
              // top: isBelowMediumSize ? "60%" : "70%",
              paddingTop: "30px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: isBelowMediumSize ? "70%" : "50%",
              }}
            >
              <Grid
                item
                md={5}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: isBelowMediumSize ? "10px" : "10px 0 0 10px",
                  height: "50px",
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="menu">
                  <RestaurantIcon color="secondary" />
                </IconButton>
                <Autocomplete
                  disablePortal
                  sx={{ width: "100%" }}
                  options={menus.map((item) => ({
                    ...item,
                    label: item.title,
                  }))}
                  onChange={(event, newValue) => {
                    handleMenuChange(event, newValue!);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.title == value.title
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Menus"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                      fullWidth
                      variant="standard"
                    />
                  )}
                  renderOption={(props, option) => (
                    <ListItem
                      disablePadding
                      component={"li"}
                      {...props}
                      key={option._id}
                    >
                      <ListItemText>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {option.title}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  )}
                />
              </Grid>
              <Grid
                item
                md={7}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  marginTop: isBelowMediumSize ? "5px" : 0,
                  borderRadius: isBelowMediumSize ? "10px" : "0 10px 10px 0",
                  height: "50px",
                }}
              >
                <Divider
                  sx={{
                    height: 28,
                    m: 0.5,
                    display: isBelowMediumSize ? "none" : "block",
                  }}
                  orientation="vertical"
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon color="secondary" />
                </IconButton>
                <Autocomplete
                  sx={{ width: "100%" }}
                  onChange={handleProductSearch}
                  options={products.map((item) => ({
                    ...item,
                    label: item.title,
                  }))}
                  onInputChange={(_event, newInputValue) => {
                    if (!newInputValue.trim()) {
                      setSearchTerm("");
                    }
                  }}
                  renderOption={(props, option) => (
                    <Link
                      to={`/detail/${option._id}`}
                      state={{ previousPath: paths.DAILYMENU }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      key={option._id}
                    >
                      <li
                        {...props}
                        style={{
                          margin: "5px 0",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={option.posterURL ?? ""}
                          style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {option.title}
                        </Typography>
                      </li>
                    </Link>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Your favorite snacks, food, etc..."
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        onChange: (event) => {
                          const newSearchTerm = event.target.value;
                          setSearchTerm(newSearchTerm || "");
                        },
                      }}
                      fullWidth
                      variant="standard"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePageSlicker;
