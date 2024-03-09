// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import {
// //   useGetFetchProductsByMenuId,
// //   useGetAllDiningOutMenuDatas,
// // } from "../../customRQHooks/Hooks";
// // import CommonProductCard from "../../common/component/CommonProductCard";
// // import { Container, Grid } from "@mui/material";
// // import NoProductsAvailable from "../../common/component/NoProductsAvailable";
// // import Categories from "./Categories";

// // function CategoryProducts() {
// //   const { menuId } = useParams();
// //   const [selectedMenuId, setSelectedMenuId] = useState<string>(menuId || "");
// //   const selectedCategory = useGetFetchProductsByMenuId(selectedMenuId);
// //   const { data: snacksPageData } = useGetAllDiningOutMenuDatas();

// //   useEffect(() => {
// //     setSelectedMenuId(menuId || "");
// //   }, [menuId]);

// //   const handleSubMenuClick = (subMenuId: string) => {
// //     setSelectedMenuId(subMenuId);
// //   };

// //   return (
// //     <Container>
// //       <Categories
// //         onSubMenuClick={handleSubMenuClick}

// //         selectedSubMenuId={selectedMenuId}
// //       />
// //       {selectedCategory &&
// //       selectedCategory.data &&
// //       selectedCategory.data.products ? (
// //         <Grid container spacing={2}>
// //           {selectedCategory.data.products.map((product, index) => (
// //             <Grid
// //               item
// //               key={index}
// //               xs={12}
// //               sm={6}
// //               md={4}
// //               lg={3}
// //               sx={{ display: "flex", justifyContent: "center" }}
// //             >
// //               <CommonProductCard product={product} />
// //             </Grid>
// //           ))}
// //         </Grid>
// //       ) : (
// //         <NoProductsAvailable />
// //       )}
// //     </Container>
// //   );
// // }

// // export default CategoryProducts;

// import CommonProductCard from "../../common/component/CommonProductCard";

// import {
//   useGetAllDiningOutMenuDatas,
//   useGetSnacksProductsBySubMenuId,
// } from "../../customRQHooks/Hooks";
// import { useState, useEffect } from "react";
// import Rotate from "react-reveal/Rotate";
// import Fade from "react-reveal/Fade";
// import NoProductsAvailable from "../../common/component/NoProductsAvailable";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import useTheme from "@mui/material/styles/useTheme";
// import CommonSnacksCard from "../../common/component/CommonSnacksCard";
// import PageBanner from "../../common/component/pageBanner";
// import Categories from "./Categories";

// function CategoryProducts() {
//   const [selectedSubMenuId, setSelectedSubMenuId] = useState<string>("");

//   const theme = useTheme();
//   const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const { data: snacksPageData, refetch: refetchSnacks } =
//     useGetAllDiningOutMenuDatas();
//   console.log(snacksPageData);

//   useEffect(() => {
//     refetchSnacks();
//   }, [selectedSubMenuId]);

//   const handleSubMenuClick = (subMenuId: string) => {
//     setSelectedSubMenuId(subMenuId);
//   };

//   return (
//     <>
//       <Box>
//         <PageBanner
//           imageUrl="assets/images/snacks-banner-image.jpg"
//           content="Snacks"
//           description="Indulge in India's Irresistible Snack Delights - Flavorful, Spicy, and Simply Irresistible!"
//         />
//       </Box>
//       {/* <Typography
//         variant="h4"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           color: "#57ccb5",
//           padding: "20px",
//           fontWeight: 600,
//         }}
//       >
//         Snacks
//       </Typography> */}

//       <Container
//         sx={{
//           marginTop: "10px",
//           p: 2,
//         }}
//       >
//         <Categories
//           onSubMenuClick={handleSubMenuClick}
//           categories={snacksPageData?.categories ?? []}
//           selectedSubMenuId={selectedSubMenuId}
//         ></Categories>
//         <Box sx={{ mt: 5 }}>
//           {snacksPageData && snacksPageData.length > 0 ? (
//             <Grid container spacing={5}>
//               {snacksPageData.map((category) => (
//                 <Box key={category._id}>
//                   {category.products.map((product) => (
//                     <Grid item xs={12} sm={4} md={3} lg={2.4} key={product._id}>
//                       <CommonSnacksCard product={product} />
//                     </Grid>
//                   ))}
//                 </Box>
//               ))}
//             </Grid>
//           ) : (
//             <NoProductsAvailable />
//           )}
//         </Box>
//       </Container>
//     </>
//   );
// }

// export default CategoryProducts;
