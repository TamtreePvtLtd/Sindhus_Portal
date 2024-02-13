import OurServices from "./OurServices";
import HomePageSlicker from "./HomePageSlicker";
import Box from "@mui/material/Box";
import { WhyChooseUsData, ourServicesData } from "../../seed-data/seed-data";
import WhyChooseUs from "./WhyChooseUs";

function Home() {
  return (
    <>
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
    </>
  );
}

export default Home;
