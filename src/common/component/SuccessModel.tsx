import { Button, Modal } from "@mui/material";

const SuccessModal = ({ open, handleClose,orderNumber }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          margin: "auto",
          marginTop: "20vh",
          width: "300px",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <h2>Thank you for your purchase! </h2>
        <p>Your Payment was Successful.</p>
        <p>Your OrderNumber :#{orderNumber}</p>
        <p>Please check your email for further details.</p>
        <Button onClick={handleClose} variant="contained" color="primary">
          Ok
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
