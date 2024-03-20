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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h4"
                fontWeight={"500"}
                color={"primary"}
                fontFamily={"revert-layer"}
                // sx={{ ml: 1 }}
              >
                Why
              </Typography>
              <Typography
                variant="h4"
                fontWeight={"800"}
                color={"primary"}
                sx={{
                  fontFamily: "clearface ts bold",
                }}
              >
                &nbsp;SINDHU'S
              </Typography>
            </Box>
          </Box>
        </Fade>
        <Fade left>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "400",
              fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
            }}
            mt={2}
          >
            We prepare our food with the same care and attention as we would for
            our own family, valuing every ingredient that contributes to the
            excellence of our dishes. Below are some of our highlights.
          </Typography>
        </Fade>
      </Box>

      <Grid
        container
        spacing={10}
        justifyContent="center"
        alignItems="center"
        marginBottom="4"
      >
        {whyChooseUs.map((whychoose, index) => {
          return (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
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
                        <Typography gutterBottom variant="h5" fontWeight={400}>
                          {whychoose.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography p={2} className={classes.flipCardBack}>
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
