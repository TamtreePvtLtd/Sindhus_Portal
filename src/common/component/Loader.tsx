import useAxiosLoader, {
  axiosInstanceWithCredential,
  axiosInstanceWithMultipartFormData,
  axiosInstanceWithOutCredential,
} from "../../services/http";
import Box from "@mui/material/Box";

const Spinner = () => <div className="spinner"></div>;

type Props = {
  showSuspendLoading?: boolean;
};

function Loader(props: Props) {
  const [axiosWithCredentialLoading] = useAxiosLoader(
    axiosInstanceWithCredential
  );
  const [axiosWithOutCredentialLoading] = useAxiosLoader(
    axiosInstanceWithOutCredential
  );
  const [axiosWithMultiPartheaderLoading] = useAxiosLoader(
    axiosInstanceWithMultipartFormData
  );

  const showLoading =
    axiosWithCredentialLoading ||
    axiosWithOutCredentialLoading ||
    axiosWithMultiPartheaderLoading ||
    props.showSuspendLoading;

  return (
    <>
      {showLoading && (
        <Box className="overlay">
          <Spinner />
          <img
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
            }}
            className="spinner-image"
            src="assets/images/sindhus-logo.png"
            alt=""
          />
        </Box>
      )}
    </>
  );
}

export default Loader;
