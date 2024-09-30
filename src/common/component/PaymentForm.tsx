import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackBar } from "../../context/SnackBarContext";

function PaymentDialog({
  open,
  onClose,
  amount,
  orderedItems,
  clearCart,
  closeDrawer,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderNumber, setOrderNumber] = useState();
  const { updateSnackBarState } = useSnackBar();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    console.log("useEffect called");
    getLastOrderNumber();
  }, [open]);

  const validatePostalCode = (postalCode) => {
    const postalCodePattern = /^[0-9]{6}$/; // Adjust the pattern based on your requirements
    return postalCodePattern.test(postalCode);
  };

  // Function to fetch the last order number and generate a new one
  const getLastOrderNumber = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/payment/lasttransaction",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderNumberData = await response.json();
      console.log("order no data", orderNumberData);
      console.log("type order no data", typeof orderNumberData);

      var newOrderNumber;

      if (orderNumberData) {
        const numericOrderNumber = parseInt(orderNumberData.slice(1), 10) + 1;
        newOrderNumber = `#${numericOrderNumber.toString()}`;

        console.log(numericOrderNumber);
      } else {
        console.error("Invalid order number data");
      }

      console.log("newOrderNumber", newOrderNumber);

      // Return the new order number and indicate that the transaction exists
      setOrderNumber(newOrderNumber || "#1000");
      // }
      return newOrderNumber;
    } catch (error) {
      console.error("Error fetching last order number:", error);
      throw error;
    }
  };

  // Function to save cart items and payment data
  const saveCartItems = async (cartItems, paymentData) => {
    try {
      // Call the getLastOrderNumber function to get the new order number
      // const updatedCartItems = cartItems.map((item) => ({
      //   ...item,
      //   orderNumber: orderNumber,
      // }));

      const data = {
        cartItems,
        paymentData,
        orderNumber: orderNumber,
      };

      console.log("created cart item data", data);

      // Save cart items and payment data with the new order number
      const response = await fetch("http://localhost:3000/cart/cartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Add this to log the error details
        console.error("Error response from server:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const lastOrderData = await response.json();
      console.log(lastOrderData.message);
    } catch (error) {
      console.error("Error saving cart items:", error);
    }
  };

  // const saveCartItems = async (cartItems, paymentData) => {
  //   try {
  //     const lastItemresponse = await fetch(
  //       "http://localhost:3000/payment/lasttransaction",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!lastItemresponse.ok) {
  //       throw new Error(`HTTP error! status: ${lastItemresponse.status}`);
  //     }

  //     const orderNumberdata = await lastItemresponse.json();
  //     const numericOrderNumber =
  //       parseInt(orderNumberdata.orderNumber.slice(1), 10) + 1;
  //     const newOrderNumber = `#${numericOrderNumber.toString()}`;

  //    const response = await fetch("http://localhost:3000/cart/cartItem", {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify({
  //        cartItems,
  //        paymentData,
  //        orderNumber: newOrderNumber,
  //      }),
  //    });

  //    if (!response.ok) {
  //      const errorData = await response.json(); // Add this to log the error details
  //      console.error("Error response from server:", errorData);
  //      throw new Error(`HTTP error! status: ${response.status}`);
  //    }

  //    const lasOrderdata = await response.json();
  //    console.log(lasOrderdata.message);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log(data.message);
  //   } catch (error) {
  //     console.error("Error saving cart items:", error);
  //   }
  // };

  // Handle form submission
  const handleSubmit = async () => {
    if (!stripe || !elements || !deliveryDate) {
      setError("Payment is incomplete. Please check all the fields.");
      return;
    }

    // Validate postal code
    if (!validatePostalCode(postalCode)) {
      setError("Please enter a valid postal code.");
      return;
    }

    setLoading(true);

    try {
      const formattedDeliveryDate = dayjs(deliveryDate).isValid()
        ? dayjs(deliveryDate).format("MM/DD/YYYY")
        : null;

      if (!formattedDeliveryDate) {
        throw new Error("Invalid delivery date.");
      }

      const paymentData = {
        firstName,
        lastName,
        address: `${addressLine1}, ${addressLine2}`,
        phoneNumber,
        email,
        deliveryOption,
        deliveryDate: formattedDeliveryDate,
        amount: parseFloat(amount) * 100,
        orderedItems,
        postalCode,
        createdAt: new Date(),
        orderNumber: orderNumber,
      };

      // Create payment intent on the server
      const response = await axios.post(
        "http://localhost:3000/payment/createPaymentIntent",
        paymentData
      );

      const { clientSecret } = response.data; // Get the orderNumber from the response

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${firstName} ${lastName}`,
              email,
              address: {
                line1: addressLine1,
                line2: addressLine2,
                postal_code: postalCode,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Error during payment confirmation:", error);
        setError(error.message || "Payment failed.");
      } else if (paymentIntent.status === "succeeded") {
        updateSnackBarState(true, "Payment Successful", "success");
        resetForm();
        clearCart();

        // Pass the orderNumber along with cart items and payment data
        saveCartItems(orderedItems, paymentData);

        closeDrawer();
        onClose();
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setAddressLine1("");
    setAddressLine2("");
    setPhoneNumber("");
    setEmail("");
    setDeliveryOption("delivery");
    setDeliveryDate(null);
    setPostalCode("");
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: 2 }}
        >
          {/* Form Fields */}
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField label="Amount ($)" value={amount} fullWidth disabled />

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
            label="Address Line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Address Line 2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            fullWidth
          />
          <TextField
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Delivery or Pickup Date"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
              disablePast
              fullWidth
              required
            />
          </LocalizationProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              mb: 2, // Add margin bottom to align with other fields
            }}
          >
            <FormLabel sx={{ mb: 1 }}>Card Details</FormLabel>
            <Box
              sx={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        {error && (
          <Box color="error.main" mt={2}>
            {error}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentDialog;
