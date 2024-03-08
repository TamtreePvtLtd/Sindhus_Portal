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
    p: 0.3,
    color: "white",
    fontSize: "14px",
  };

  return (
    <>
      <Box
        sx={{ boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)" }}
        className={`${classes.footerContainer} ${classes.innerBox}`}
      >
        <Box className={classes.overlay}></Box>
        <Container sx={{ paddingBottom: 2, pt: 2 }}>
      
          <Fade top>
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <Typography variant="h4" fontWeight={400}>
                Contact Us
              </Typography>
            </Box>
          </Fade>
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

                    <Typography variant="h6"> Store Address</Typography>

                    <Typography variant="body2">
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
                        sx={{
                          m: 1,
                          "&:hover": {
                            backgroundColor: "#038265",
                          },
                        }}
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
                sx={{ background: "gray", marginBottom: "25px" }}
              />
              <Grid item lg={3} xs={12} className={classes.commonGridStyle}>
                <Fade bottom delay={300}>
                  <Box sx={{ my: 1 }}>
                    <ChatBubbleIcon
                      sx={{ color: theme.palette.secondary.main }}
                    ></ChatBubbleIcon>
                    <Typography variant="h6">General Enquiries</Typography>
                    <Typography variant="body2" marginBottom={1}>
                      skvbalaji@gmail.com
                    </Typography>
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
                          // fullWidth
                          sx={{
                            lineHeight: 0,
                            backgroundColor: "#0489c9",
                            "&:hover": {
                              backgroundColor: "#0489c9",
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
                          sx={{
                            lineHeight: 0,
                            backgroundColor: "#4caf50",
                            "&:hover": {
                              backgroundColor: "#4caf50",
                            },
                          }}
                        >
                          Whatsapp
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ background: "gray", marginBottom: "25px" }}
              />
              <Grid item lg={2.9} xs={12} className={classes.commonGridStyle}>
                <Fade bottom delay={400}>
                  <Box sx={{ my: 1 }}>
                    <PhoneIcon
                      sx={{ color: theme.palette.secondary.main }}
                    ></PhoneIcon>
                    <Typography variant="h6">Call us</Typography>
                    <Typography variant="body2">+1 940-279-2536</Typography>
                    <Box mt={1}>
                      <Link
                        to={`${import.meta.env.VITE_SINDHUS_FACEBOOK}`}
                        target="_blank"
                      >
                        <IconButton>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="35"
                            height="35"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#039be5"
                              d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                            ></path>
                          </svg>
                        </IconButton>
                      </Link>
                      <Link
                        to={`${import.meta.env.VITE_SINDHUS_INSTAGRAM}`}
                        target="_blank"
                      >
                        <IconButton>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            viewBox="0 0 102 102"
                            id="instagram"
                          >
                            <defs>
                              <radialGradient
                                id="a"
                                cx="6.601"
                                cy="99.766"
                                r="129.502"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop offset=".09" stopColor="#fa8f21"></stop>
                                <stop offset=".78" stopColor="#d82d7e"></stop>
                              </radialGradient>
                              <radialGradient
                                id="b"
                                cx="70.652"
                                cy="96.49"
                                r="113.963"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop
                                  offset=".64"
                                  stopColor="#8c3aaa"
                                  stopOpacity="0"
                                ></stop>
                                <stop offset="1" stopColor="#8c3aaa"></stop>
                              </radialGradient>
                            </defs>
                            <path
                              fill="url(#a)"
                              d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
                              data-name="Path 16"
                            ></path>
                            <path
                              fill="url(#b)"
                              d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
                              data-name="Path 17"
                            ></path>
                            <path
                              fill="#fff"
                              d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229"
                              data-name="Path 18"
                              transform="translate(-422.637 -426.196)"
                            ></path>
                          </svg>
                        </IconButton>
                      </Link>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ background: "gray", marginBottom: "25px" }}
              />
              <Grid item lg={3} xs={12} className={classes.commonGridStyle}>
                <Box sx={{ my: 1 }}>
                  <Fade right>
                    <AccessTimeFilledIcon
                      sx={{ color: theme.palette.secondary.main }}
                    ></AccessTimeFilledIcon>
                    <Typography variant="h6">Our Timing</Typography>

                    <TableContainer>
                      <Table>
                        <TableBody>
                          {openingHours.map((item) => (
                            <TableRow key={item.day}>
                              <TableCell sx={ourTimingStyles}>
                                {item.day}
                              </TableCell>
                              <TableCell
                                sx={{ ...ourTimingStyles, paddingLeft: "15px" }}
                              >
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
              <Grid item lg={12} xs={12} className={classes.commonGridStyle}>
                <Typography
                  variant="body1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    zIndex: "1",
                  }}
                >
                  Copyright &copy; {new Date().getFullYear()}. All Rights
                  Reserved by SINDHU'S
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
