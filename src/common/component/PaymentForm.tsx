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
  Grid,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackBar } from "../../context/SnackBarContext";
import SuccessModal from "./SuccessModel";
import { addDays } from "date-fns";
import ShippingOptions from "../../shipping/ShippingOptions";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import {
  useCreateCartItem,
  useCreatePaymentIntent,
  useGetLastTransaction,
} from "../../customRQHooks/Hooks";
import { ParsedAddress, ToAddressPayload } from "../../interface/types";
import { createShipment, validateAddressApi } from "../../services/api";

interface PaymentFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine?: string;
  postalCode?: string;
  deliveryOption: string;
  deliveryDate: Date | null;
  notes?: string;
}

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
    getValues,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      addressLine: "",
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
  const [addressError, setAddressError] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressURL, setAddressURL] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>();
  const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);
  const [isPaymentDisabled, setIsPaymentDisabled] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedAddress, setSelectedAddress] = useState<ParsedAddress | null>(
    null
  );
  const [shipmentJson, setShipmentJson] = useState<any>({});

  const handleDeliveryChargeUpdate = (charge: number) => {
    setDeliveryCharge(charge);
  };
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [selectedShippingAmount, setSelectedShippingAmount] =
    useState<number>(0);

  const stripe = useStripe();
  const elements = useElements();

  const deliveryOptionValue = watch("deliveryOption");
  const createPaymentMutation = useCreatePaymentIntent();
  const { data: lasttransaction, refetch } = useGetLastTransaction();
  const cartItemCreateMutation = useCreateCartItem();

  useEffect(() => {
    setOrderNumber(lasttransaction);
  }, [lasttransaction]);

  useEffect(() => {
    if (deliveryOptionValue === "Pickup") setAddressError("");
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

    errorMessages.forEach((message) => {
      updateSnackBarState(true, message, "error");
    });

    console.error("Stripe error details:", error);
  };

  const saveCartItems = async (cartItems: any[], paymentData: any) => {
    try {
      const data = {
        cartItems,
        paymentData,
        orderNumber: paymentData.orderNumber,
      };

      await cartItemCreateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error saving cart items:", error);
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const onCardChange = (event: any) => {
    setCardComplete(event.complete);
  };

  const handleSelectRate = (rateId: string) => {
    setSelectedRate(rateId);
    const selectedRateData = shipmentJson?.rates?.find(
      (r: any) => r.object_id === rateId
    );
    if (selectedRateData) {
      const amount = Number(selectedRateData.amount) || 0;
      setSelectedShippingAmount(amount);
      setDeliveryCharge(amount);
      console.log("Selected rate details:", {
        object_id: selectedRateData.object_id,
        carrier_account: selectedRateData.carrier_account,
        amount: amount,
      });
    }
  };

  const subtotal = parseFloat(amount);
  const shippingCost =
    deliveryOptionValue === "Delivery"
      ? selectedRate
        ? Number(selectedShippingAmount) || 0
        : 0
      : 0;
  const orderTotal = subtotal + shippingCost;
  const savedAmount = totalWithoutCoupon - totalAmountWithCoupon;
  const onSubmit = async (data: PaymentFormData) => {
    if (!stripe || !elements || addressError !== "") return;
    if (deliveryOptionValue === "Delivery" && !address) {
      setAddressError("Address is required for delivery");
      return;
    }
    if (deliveryOptionValue === "Delivery" && !selectedRate) {
      updateSnackBarState(true, "Please select a shipping option", "error");
      return;
    }
    setLoading(true);
    try {
      const { data: transactionData } = await refetch();
      const updatedOrderNumber = transactionData || "1000";

      const selectedRateData = shipmentJson?.rates?.find(
        (r: any) => r.object_id === selectedRate
      );

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
        address: deliveryOptionValue === "Pickup" ? "" : address,
        amount: finalAmount,
        shippingOption: selectedRateData,
        orderedItems,
        createdAt: new Date(),
        orderNumber: updatedOrderNumber,
        couponName: couponName,
        totalWithoutCoupon: totalWithoutCoupon,
        totalWithCoupon: totalAmountWithCoupon,
        addressURL: deliveryOptionValue === "Pickup" ? "" : addressURL,
        notes: data.notes,
      };
      const { clientSecret, orderNumber } =
        await createPaymentMutation.mutateAsync(paymentData);

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: `${capitalizedData.firstName} ${capitalizedData.lastName}`,
              email: capitalizedData.email,
              address: {
                line1: address || "",
                postal_code: data.postalCode || "",
              },
            },
          },
        }
      );

      if (error) {
        handleStripeErrors(error);
      } else if (paymentIntent.status === "succeeded") {
        updateSnackBarState(true, "Payment Successful", "success");
        clearCart();
        setEmail(data.email);
        setAddressURL("");
        setAddress("");
        setAddressError("");
        await saveCartItems(orderedItems, {
          ...paymentData,
          orderNumber: updatedOrderNumber,
        });
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

  useEffect(() => {
    const validateAddress = async () => {
      if (selectedAddress) {
        const toAddress = {
          ...selectedAddress,
          name: getValues("firstName"),
          email: email,
          phone: getValues("phoneNumber"),
        } as ToAddressPayload;

        try {
          const addressValidationResponse: any = await validateAddressApi(
            toAddress
          );

          console.log("addressValidationResponse", addressValidationResponse);

          if (addressValidationResponse?.validationResults?.isValid) {
            debugger;
            var shipmentResponse: any = await createShipment(toAddress);

            if (shipmentResponse?.status == "SUCCESS") {
              setShipmentJson(shipmentResponse);
            }
          }
        } catch (error) {
          console.error("Address validation failed:", error);
        }
      }
    };
    validateAddress();
  }, [selectedAddress]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "100vh",
          },
        }}
      >
        <DialogTitle sx={{ paddingBottom: "5px" }}>Checkout</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",

                  maxHeight: 500,
                  overflowY: "auto",
                  pr: 1,
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
                <Controller
                  name="deliveryOption"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Delivery or Pickup
                      </FormLabel>
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
                    orderAmountWithTax={{ orderAmountWithTax: amount }}
                    setAddressError={setAddressError}
                    setAddress={setAddress}
                    setAddressURL={setAddressURL}
                    setDeliveryCharge={handleDeliveryChargeUpdate}
                    setIsPaymentDisabled={setIsPaymentDisabled}
                    onAddressSelected={(address) => {
                      setSelectedAddress({ ...address } as ParsedAddress);
                    }}
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
                        minDate={addDays(new Date(), 5)}
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
                      onChange={onCardChange}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderLeft: isSmallScreen ? "none" : "1px solid #ddd",
                  borderTop: isSmallScreen ? "1px solid #ddd" : "none",
                  pt: isSmallScreen ? 2 : 0,
                  pl: isSmallScreen ? 0 : 2,
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Shipping Options
                  </Typography>

                  <Box
                    sx={{
                      maxHeight: 300,
                      overflowY: "auto",
                      pr: 1,
                    }}
                  >
                    {deliveryOptionValue === "Delivery" ? (
                      <ShippingOptions
                        shipmentData={shipmentJson}
                        selectedRate={selectedRate}
                        onSelectRate={handleSelectRate}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Choose Delivery option to see the shipping options
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ m: 3 }} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">
                      {deliveryOptionValue === "Delivery"
                        ? selectedRate
                          ? `$${selectedShippingAmount.toFixed(2)}`
                          : "Select shipping option"
                        : "Free"}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Order Total
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${orderTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={
              !stripe ||
              loading ||
              !isValid ||
              addressError !== "" ||
              (deliveryOptionValue === "Delivery" && !selectedRate) ||
              !cardComplete
            }
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
