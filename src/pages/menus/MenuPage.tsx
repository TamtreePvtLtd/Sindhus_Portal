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

      <Container>
        <Box sx={{ padding: "25px" }}>
          <Typography
            variant="h6"
            fontFamily="Dancing Script, cursive"
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              color: theme.palette.primary.main,
              my: 1,
              fontWeight: 700,
              fontSize: "40px",
              paddingLeft: "17px",
              lineHeight: "1.6",
              marginBottom: "10px",
              width: "40px",
            }}
          >
            {selectedMenuId && selectedCategory?.menuDatas?.title}
          </Typography>
          <Grid container spacing={2}>
            {selectedMenuId === "" &&
              categoryWithProducts.isSuccess &&
              categoryWithProducts.data?.map((category, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card
                    sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h56"
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
                              <Grid item xs={5}>
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
                                textAlign="center"
                                alignItems={"center"}
                                justifyContent={"center"}
                              >
                                
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  sx={{
                                    textWrap: "wrap",
                                  }}
                                >
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
                <Grid item xs={12} key={index}>
                  <Grid container justifyContent={"flex-start"}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography>{product.title}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={1} md={1} textAlign="center">
                      <ArrowRightIcon
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      />
                    </Grid>
                    <Grid item xs={5} textAlign="center">
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
                    </Grid>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default MenuPage;
