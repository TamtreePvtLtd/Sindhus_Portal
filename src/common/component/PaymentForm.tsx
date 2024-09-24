// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   FormControl,
//   FormLabel,
// } from "@mui/material";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";
// import dayjs from "dayjs";
// import { useSnackBar } from "../../context/SnackBarContext";

// function PaymentDialog({
//   open,
//   onClose,
//   amount,
//   orderedItems,
//   clearCart,
//   closeDrawer,
// }) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [address, setAddress] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [deliveryOption, setDeliveryOption] = useState("delivery");
//   const [deliveryDate, setDeliveryDate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const { updateSnackBarState } = useSnackBar();

//   const stripe = useStripe();
//   const elements = useElements();

//   const validatePostalCode = (postalCode) => {
//     const postalCodePattern = /^[0-9]{6}$/; // Adjust the pattern based on your requirements
//     return postalCodePattern.test(postalCode);
//   };

//   const saveCartItems = async (cartItems, paymentData) => {
//     console.log("Sending request to save cart items:", {
//       cartItems,
//       paymentData,
//     });

//     try {
//       const response = await fetch("http://localhost:3000/cart/cartItem", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ cartItems, paymentData }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(data.message);
//     } catch (error) {
//       console.error("Error saving cart items:", error);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!stripe || !elements || !deliveryDate) {
//       setError("Payment is incomplete. Please check all the fields.");
//       return;
//     }

//     if (!validatePostalCode(postalCode)) {
//       setError("Please enter a valid postal code.");
//       return;
//     }

//     setLoading(true);

//     const paymentData = {
//       firstName,
//       lastName,
//       address: deliveryOption === "delivery" ? address : address,
//       phoneNumber,
//       email,
//       deliveryOption,
//       deliveryDate: dayjs(deliveryDate).format("YYYY-MM-DD"),
//       amount: parseFloat(amount) * 100,
//       orderedItems,
//       postalCode,
//       createdAt: new Date(),
//     };

//     try {
//       // Create payment intent on the server
//       const response = await axios.post(
//         "http://localhost:3000/payment/createPaymentIntent",
//         paymentData
//       );
//       const { clientSecret } = response.data;

//       // Confirm the card payment
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: {
//               name: `${firstName} ${lastName}`,
//               email,
//               address: {
//                 line1: address,
//                 postal_code: postalCode,
//               },
//             },
//           },
//         }
//       );
//       if (error) {
//         console.error("Error during payment confirmation: ", error);
//         setError(error.message || "Payment failed.");
//       } else if (paymentIntent.status === "succeeded") {
//          updateSnackBarState(true, "Payment Successful", "success");
//         resetForm();
//         clearCart();
//         saveCartItems(orderedItems, paymentData);
//         closeDrawer();
//         onClose();
//       } else if (paymentIntent.status === "requires_action") {
//         setError("Additional verification required.");
//       } else {
//         setError("Payment incomplete.");
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };
//   const resetForm = () => {
//     setFirstName("");
//     setLastName("");
//     setAddress("");
//     setPhoneNumber("");
//     setEmail("");
//     setDeliveryOption("delivery");
//     setDeliveryDate(null);
//     setPostalCode("");
//     setError("");
//   };
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Checkout</DialogTitle>
//       <DialogContent>
//         <Box
//           component="form"
//           sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: 2 }}
//         >
//           {/* Form Fields */}
//           <TextField
//             label="First Name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField
//             label="Last Name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField
//             label="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField
//             label="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField label="Amount ($)" value={amount} fullWidth disabled />

//           <FormControl component="fieldset">
//             <FormLabel component="legend">Delivery or Pickup</FormLabel>
//             <RadioGroup
//               row
//               value={deliveryOption}
//               onChange={(e) => setDeliveryOption(e.target.value)}
//             >
//               <FormControlLabel
//                 value="delivery"
//                 control={<Radio />}
//                 label="Delivery"
//               />
//               <FormControlLabel
//                 value="pickup"
//                 control={<Radio />}
//                 label="Pickup"
//               />
//             </RadioGroup>
//           </FormControl>

//           <TextField
//             label="Address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             fullWidth
//             multiline
//             // disabled={deliveryOption === "pickup"}
//             // required={deliveryOption === "delivery"}
//           />
//           <TextField
//             label="Postal Code"
//             value={postalCode}
//             onChange={(e) => setPostalCode(e.target.value)}
//             fullWidth
//             required
//           />

//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Select Delivery or Pickup Date"
//               value={deliveryDate}
//               onChange={(newValue) => setDeliveryDate(newValue)}
//               renderInput={(params) => <TextField {...params} />}
//               disablePast
//               fullWidth
//               required
//             />
//           </LocalizationProvider>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               width: "100%",
//               mb: 2, // Add margin bottom to align with other fields
//             }}
//           >
//             <FormLabel sx={{ mb: 1 }}>Card Details</FormLabel>
//             <Box
//               sx={{
//                 padding: "10px",
//                 border: "1px solid #ccc",
//                 borderRadius: "4px",
//               }}
//             >
//               <CardElement
//                 options={{
//                   style: {
//                     base: {
//                       fontSize: "16px",
//                       color: "#424770",
//                       "::placeholder": {
//                         color: "#aab7c4",
//                       },
//                     },
//                     invalid: {
//                       color: "#9e2146",
//                     },
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Box>
//         {error && (
//           <Box color="error.main" mt={2}>
//             {error}
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={!stripe || loading}
//         >
//           {loading ? "Processing..." : "Confirm Payment"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default PaymentDialog;



import { useState } from "react";
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
  const { updateSnackBarState } = useSnackBar();

  const stripe = useStripe();
  const elements = useElements();

  const validatePostalCode = (postalCode) => {
    const postalCodePattern = /^[0-9]{6}$/; // Adjust the pattern based on your requirements
    return postalCodePattern.test(postalCode);
  };

  const saveCartItems = async (cartItems, paymentData) => {
    console.log("Sending request to save cart items:", {
      cartItems,
      paymentData,
    });

    try {
      const response = await fetch("http://localhost:3000/cart/cartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, paymentData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error saving cart items:", error);
    }
  };

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
      // Ensure the deliveryDate is valid and formatted correctly
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
        deliveryDate: formattedDeliveryDate, // Ensure it's valid
        amount: parseFloat(amount) * 100,
        orderedItems,
        postalCode,
        createdAt: new Date(),
      };

      // Create payment intent on the server
      const response = await axios.post(
        "http://localhost:3000/payment/createPaymentIntent",
        paymentData
      );

      const { clientSecret } = response.data;

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

