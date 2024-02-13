import SpecialCard from "./SpecialCard";
import { SpeicalsData } from "../../seed-data/seed-data";

function Specials() {
  return (
    <>
      <SpecialCard specials={SpeicalsData} />
    </>
  );
}

export default Specials;
