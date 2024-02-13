import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { useCommonGridStyle } from "../styles/FooterStyle";
import theme from "../theme/theme";
import Fade from "react-reveal/Fade";
import CateringEnquiryForm from "../common/component/CateringEnquiryForm";
import { useLocation } from "react-router";
import { paths } from "../routes/path";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import DirectionsIcon from "@mui/icons-material/Directions";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import { Instagram } from "@mui/icons-material";

function Footer() {
  const location = useLocation();
  const isCateringMenuPage = location.pathname === paths.CATERING;
  const classes = useCommonGridStyle();

  const socialMediaIconStyles = {
    color: `${theme.palette.primary.main}`,
    fontSize: "2.5rem",
    transition: " 0.2s, transform 0.2s",
    "&:hover": {
      transform: "scale(1.1) translateY(-2px)",
    },
  };

  const openingHours = [
    { day: "Monday", timing: "11AM - 9PM" },
    { day: "Tuesday", timing: "Closed" },
    { day: "Wednesday", timing: "11AM - 9PM" },
    { day: "Thursday", timing: "11AM - 10PM" },
    { day: "Friday", timing: "11AM - 10PM" },
    { day: "Saturday", timing: "11AM - 10PM" },
    { day: "Sunday", timing: "11AM - 9PM" },
  ];

  const ourTimingStyles = {
    borderBottom: "none",
    p: 1,
    color: "white",
    fontSize: "15px",
  };

  return (
    <Box
      sx={{ boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)" }}
      className={`${classes.footerContainer} ${classes.innerBox}`}
    >
      <Box className={classes.overlay}></Box>
      <Fade top>
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            Contact Us
          </Typography>
        </Box>
      </Fade>
      <Container sx={{ paddingBottom: 2 }}>
        <Grid container sx={{ gap: 3 }}>
          <Grid
            container
            item
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Grid item lg={3} xs={12} className={classes.commonGridStyle}>
              <Fade left>
                <Box sx={{ my: 1 }}>
                  <LocationOnIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />

                  <Typography variant="h5"> Store Address</Typography>

                  <Typography>
                    2700 E Eldorado Pkwy, #203,
                    <br /> Little Elm, Texas - 75068
                  </Typography>
                  <a
                    href={import.meta.env.VITE_ADDRESS_LOCATION}
                    target="_blank"
                  >
                    <Button
                      startIcon={<DirectionsIcon />}
                      variant="contained"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      Get Direction
                    </Button>
                  </a>
                </Box>
              </Fade>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ background: "white" }}
            />
            <Grid item lg={3} xs={12} className={classes.commonGridStyle}>
              <Fade bottom delay={300}>
                <Box sx={{ my: 1 }}>
                  <ChatBubbleIcon
                    sx={{ color: theme.palette.secondary.main }}
                  ></ChatBubbleIcon>
                  <Typography variant="h5">General Enquiries</Typography>
                  <Typography my={1}>skvbalaji@gmail.com</Typography>
                  <Box
                    sx={{
                      gap: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href="mailto:skvbalaji@gmail.com"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <Button
                        startIcon={<EmailIcon />}
                        variant="contained"
                        fullWidth
                        sx={{
                          lineHeight: 0,
                          backgroundColor: "#f44336",
                          "&:hover": {
                            backgroundColor: "#f44336",
                          },
                        }}
                      >
                        Send mail
                      </Button>
                    </a>

                    <Link
                      to={`${import.meta.env.VITE_SINDHUS_WHATSAPP}`}
                      target="_blank"
                    >
                      <Button
                        startIcon={<WhatsAppIcon />}
                        variant="contained"
                        fullWidth
                        sx={{
                          lineHeight: 0,
                          backgroundColor: "#4caf50",
                          "&:hover": {
                            backgroundColor: "#4caf50",
                          },
                        }}
                      >
                        Chat on Whatsapp
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ background: "white" }}
            />
            <Grid item lg={2.9} xs={12} className={classes.commonGridStyle}>
              <Fade bottom delay={400}>
                <Box sx={{ my: 1 }}>
                  <PhoneIcon
                    sx={{ color: theme.palette.secondary.main }}
                  ></PhoneIcon>
                  <Typography variant="h5">Call us</Typography>
                  <Typography>+1 940-279-2536</Typography>
                  <Box mt={1}>
                    <Link
                      to={`${import.meta.env.VITE_SINDHUS_FACEBOOK}`}
                      target="_blank"
                    >
                      <IconButton>
                        <FacebookRoundedIcon sx={socialMediaIconStyles} />
                      </IconButton>
                    </Link>
                    <Link
                      to={`${import.meta.env.VITE_SINDHUS_INSTAGRAM}`}
                      target="_blank"
                    >
                      <IconButton>
                        <Instagram sx={socialMediaIconStyles} />
                      </IconButton>
                    </Link>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ background: "white" }}
            />
            <Grid item lg={3} xs={12} className={classes.commonGridStyle}>
              <Box sx={{ my: 1 }}>
                <Fade right>
                  <AccessTimeFilledIcon
                    sx={{ color: theme.palette.secondary.main }}
                  ></AccessTimeFilledIcon>
                  <Typography variant="h5" my={1}>
                    Our Timing
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableBody>
                        {openingHours.map((item) => (
                          <TableRow key={item.day}>
                            <TableCell sx={ourTimingStyles}>
                              {item.day}
                            </TableCell>
                            <TableCell sx={ourTimingStyles}>
                              {item.timing}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Fade>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {isCateringMenuPage && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <CateringEnquiryForm />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Footer;
