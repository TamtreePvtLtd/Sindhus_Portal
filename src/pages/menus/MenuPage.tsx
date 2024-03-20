import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { ICategory } from "../../interface/types";
import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import Menus from "./Menus";
import { useGetAllDiningOutProducts } from "../../customRQHooks/Hooks";
import theme from "../../theme/theme";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function MenuPage() {
  const categoryWithProducts = useGetAllDiningOutProducts();

  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedCategory, setselectedCategory] = useState<ICategory | null>(
    null
  );

  console.log(selectedMenuId);

  const onSubMenuClick = (subMenuId: string) => {
    setSelectedMenuId(subMenuId);
    setselectedCategory(null);
  };

  useEffect(() => {
    if (selectedMenuId) {
      const selectedCategory = categoryWithProducts.data?.find(
        (category) => category.menuDatas._id === selectedMenuId
      );

      setselectedCategory(selectedCategory || null);
    }
  }, [selectedMenuId]);
  console.log(selectedCategory);

  return (
    <>
      <Menus
        categories={categoryWithProducts.data?.map((category) => ({
          _id: category.menuDatas._id,
          title: category.menuDatas.title,
        }))}
        onSubMenuClick={onSubMenuClick}
        selectedSubMenuId={selectedMenuId}
      />

      <Box sx={{ margin: "0 10%" }}>
        <Box>
          <Typography
            variant="h6"
            fontFamily="Dancing Script, cursive"
            sx={{
              color: theme.palette.primary.main,
              my: 1,
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "1.6",
              display: "flex",
              justifyContent: "start",
            }}
          >
            {selectedMenuId && selectedCategory?.menuDatas?.title}
          </Typography>

          <Grid container spacing={2} sx={{ marginBottom: "18px" }}>
            {(!selectedMenuId || selectedMenuId === "") &&
              categoryWithProducts.isSuccess &&
              categoryWithProducts.data?.map((category, index) => (
                <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                  <Card
                    sx={{
                      maxWidth: 700,
                      margin: "auto",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontFamily="Dancing Script, cursive"
                        sx={{
                          lineHeight: "2",
                          fontSize: "35px",
                          fontWeight: "bold",
                          display: "inline-block",
                          textDecoration: "none",
                          textWrap: "wrap",
                          color: theme.palette.primary.main,

                          "&:hover": {
                            color: "black",
                          },
                          "@media (max-width: 600px)": {
                            display: "block",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                          },
                        }}
                      >
                        {category.menuDatas.title}
                      </Typography>

                      {category.menuDatas.products.map(
                        (product, productIndex) => (
                          <Grid item key={product._id}>
                            <Grid container alignItems="center">
                              <Grid item xs={5} sm={5.2} md={4}>
                                <Box
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  flexWrap={"wrap"}
                                >
                                  <Typography>{product.title}</Typography>
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={1}
                                md={1}
                                sm={1}
                                lg={1}
                                textAlign="center"
                              >
                                .....
                              </Grid>
                              <Grid item xs={6} sm={5} md={4}>
                                <Typography>
                                  {product.dailyMenuSizeWithPrice &&
                                  product.dailyMenuSizeWithPrice.length > 0
                                    ? product.dailyMenuSizeWithPrice.map(
                                        (sizePrice, priceIndex) => (
                                          <span key={priceIndex}>
                                            {sizePrice.size}/ ${" "}
                                            {sizePrice.price.toFixed(2)}
                                            {priceIndex !==
                                              product.dailyMenuSizeWithPrice
                                                .length -
                                                1 && ", "}
                                          </span>
                                        )
                                      )
                                    : ""}
                                </Typography>
                                <Typography>
                                  {product.itemSizeWithPrice &&
                                  product.itemSizeWithPrice.length > 0
                                    ? product.itemSizeWithPrice.map(
                                        (sizePrice, priceIndex) => (
                                          <span key={priceIndex}>
                                            {sizePrice.size}/ ${" "}
                                            {sizePrice.price.toFixed(2)}
                                            {priceIndex !==
                                              product.itemSizeWithPrice.length -
                                                1 && ", "}
                                          </span>
                                        )
                                      )
                                    : ""}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            {selectedCategory &&
              selectedCategory.menuDatas &&
              selectedCategory.menuDatas.products.map((product, index) => (
                <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
                  <Grid container justifyContent={"start"}>
                    <Grid item xs={6} sm={4} md={2}>
                      <Box>
                        <Typography>{product.title}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={1} md={2} sm={4} lg={1} textAlign="center">
                      .....
                    </Grid>
                    <Grid item xs={5} md={4} sm={7} textAlign="start">
                      <Typography>
                        {product.dailyMenuSizeWithPrice &&
                        product.dailyMenuSizeWithPrice.length > 0
                          ? product.dailyMenuSizeWithPrice.map(
                              (sizePrice, priceIndex) => (
                                <span key={priceIndex}>
                                  {sizePrice.size}/ ${" "}
                                  {sizePrice.price.toFixed(2)}
                                  {priceIndex !==
                                    product.dailyMenuSizeWithPrice.length - 1 &&
                                    ", "}
                                </span>
                              )
                            )
                          : ""}
                      </Typography>
                      <Typography>
                        {product.itemSizeWithPrice &&
                        product.itemSizeWithPrice.length > 0
                          ? product.itemSizeWithPrice.map(
                              (sizePrice, priceIndex) => (
                                <span key={priceIndex}>
                                  {sizePrice.size}/ ${" "}
                                  {sizePrice.price.toFixed(2)}
                                  {priceIndex !==
                                    product.itemSizeWithPrice.length - 1 &&
                                    ", "}
                                </span>
                              )
                            )
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default MenuPage;
