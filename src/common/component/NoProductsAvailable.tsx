import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StoreIcon from "@mui/icons-material/Store";

function NoProductsAvailable() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{
        height: "60vh",
        overflow: "hidden",
      }}
    >
      <StoreIcon sx={{ fontSize: "5rem", opacity: 0.5 }}></StoreIcon>
      <Typography sx={{ opacity: 0.5 }}>No products available</Typography>
    </Box>
  );
}

export default NoProductsAvailable;
