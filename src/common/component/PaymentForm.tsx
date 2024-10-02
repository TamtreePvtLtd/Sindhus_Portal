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
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackBar } from "../../context/SnackBarContext";
import SuccessModal from "./SuccessModel";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { PlacesAutocomplete } from "./PlacesAutocomplete";


// Define the interface for form data
interface PaymentFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  deliveryOption: string;
  deliveryDate: Date | null;
}

// Define the validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  postalCode: yup
    .string()
    .required("Postal code is required")
    .matches(/^[0-9]{5}$/, "Postal code must be 5 digits"),
  deliveryOption: yup.string().required("Please select a delivery option"),
  deliveryDate: yup
    .date()
    .nullable()
    .required("Delivery or pickup date is required"),
});


function PaymentDialog({
  open,
  onClose,
  amount,
  orderedItems,
  clearCart,
  closeDrawer,
}: {
  open: boolean;
  onClose: () => void;
  amount: string;
  orderedItems: any[];
  clearCart: () => void;
  closeDrawer: () => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      deliveryOption: "Delivery",
      deliveryDate: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | undefined>();
  const { updateSnackBarState } = useSnackBar();
  const [openModal, setOpenModal] = useState(false);

  // const libraries = ["places"];

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_LOCATION,
  //   libraries,
  // });

  // if (loadError) return <div>Error loading maps</div>;
  // if (!isLoaded) return <div>Loading Maps...</div>;

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (open) {
      getLastOrderNumber();
    }
  }, [open]);

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
      let newOrderNumber;

      if (orderNumberData) {
        const numericOrderNumber = Number(orderNumberData) + 1;
        newOrderNumber = numericOrderNumber.toString();
      } else {
        newOrderNumber = `1000`;
      }

      setOrderNumber(newOrderNumber);
    } catch (error) {
      console.error("Error fetching last order number:", error);
    }
  };

  const saveCartItems = async (cartItems: any[], paymentData: any) => {
    try {
      const data = {
        cartItems,
        paymentData,
        orderNumber: orderNumber || "1000",
      };

      await fetch("http://localhost:3000/cart/cartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error saving cart items:", error);
    }
  };

 const capitalizeFirstLetter = (string: string) => {
   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
 };

 const onSubmit = async (data: PaymentFormData) => {
   if (!stripe || !elements) return;

   // Capitalize first and last names
   const capitalizedData = {
     ...data,
     firstName: capitalizeFirstLetter(data.firstName),
     lastName: capitalizeFirstLetter(data.lastName),
   };

   setLoading(true);
   const paymentData = {
     ...capitalizedData,
     address: `${capitalizedData.addressLine1}, ${
       capitalizedData.addressLine2 || ""
     }`,
     amount: parseFloat(amount) * 100,
     orderedItems,
     createdAt: new Date(),
     orderNumber: orderNumber || "1000",
   };

   try {
     const response = await axios.post(
       "http://localhost:3000/payment/createPaymentIntent",
       paymentData
     );

     const { clientSecret } = response.data;
     const { error, paymentIntent } = await stripe.confirmCardPayment(
       clientSecret,
       {
         payment_method: {
           card: elements.getElement(CardElement),
           billing_details: {
             name: `${capitalizedData.firstName} ${capitalizedData.lastName}`,
             email: capitalizedData.email,
             address: {
               line1: capitalizedData.addressLine1,
               line2: capitalizedData.addressLine2,
               postal_code: capitalizedData.postalCode,
             },
           },
         },
       }
     );

     if (error) {
       console.error("Error during payment confirmation:", error);
     } else if (paymentIntent.status === "succeeded") {
       updateSnackBarState(true, "Payment Successful", "success");
       clearCart();
       saveCartItems(orderedItems, paymentData);
       console.log("Order Number:", orderNumber);
       setOpenModal(true);
       reset();
       closeDrawer();
       onClose();
     }
   } catch (error) {
     console.error("Error creating payment intent:", error);
   } finally {
     setLoading(false);
   }
 };


  return (
    <Box>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              mt: 2,
            }}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                  required
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                  required
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  fullWidth
                  required
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  required
                />
              )}
            />
            <TextField label="Amount ($)" value={amount} fullWidth disabled />
            <Controller
              name="deliveryOption"
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Delivery or Pickup</FormLabel>
                  <RadioGroup
                    {...field}
                    row
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="Delivery"
                      control={<Radio />}
                      label="Delivery"
                    />
                    <FormControlLabel
                      value="Pickup"
                      control={<Radio />}
                      label="Pickup"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
            <PlacesAutocomplete/>
            {/* <Controller
              name="addressLine1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 1"
                  error={!!errors.addressLine1}
                  helperText={errors.addressLine1?.message}
                  fullWidth
                  required
                />
              )}
            /> */}
            {/* <Controller
              name="addressLine2"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Address Line 2" fullWidth />
              )}
            /> */}
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Postal Code"
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                  fullWidth
                  required
                />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="deliveryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Select Delivery or Pickup Date"
                    {...field}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.deliveryDate}
                        helperText={errors.deliveryDate?.message}
                      />
                    )}
                    disablePast
                    fullWidth
                    required
                  />
                )}
              />
            </LocalizationProvider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                mb: 2,
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
          {errors && (
            <Box color="error.main" mt={2}>
              {Object.values(errors).map((error) => (
                <div key={error.message}>{error.message}</div>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        orderNumber={orderNumber}
      />
    </Box>
  );
}

export default PaymentDialog;
