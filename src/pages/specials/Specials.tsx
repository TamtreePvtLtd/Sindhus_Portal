import { Box, Container } from "@mui/material";
import { usegetAllSpecials } from "../../customRQHooks/Hooks";
import SpecialCard from "./SpecialCard";

function Specials() {
  const { data: specials = [] } = usegetAllSpecials();

  return (
    <Box>
      <Container maxWidth={false}>
        <SpecialCard specials={specials}></SpecialCard>
      </Container>
    </Box>
  );
}

export default Specials;
