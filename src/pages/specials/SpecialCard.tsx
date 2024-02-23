import React from "react";
import Card from "@mui/material/Card";
import Fade from "react-reveal/Fade";
import Bounce from "react-reveal/Bounce";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { ISpecial, ISpecials } from "../../interface/types";

interface Iprops {
  specials: ISpecial[];
}

function SpecialCard(props: Iprops) {
  const { specials } = props;

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 3,
          textAlign: "center",
        }}
      >
        <Fade right>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Specials
          </Typography>
        </Fade>
      </Box>
      <Grid container justifyContent="center" alignItems="center">
        {specials &&
          specials.length > 0 &&
          specials.map((special, index) => {
            console.log("sp", special);
            return (
              <Grid item xs={12} key={index}>
                <Bounce left>
                  <Card
                    sx={{
                      boxShadow: 6,
                      my: 5,
                      minWidth: "70%",
                    }}
                  >
                    {special.images.map((image, imgIndex) => (
                      <CardMedia
                        key={imgIndex}
                        component="img"
                        height={"70%"}
                        width={"100%"}
                        sx={{
                          backgroundSize: "cover",
                        }}
                        image={image}
                        title={`Special Image ${imgIndex}`}
                      />
                    ))}
                  </Card>
                </Bounce>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}

export default SpecialCard;
