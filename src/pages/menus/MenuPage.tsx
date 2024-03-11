// import Carousel from "../../common/component/Carousal";
// import Box from "@mui/material/Box";
// import { useEffect, useState } from "react";
// import { ICategory } from "../../interface/types";
// import CommonProductCard from "../../common/component/CommonProductCard";
// import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
// import Menus from "./Menus";
// import { useGetAllDiningOutProducts } from "../../customRQHooks/Hooks";
// import theme from "../../theme/theme";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// function MenuPage() {
//   const categoryWithProducts = useGetAllDiningOutProducts();
//   console.log(categoryWithProducts);

//   const [selectedMenuId, setSelectedMenuId] = useState<string>("");
//   const [selectedCategory, setselectedCategory] = useState<ICategory | []>([]);

//   const onSubMenuClick = (subMenuId: string) => {
//     setSelectedMenuId(subMenuId);
//     console.log(subMenuId);
//   };

//   useEffect(() => {
//     if (selectedMenuId) {
//       const selectedCategory = categoryWithProducts.data?.find(
//         (category) => category.menuDatas._id === selectedMenuId
//       );

//       setselectedCategory(selectedCategory);
//     }
//   }, [selectedMenuId]);
//   console.log(selectedCategory);

//   return (
//     <>
//       <Menus
//         categories={categoryWithProducts.data?.map((category) => ({
//           _id: category.menuDatas._id,
//           title: category.menuDatas.title,
//         }))}
//         onSubMenuClick={onSubMenuClick}
//         selectedSubMenuId={selectedMenuId}
//       />

//       {selectedMenuId === "" ? (
//         categoryWithProducts.isSuccess &&
//         categoryWithProducts.data.map((category, index) => (
//           <Box key={index}>
//             <Grid container>
//               <Grid item xs={12} md={6} lg={6}>
//                 <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}>
//                   <CardContent>
//                     <Typography
//                       variant="h6"
//                       fontFamily="Dancing Script, cursive"
//                       sx={{
//                         color: theme.palette.primary.main,
//                         my: 1,
//                         fontWeight: 700,
//                         fontSize: "40px",
//                         paddingLeft: "17px",
//                         lineHeight: "1.6",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       {category.menuDatas.title}
//                     </Typography>
//                     {category.menuDatas.products.map((product, productIndex) => (
//                       <Grid item key={product._id} xs={12} md={6}>
//                         <Grid container alignItems="center">
//                           <Grid item xs={6}>
//                             <Box>
//                               <Typography>{product.title}</Typography>
//                             </Box>
//                           </Grid>
//                           <Grid item xs={1} md={1} textAlign="center">
//                             <ArrowRightIcon
//                               sx={{
//                                 color: theme.palette.primary.main,
//                               }}
//                             />
//                           </Grid>
//                           <Grid item xs={5} md={5} textAlign="center">
//                             <Typography>
//                               {product.dailyMenuSizeWithPrice &&
//                                 product.dailyMenuSizeWithPrice.length > 0
//                                 ? product.dailyMenuSizeWithPrice.map(
//                                   (sizePrice, priceIndex) => (
//                                     <span key={priceIndex}>
//                                       {sizePrice.size}/ ${" "}
//                                       {sizePrice.price.toFixed(2)}
//                                       {priceIndex !==
//                                         product.dailyMenuSizeWithPrice.length -
//                                         1 && ", "}
//                                     </span>
//                                   )
//                                 )
//                                 : ""}
//                             </Typography>
//                           </Grid>
//                         </Grid>
//                       </Grid>
//                     ))}
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Box>
//         ))
//       ) : (
//         <Container>
//           {selectedCategory && selectedCategory.menuDatas && (
//             <Box sx={{ padding: "25px" }}>
//               <Typography variant="h6">
//                 {selectedCategory.menuDatas.title}
//               </Typography>
//               <Grid container spacing={2}>
//                 {selectedCategory.menuDatas.products.map((product, index) => (
//                   <Grid item xs={12} key={index}>
//                     <Grid container alignItems="center">
//                       <Grid item xs={6}>
//                         <Box>
//                           <Typography>{product.title}</Typography>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           )}
//         </Container>
//       )}
//     </>
//   );
// }

// export default MenuPage;

import Carousel from "../../common/component/Carousal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { ICategory } from "../../interface/types";
import CommonProductCard from "../../common/component/CommonProductCard";
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
            }}
          >
            {selectedMenuId && selectedCategory?.menuDatas?.title}
          </Typography>
          <Grid container spacing={2}>
            {selectedMenuId === "" &&
              categoryWithProducts.isSuccess &&
              categoryWithProducts.data?.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}
                  >
                    <CardContent>
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
                        {category.menuDatas.title}
                      </Typography>

                      {category.menuDatas.products.map(
                        (product, productIndex) => (
                          <Grid item key={product._id}>
                            <Grid container alignItems="center">
                              <Grid item xs={5}>
                                <Box>
                                  <Typography>{product.title}</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={1} md={1} textAlign="center">
                                .....
                              </Grid>
                              <Grid item xs={6} textAlign="center">
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
                  <Grid container alignItems="center">
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
