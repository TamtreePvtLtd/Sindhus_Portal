// import {
//   Box,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   useTheme,
//   Divider,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useGetAllMenuType3 } from "../../customRQHooks/Hooks";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import Fade from "react-reveal";
// import PageBanner from "../../common/component/pageBanner";
// import NoProductsAvailable from "../../common/component/NoProductsAvailable";
// import { IMenuDatas } from "../../interface/types";

// const Menus = () => {
//   const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();
//   const theme = useTheme();
//   const [hoveredMenuId, setHoveredMenuId] = useState<null | string>(null);

//   const handleMenuClick = (menuId: string | undefined) => {
//     setSelectedMenuId(menuId);
//   };

//   const { data: menus, refetch } = useGetAllMenuType3(selectedMenuId!);
//   console.log(menus);

//   useEffect(() => {
//     if (!selectedMenuId && menus ) {
//       setSelectedMenuId("");
//     }
//   }, [menus, selectedMenuId]);

//   return (
//     <div>
//       <Box>
//         <PageBanner
//           imageUrl="public/assets/sindhu-kitchen.avif"
//           content="Our Menu"
//           description="The following is a list of the foods available in our restaurant!"
//         />
//       </Box>
//       <Container>
//         <Box sx={{ paddingTop: "60px" }}>
//           <Grid
//             container
//             spacing={1}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "flex-start",
//             }}
//           >
//             <Box>
//               <Fade left>
//                 <Typography
//                   style={{
//                     lineHeight: "2",
//                     marginBottom: "10px",
//                     fontFamily: "revert-layer",
//                     fontWeight: 700,
//                     fontSize: "1.2rem",
//                     textTransform: "uppercase",
//                     cursor: "pointer",
//                     color:
//                       selectedMenuId === "" || selectedMenuId === undefined
//                         ? theme.palette.primary.main
//                         : "inherit",
//                   }}
//                   onClick={() => handleMenuClick(undefined)}
//                 >
//                   All
//                 </Typography>
//               </Fade>
//             </Box>
//             {Array.isArray(menus) &&
//               menus.map((menu) => (
//                 <Grid
//                   item
//                   key={menu.title}
//                   columnGap={4}
//                   xs={"auto"}
//                   sm={3}
//                   md={3}
//                   lg={"auto"}
//                 >
//                   <Box
//                     sx={{
//                       gap: 4,
//                       marginTop: "5px",
//                       textAlign: "center",
//                       paddingX: "20px",
//                       cursor: "pointer",
//                       color:
//                         selectedMenuId === menu._id ||
//                         hoveredMenuId === menu._id
//                           ? theme.palette.primary.main
//                           : "text.disabled",
//                       "&:hover": {
//                         borderBottom: "1.5px solid #038265",
//                       },
//                     }}
//                     onClick={() => handleMenuClick(menu._id)}
//                     onMouseEnter={() => setHoveredMenuId(menu._id)}
//                     onMouseLeave={() => setHoveredMenuId(null)}
//                   >
//                     <Box>
//                       <Fade left>
//                         <Typography
//                           style={{
//                             lineHeight: "2",
//                             marginBottom: "10px",
//                             fontFamily: "revert-layer",
//                             fontWeight: 700,
//                             fontSize: "1.2rem",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           {menu.title}
//                         </Typography>
//                       </Fade>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//           </Grid>
//           <Divider sx={{ marginTop: "50px" }} />

//           {selectedMenuId && (
//             <Grid container spacing={2}>
//               <Grid item xs={8}>
//                 <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: "none" }}>
//                   <CardContent>
//                     <Typography
//                       variant="h4"
//                       gutterBottom
//                       style={{
//                         color: theme.palette.primary.main,
//                         fontFamily: '"Lucida Handwriting", cursive',
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {/* {menus?.find((m) => m._id === selectedMenuId)?.title} */}
//                     </Typography>
//                     {menus &&
//                       menus?.products // .find((m) => m._id === selectedMenuId)
//                         .map((product) => (
//                           <Grid
//                             item
//                             key={product._id}
//                             xs={12}
//                             sm={12}
//                             md={12}
//                             lg={12}
//                           >
//                             <Fade left>
//                               <Grid
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "space-evenly",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Grid item xs={8}>
//                                   <Box>
//                                     <Typography variant="h6">
//                                       {product.title}
//                                     </Typography>
//                                   </Box>
//                                 </Grid>
//                                 <Grid item xs={1} sx={{ textAlign: "center" }}>
//                                   <ArrowRightIcon
//                                     sx={{ color: theme.palette.primary.main }}
//                                   />
//                                 </Grid>
//                                 <Grid
//                                   item
//                                   xs={3}
//                                   style={{ textAlign: "center" }}
//                                 >
//                                   <Typography variant="h6">
//                                     {product.dailyMenuSizeWithPrice &&
//                                     product.dailyMenuSizeWithPrice.length > 0
//                                       ? `$${product.dailyMenuSizeWithPrice[0].price.toFixed(
//                                           2
//                                         )}`
//                                       : ""}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                             </Fade>
//                           </Grid>
//                         ))}
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={4}></Grid>
//             </Grid>
//           )}
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default Menus;

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
import { useGetAllMenuType3 } from "../../customRQHooks/Hooks";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Fade from "react-reveal";
import PageBanner from "../../common/component/pageBanner";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import { IMenuDatas } from "../../interface/types";

const Menus = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();
  const theme = useTheme();
  const [hoveredMenuId, setHoveredMenuId] = useState<null | string>(null);

  const handleMenuClick = (menuId: string | undefined) => {
    setSelectedMenuId(menuId);
  };

  const { data: menus, refetch } = useGetAllMenuType3(selectedMenuId!);
  console.log(menus);

  useEffect(() => {
    if (!selectedMenuId && menus) {
      setSelectedMenuId("");
    }
  }, [menus, selectedMenuId]);

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
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
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
                    cursor: "pointer",
                    color:
                      selectedMenuId === "" || selectedMenuId === undefined
                        ? theme.palette.primary.main
                        : "inherit",
                  }}
                  onClick={() => handleMenuClick(undefined)}
                >
                  All
                </Typography>
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
                    gap: 4,
                    marginTop: "5px",
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
          <Divider sx={{ marginTop: "50px" }} />

          {selectedMenuId && Array.isArray(menus) && (
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
                      {/* {menus?.find((m) => m._id === selectedMenuId)?.title} */}
                    </Typography>
                    {menus
                      .find((m) => m._id === selectedMenuId)
                      ?.products?.map((product) => (
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
                                </Box>
                              </Grid>
                              <Grid item xs={1} sx={{ textAlign: "center" }}>
                                <ArrowRightIcon
                                  sx={{ color: theme.palette.primary.main }}
                                />
                              </Grid>
                              <Grid item xs={3} style={{ textAlign: "center" }}>
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
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Menus;
