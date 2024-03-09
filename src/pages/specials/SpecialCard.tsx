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

  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            p: 2,
            textAlign: "center",
          }}
        >
          <Fade right>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Specials
            </Typography>
          </Fade>
        </Box>
        <Box sx={{ marginBottom: 3 }}>
          <Grid container spacing={2}>
            {specials &&
              specials.length > 0 &&
              specials.map((special, index) => (
                <Grid item xs={12} key={index}>
                  <Bounce left>
                    <Card
                      sx={{
                        // maxWidth: "100%",
                        // maxHeight: "100%",
                        width: "50vw",
                        height: "50vh",

                        // width: "100%",
                        // height: "80vh",
                        overflow: "hidden",
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
                            height: "100%",
                            objectFit: "cover",
                          }}
                          image={image}
                          title={`Special Image ${imgIndex}`}
                        />
                      ))}
                    </Card>
                  </Bounce>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        PaperProps={{
          style: {
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src={selectedImage || ""}
            alt="Full Size"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100vw",
              height: "auto",
              objectFit: "contain",
            }}
          />
          <IconButton
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              overflow: "hidden",
              marginRight: "1rem",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SpecialCard;
