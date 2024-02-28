import React, { useState } from "react";
import Card from "@mui/material/Card";
import Fade from "react-reveal/Fade";
import Bounce from "react-reveal/Bounce";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { ISpecial } from "../../interface/types";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Iprops {
  specials: ISpecial[];
}

function SpecialCard(props: Iprops) {
  const { specials } = props;
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleClickOpen = (image: string) => {
      setSelectedImage(image);
      setOpen(true);
  };
    const handleClose = () => {
      setOpen(false);
      setSelectedImage(null);
    };
 console.log("Specials:", specials);
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
      <Grid container spacing={2}>
        {specials &&
          specials.length > 0 &&
          specials.map((special, index) => (
            <Grid item xs={4} key={index}>
              <Bounce left>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    border: "1px solid gray",
                  }}
                  onClick={() => handleClickOpen(special.images[0])}
                >
                  {special.images.map((image, imgIndex) => (
                    <CardMedia
                      key={imgIndex}
                      component="img"
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                       image={image}
                      // title={`Special Image ${imgIndex}`}
                    />
                  ))}
                </Card>
              </Bounce>
            </Grid>
          ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage || ""}
            alt="Full Size"
            style={{ width: "40vw", height: "50vh" }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default SpecialCard;
