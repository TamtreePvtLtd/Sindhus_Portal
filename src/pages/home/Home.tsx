import OurServices from "./OurServices";
import HomePageSlicker from "./HomePageSlicker";
import Box from "@mui/material/Box";
import { WhyChooseUsData, ourServicesData } from "../../seed-data/seed-data";
import WhyChooseUs from "./WhyChooseUs";
import Button from "@mui/material/Button";
import { useState } from "react";
import GoogleReviewsModal from "./GoogleReview";

function Home() {

  const [openModal, setOpenModal] = useState(false);

  const handleOpenReviewModal = () => {
    setOpenModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenModal(false);
  };

 
  
  return (
    <>
    <Box>
        <Box>
          <Button
            variant="contained"
            onClick={handleOpenReviewModal}
            sx={{
              position: "fixed",
              top: 200,
              left: 0,
              margin: "-50px",
              height: "30px",
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 99,
              bgcolor:"#f5c03d",
              display: "flex",
              transform: "rotate(-90deg) translate(-50%, 50%)",
              "&:hover": {
                backgroundColor: "#f5c03d",
              },
            }}
          >
            Reviews
          </Button>
          
        </Box>
      </Box>
      <Box>
        <HomePageSlicker />
      </Box>
      
      <Box
        sx={{
          mb: 3,
        }}
      >
        <WhyChooseUs whyChooseUs={WhyChooseUsData} />
      </Box>
      {/* <Box sx={{ backgroundColor: "#e6e7ee", py: 4 }}>
        <OurServices OurServices={ourServicesData} />
      </Box> */}

<GoogleReviewsModal open={openModal} onClose={handleCloseReviewModal} />
    </>
  );
}

export default Home;
