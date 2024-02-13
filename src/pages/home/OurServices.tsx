import RestaurantIcon from "@mui/icons-material/Restaurant";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import { OurServicesIconEnums } from "../../enums/OurServicesIconEnum";
import { IOurServices } from "../../interface/types";
import { useOurServicesStyles } from "../../styles/OurServicesStyles";
import Fade from "react-reveal/Fade";
import Bounce from "react-reveal/Bounce";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

interface Iprops {
  OurServices: IOurServices[];
}

function OurServices(props: Iprops) {
  const { OurServices } = props;
  const classes = useOurServicesStyles();
  const OurServiceslist = [
    {
      id: OurServicesIconEnums.RESTAURANT,
      icon: (
        <RestaurantIcon
          className={classes.boxStyle}
          sx={{
            fontSize: "12rem",
            color: "purple",
            p: 4,
          }}
        />
      ),
    },
    {
      id: OurServicesIconEnums.SOUPKITCHENICON,
      icon: (
        <SoupKitchenIcon
          className={classes.boxStyle}
          sx={{
            fontSize: "12rem",
            color: "red",
            p: 4,
          }}
        />
      ),
    },
    {
      id: OurServicesIconEnums.RESTAURANTMENUICON,
      icon: (
        <RestaurantMenuIcon
          className={classes.boxStyle}
          sx={{ fontSize: "12rem", color: "orange", p: 4 }}
        />
      ),
    },
    {
      id: OurServicesIconEnums.RAMENDININGICON,
      icon: (
        <RamenDiningIcon
          className={classes.boxStyle}
          sx={{
            fontSize: "12rem",
            color: "green",
            p: 4,
          }}
        />
      ),
    },
  ];

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Fade left>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h4" fontWeight={600}>
                Our Services
              </Typography>
            </Box>
          </Fade>
        </Grid>
        {OurServices.map((services, index) => {
          const matchedIcon = OurServiceslist.find(
            (icon) => icon.id === services.iconkey
          );
          return (
            <Grid
              item
              key={index}
              xs={12}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                mt: 6,
              }}
            >
              <Bounce bottom duration={1000} delay={index * 300}>
                <Box>{matchedIcon && matchedIcon.icon}</Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight={"bold"}>
                    {services.title}
                  </Typography>
                  <Typography variant="body1">
                    {services.description}
                  </Typography>
                </Box>
              </Bounce>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
export default OurServices;
