import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

function PaymentDialog({ open, onClose }) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("delivery"); // 'delivery' or 'pickup'

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      fullName,
      address,
      phoneNumber,
      email,
      deliveryOption,
    });

    onClose(); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your details for the order.
        </DialogContentText>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            mt: 2,
          }}
        >
          <TextField
            label="Full Name"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          {/* Delivery or Pickup Option */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Delivery or Pickup</FormLabel>
            <RadioGroup
              row
              value={deliveryOption}
              onChange={(e) => setDeliveryOption(e.target.value)}
            >
              <FormControlLabel
                value="delivery"
                control={<Radio />}
                label="Delivery"
              />
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="Pickup"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            disabled={deliveryOption === "pickup"} 
            required={deliveryOption === "delivery"} 
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Conform Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentDialog;
