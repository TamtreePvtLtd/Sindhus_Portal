import { IWhyChooseUs } from "../../interface/types";
import { whyChooseUsSytle } from "../../styles/WhyChooseUsStyle";
import Fade from "react-reveal/Fade";
import Bounce from "react-reveal/Bounce";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

interface Iprops {
  whyChooseUs: IWhyChooseUs[];
}

function WhyChooseUs(props: Iprops) {
  const { whyChooseUs } = props;
  const classes = whyChooseUsSytle();

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
          <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
            WHY SINDHU'S KITCHEN?
          </Typography>
        </Fade>
        <Fade left>
          <Typography
            variant="h5"
            fontWeight={"bold"}
            sx={{ opacity: 0.7 }}
            mt={2}
          >
            We prepare our food with the same care and attention as we would for
            our own family, valuing every ingredient that contributes to the
            excellence of our dishes. Below are some of our highlights.
          </Typography>
        </Fade>
      </Box>

      <Grid container spacing={6} justifyContent="center" alignItems="center">
        {whyChooseUs.map((whychoose, index) => {
          return (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              py={1}
              className={classes.centerImage}
            >
              <Bounce bottom>
                <Card className={classes.flipcard} elevation={0}>
                  <Box className={classes.flipCardInner}>
                    <Box
                      className={classes.flipCardFront}
                      style={{
                        backgroundImage: `url(${whychoose.image})`,
                      }}
                    >
                      <Box
                        className={`${classes.overlay} ${classes.centerImage}`}
                      >
                        <Box
                          sx={{
                            fontSize: "6rem",
                          }}
                          className={classes.imageWithBorder}
                        >
                          {whychoose.imageicon}
                        </Box>

                        <Typography gutterBottom variant="h5" fontWeight={600}>
                          {whychoose.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h5"
                      p={2}
                      className={classes.flipCardBack}
                    >
                      {whychoose.description}
                    </Typography>
                  </Box>
                </Card>
              </Bounce>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default WhyChooseUs;
