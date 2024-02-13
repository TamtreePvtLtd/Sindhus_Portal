import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonProductCard from "../../common/component/CommonProductCard";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFetchProductsByMenuId } from "../../customRQHooks/Hooks";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import React from "react";

function CategoryProducts() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedCategory = useGetFetchProductsByMenuId(menuId ?? "");

  return (
    <>
      {selectedCategory && selectedCategory.data && (
        <Container
          sx={{
            position: "sticky",
            top: {
              xs: "71px",
            },
            zIndex: 1020,
            backgroundColor: "white",
            pt: 2,
            pl: 2,
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon fontSize="medium" />
            </IconButton>

            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                variant="h5"
              >
                {selectedCategory.data.title || ""}
              </Typography>
            </Box>
          </Box>
        </Container>
      )}
      <Box>
        {selectedCategory.data &&
        selectedCategory.data.products &&
        selectedCategory.data.products.length > 0 ? (
          <Container sx={{ padding: "20px", mt: 2, zIndex: -1 }}>
            <Grid container spacing={2}>
              {selectedCategory.data.products.map((product, index) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CommonProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Container>
        ) : (
          <NoProductsAvailable />
        )}
      </Box>
    </>
  );
}

export default CategoryProducts;
