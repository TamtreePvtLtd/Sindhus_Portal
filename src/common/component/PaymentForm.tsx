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
  Typography,
} from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackBar } from "../../context/SnackBarContext";
import SuccessModal from "./SuccessModel";

import { PlacesAutocomplete } from "./PlacesAutocomplete";
import {
  useCreateCartItem,
  useCreatePaymentIntent,
  useGetLastTransaction,
} from "../../customRQHooks/Hooks";

// Define the interface for form data
interface PaymentFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine: string;
  // addressLine2?: string;
  postalCode?: string;
  deliveryOption: string;
  deliveryDate: Date | null;
  notes?: string;
}

// Define the validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
      "Phone number must be a valid US number"
    )
    .test(
      "is-complete-phone-number",
      "Phone number must be a valid US number",
      function (value) {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length === 10;
      }
    ),

  email: yup.string().email("Invalid email").required("Email is required"),
  deliveryOption: yup.string().required("Please select a delivery option"),
  deliveryDate: yup
    .date()
    .nullable()
    .required("Delivery or pickup date is required"),
  notes: yup.string().optional(),
});

function PaymentDialog({
  open,
  onClose,
  amount,
  orderedItems,
  clearCart,
  closeDrawer,
  totalWithoutCoupon,
  totalAmountWithCoupon,
  couponName,
}: {
  open: boolean;
  onClose: () => void;
  amount: string;
  orderedItems: any[];
  clearCart: () => void;
  closeDrawer: () => void;
  totalWithoutCoupon: number;
  totalAmountWithCoupon: number;
  couponName: string;
}) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
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
      deliveryOption: "Pickup",
      deliveryDate: null,
      notes: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | undefined>();
  const { updateSnackBarState } = useSnackBar();
  const [openModal, setOpenModal] = useState(false);
  const [isPickup, setIsPickup] = useState(true);
  const [addressError, setAddressError] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressURL, setAddressURL] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>();
  const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);

  const handleDeliveryChargeUpdate = (charge: number) => {
    setDeliveryCharge(charge);
  };
  // const { data: coupens, refetch } = useGetAllCoupens();

  // const libraries = ["places"];

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_LOCATION,
  //   libraries,
  // });

  // if (loadError) return <div>Error loading maps</div>;
  // if (!isLoaded) return <div>Loading Maps...</div>;

  const stripe = useStripe();
  const elements = useElements();

  const deliveryOptionValue = watch("deliveryOption");
  const createPaymentMutation = useCreatePaymentIntent();
  const { data: lasttransaction, refetch } = useGetLastTransaction();
  console.log("lasttransaction", lasttransaction);

  const cartItemCreateMutation = useCreateCartItem();

  useEffect(() => {
    setOrderNumber(lasttransaction);
  }, [lasttransaction]);

  useEffect(() => {
    if (deliveryOptionValue == "Pickup") setAddressError("");
  }, [deliveryOptionValue]);

  const handleStripeErrors = (error: any) => {
    const errorMessages: string[] = [];
    const errorCodeMap: Record<string, string> = {
      card_declined: "Your card was declined. Please try a different card.",
      expired_card: "Your card has expired. Please use a valid card.",
      incorrect_cvc: "The CVC code is incorrect. Please check and try again.",
      processing_error:
        "An error occurred while processing the payment. Please try again.",
      insufficient_funds: "There are insufficient amount on your card.",
    };

    if (error.code && errorCodeMap[error.code]) {
      errorMessages.push(errorCodeMap[error.code]);
    } else if (error.message) {
      errorMessages.push(error.message);
    } else {
      errorMessages.push("An unknown error occurred. Please try again.");
    }

    // Display all error messages
    errorMessages.forEach((message) => {
      updateSnackBarState(true, message, "error");
    });

    console.error("Stripe error details:", error);
  };

  const saveCartItems = async (cartItems: any[], paymentData: any) => {
    console.log("paymentData saveCartItems", paymentData);
    console.log("cartItems saveCartItems", cartItems);
    console.log("orderNumber saveCartItems", orderNumber);

    try {
      const data = {
        cartItems,
        paymentData,
        orderNumber: orderNumber,
      };

      await cartItemCreateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error saving cart items:", error);
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  console.log("address", address);

  const onSubmit = async (data: PaymentFormData) => {
    refetch();

    if (!stripe || !elements || addressError !== "") return;
    if (deliveryOptionValue === "Delivery" && !address) {
      setAddressError("Address is required for delivery");
      return;
    }
    setLoading(true);

    const capitalizedData = {
      ...data,
      firstName: capitalizeFirstLetter(data.firstName),
      lastName: capitalizeFirstLetter(data.lastName),
    };

    const finalAmount =
      deliveryOptionValue === "Delivery"
        ? Math.round((parseFloat(amount) + (deliveryCharge || 0)) * 100)
        : Math.round(parseFloat(amount) * 100);

    const paymentData = {
      ...capitalizedData,
      address: `${address}`,
      amount: finalAmount,
      orderedItems,
      createdAt: new Date(),
      orderNumber: orderNumber,
      couponName: couponName,
      totalWithoutCoupon: totalWithoutCoupon,
      totalWithCoupon: totalAmountWithCoupon,
      addressURL: addressURL,
      notes: data.notes,
    };

    try {
      const { clientSecret } = await createPaymentMutation.mutateAsync(
          paymentData
        );

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${capitalizedData.firstName} ${capitalizedData.lastName}`,
                email: capitalizedData.email,
                address: address,
              },
            },
          }
        );

      if (error) {
        handleStripeErrors(error); // Call a helper function to handle multiple errors
      } else if (paymentIntent?.status === "succeeded") {
        updateSnackBarState(true, "Payment Successful", "success");
        clearCart();
        setEmail(data.email);
        setAddressURL("");
        setAddress("");
        setAddressError("");
        saveCartItems(orderedItems, paymentData);
        console.log("Order Number:", orderNumber);
        setOpenModal(true);
        reset();
        closeDrawer();
        onClose();
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      updateSnackBarState(true, "Failed to create payment", "error");
    } finally {
      setLoading(false);
    }
  };

  console.log("delivery charge", deliveryCharge);

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
            {deliveryOptionValue === "Pickup" && (
              <TextField label="Amount ($)" value={amount} fullWidth disabled />
            )}
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
            {deliveryOptionValue === "Delivery" && (
              <PlacesAutocomplete
                orderAmountWithTax={{ orderAmountWithTax: amount }} // Wrap amount in an object
                setAddressError={setAddressError}
                setAddress={setAddress}
                setAddressURL={setAddressURL}
                setDeliveryCharge={handleDeliveryChargeUpdate} // Pass the callback
              />
            )}
            {addressError && <p style={{ color: "red" }}>{addressError}</p>}
            {deliveryOptionValue === "Delivery" && (
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
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="deliveryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={
                      deliveryOptionValue === "Pickup"
                        ? "Pickup Date"
                        : "Delivery Date"
                    }
                    {...field}
                    minDate={
                      deliveryOptionValue === "Pickup"
                        ? new Date().getFullYear() === 2024 &&
                          new Date().getMonth() === 9 &&
                          new Date().getDate() === 26
                          ? new Date() // If today is Oct 26, 2024, set minDate to today
                          : new Date(2024, 9, 26) // Otherwise, set minDate to Oct 26, 2024
                        : new Date() // For other options, set minDate to current date
                    }
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.deliveryDate}
                        helperText={errors.deliveryDate?.message}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  placeholder="Add any special instructions or notes"
                />
              )}
            />

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
        email={email}
      />
    </Box>
  );
}

export default PaymentDialog;
