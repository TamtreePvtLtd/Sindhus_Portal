// // Categories.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetAllDiningOutMenuDatas } from "../../customRQHooks/Hooks";
// import { ICategory } from "../../interface/types";
// import NoProductsAvailable from "../../common/component/NoProductsAvailable";
// import PageBanner from "../../common/component/pageBanner";
// import { Grid, Box, Typography } from "@mui/material";

// interface IProps {
//   onSubMenuClick(submenuId: string): void;
//   selectedSubMenuId: string;
// }

// function Categories({ onSubMenuClick, selectedSubMenuId }: IProps) {
//   const [categories, setCategories] = useState<ICategory[]>([]);
//   const navigate = useNavigate();
//   const { data } = useGetAllDiningOutMenuDatas();

//   useEffect(() => {
//     if (data) {
//       setCategories([...data]);
//     }
//   }, [data]);

//   const handleClickProduct = (menuId: string) => {
//     onSubMenuClick(menuId); // Call the prop function to update selected menu ID
//     navigate(`/dailyMenu/${menuId}`);
//   };

//   return (
//     <>
//       <Box>
//         <PageBanner
//           imageUrl="assets/Menuimage.jpg"
//           content="Daily Menu"
//           description="Delight in our globally inspired dishes, crafted with locally sourced ingredients for an unforgettable culinary experience."
//         />
//       </Box>
//       <Grid
//         container
//         justifyContent="center"
//         spacing={4}
//         sx={{ marginTop: "5px" }}
//       >
//         <Grid item>
//           <Box
//             onClick={() => handleClickProduct("")}
//             sx={{
//               textAlign: "center",
//               cursor: "pointer",
//             }}
//           >
//             <Typography> All </Typography>
//           </Box>
//         </Grid>
//         {categories.map((category) => (
//           <Grid
//             item
//             key={category._id}
//             xs={6}
//             sm={4}
//             md={3}
//             lg="auto"
//             sx={{ paddingTop: "25px !important" }}
//           >
//             <Box
//               onClick={() => handleClickProduct(category._id)}
//               sx={{
//                 textAlign: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <Typography>{category.title}</Typography>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//       {categories.length === 0 && <NoProductsAvailable />}
//     </>
//   );
// }

// export default Categories;

// Categories.tsx

import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import { ICategory, ICategoryTitleDispay } from "../../interface/types";
import { useEffect, useState } from "react";

interface IProps {
  onSubMenuClick(submenuId: string): void;
  categories: ICategory[];
  selectedSubMenuId?: string;
}

function Categories({ onSubMenuClick, categories, selectedSubMenuId }: IProps) {
  console.log(categories);

  const [loadedCategories, setLoadedCategories] =
    useState<ICategory[]>(categories); // State for loaded categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // State for selected category ID

  useEffect(() => {
    setLoadedCategories(categories);
  }, [categories]);

  return (
    <>
      {loadedCategories && loadedCategories.length > 0 && (
        <Grid
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          columnGap={4}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: selectedSubMenuId === "" ? 700 : 500,
                color:
                  selectedSubMenuId === "" ? "text.primary" : "text.disabled",
                borderBottom:
                  selectedSubMenuId === "" ? "1px solid #038265" : "none",
                textDecorationColor:
                  selectedSubMenuId === "" ? "#038265" : "none",
                textDecorationThickness: "1.5px",
                textDecorationStyle: "solid",
                display: "inline-block",
                fontFamily: "revert-layer",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: "2",
              }}
              onClick={() => onSubMenuClick("")}
            >
              All
            </Typography>
          </Box>

          {loadedCategories.map((category) => (
            <Box key={category._id}>
              <Typography
                sx={{
                  fontWeight: selectedSubMenuId === category._id ? 700 : 500,
                  color:
                    selectedSubMenuId === category._id
                      ? "text.primary"
                      : "text.disabled",
                  borderBottom:
                    selectedSubMenuId === category._id
                      ? "1px solid #038265"
                      : "none",
                  margin: 0,
                  lineHeight: "2",
                  fontFamily: "revert-layer",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  display: "inline-block",
                  textDecoration: "none",
                  "&:hover": {
                    color: "black",
                  },
                }}
                onClick={() => onSubMenuClick(category._id)}
              >
                {category.title}
              </Typography>
            </Box>
          ))}
        </Grid>
      )}
    </>
  );
}

export default Categories;
