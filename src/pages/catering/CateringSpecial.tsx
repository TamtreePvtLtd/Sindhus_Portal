import { Box, Card, Container, Grid, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import theme from "../../theme/theme";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { CateringSpecialEnum } from "../../enums/CateringSpecialEnum";
import { cateringSpecialData } from "../../seed-data/seed-data";

function CateringSpecial() {
  const CateringSpecialItem = ({ title, description, icon }) => (
    <Box mb={3}>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e8f8f7",
          boxShadow: 2,
          borderRadius: "10px",
        }}
        elevation={0}
      >
        {icon}
        <Box sx={{mr:2}}>
          <Typography variant="h6">{title}</Typography>
          <Typography>{description}</Typography>
        </Box>
      </Card>
    </Box>
  );

  const iconStyles = {
    color: theme.palette.primary.main,
    fontSize: "8rem",
    p: 4,
  };

  const CateringSpecialList = [
    {
      id: CateringSpecialEnum.WATERDROPICON,
      icon: <WaterDropIcon sx={iconStyles} />,
    },
    {
      id: CateringSpecialEnum.OILBARRELICON,
      icon: <OilBarrelIcon sx={iconStyles} />,
    },
    {
      id: CateringSpecialEnum.RESTAURANTMENUICON,
      icon: <RestaurantMenuIcon sx={iconStyles} />,
    },
    {
      id: CateringSpecialEnum.OUTDOORGRILLICON,
      icon: <OutdoorGrillIcon sx={iconStyles} />,
    },
  ];

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item lg={4} xs={12}>
          {cateringSpecialData.slice(0, 2).map((special) => (
            <CateringSpecialItem
              key={special.id}
              {...special}
              icon={
                CateringSpecialList.find((item) => item.id === special.iconkey)
                  ?.icon
              }
            />
          ))}
        </Grid>
        <Grid item lg={4} xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <img
              src="/assets/cateringImage2.jpg"
              alt="catering"
              height={"240px"}
              style={{ borderRadius: "20%" }}
            />
          </Box>
        </Grid>
        <Grid item lg={4} xs={12}>
          {cateringSpecialData.slice(2, 4).map((special) => (
            <CateringSpecialItem
              key={special.id}
              {...special}
              icon={
                CateringSpecialList.find((item) => item.id === special.iconkey)
                  ?.icon
              }
            />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default CateringSpecial;
