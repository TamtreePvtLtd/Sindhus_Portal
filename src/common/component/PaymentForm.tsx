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
  IconButton,
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
import {
  Parcel,
  ParsedAddress,
  ShipmentPayload,
  CreateShipmentTransactionPayload,
} from "../../interface/types";
import { createShipment, validateAddressApi } from "../../services/api";
import { useCart } from "../../context/CartContext";
import {
  CalculateTotalWeight,
  getParcelObjectByWeight,
} from "../../../parcelConfig";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

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
  rateObjId: string;
  carrierAccount: string;
}

interface AddressFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  county: string;
  state: string;
  country: string;
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

const addressSchema = yup.object({
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().optional(),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal Code is required"),
  county: yup.string().optional(),
  country: yup.string().required("Country is required"),
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
    setValue,
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

  const {
    control: addressControl,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema) as any,
    mode: "onChange",
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      state: "",
      county: "",
      country: "United Kingdom",
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
  const { cartItems } = useCart();
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleDeliveryChargeUpdate = (charge: number) => {
    setDeliveryCharge(charge);
  };

  const [parcelObj, setParcelObj] = useState<Parcel | null>(null);
  const [selectedRate, setSelectedRate] =
    useState<CreateShipmentTransactionPayload | null>(null);
  const [selectedShippingAmount, setSelectedShippingAmount] =
    useState<number>(0);

  const stripe = useStripe();
  const elements = useElements();

  const deliveryOptionValue = watch("deliveryOption");
  const createPaymentMutation = useCreatePaymentIntent();
  const { data: lasttransaction, refetch } = useGetLastTransaction();
  const cartItemCreateMutation = useCreateCartItem();

  useEffect(() => {
    if (cartItems.length > 0) {
      var totalWeight = CalculateTotalWeight(cartItems);
      var _parcelObj = getParcelObjectByWeight(totalWeight);
      setParcelObj({ ..._parcelObj });
    }
  }, [cartItems]);

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

  const handleSelectRate = (rateObj: CreateShipmentTransactionPayload) => {
    setSelectedRate(rateObj);
    const selectedRateData = shipmentJson?.rates?.find(
      (r: any) => r.objectId === rateObj.rateObjId
    );
    if (selectedRateData) {
      /* +2 added with rate as customer told */

      const amount = (Number(selectedRateData.amount) || 0) + 2;
      setSelectedShippingAmount(amount);
      setDeliveryCharge(amount);
    }
  };

  const handleAddAddressClick = () => {
    setIsEditingAddress(false);
    resetAddress({
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      county: "",
      country: "United Kingdom",
    });
    setOpenAddressDialog(true);
  };

  const handleEditAddressClick = () => {
    setIsEditingAddress(true);
    if (selectedAddress) {
      resetAddress({
        addressLine1: selectedAddress.street1 || "",
        city: selectedAddress.city || "",
        postalCode: selectedAddress.zip || "",
        state: selectedAddress.state || "",
        country: selectedAddress.country || "United Kingdom",
      });
    }
    setOpenAddressDialog(true);
  };

  const handleAddressDialogClose = () => {
    setOpenAddressDialog(false);
    resetAddress();
  };

  const handleAddressSelected = (address: ParsedAddress) => {
    setSelectedAddress(address);

    if (address.street1) {
      setAddressValue("addressLine1", address.street1);
    }
    if (address.city) {
      setAddressValue("city", address.city);
    }
    if (address.zip) {
      setAddressValue("postalCode", address.zip);
    }
    if (address.state) {
      setAddressValue("state", address.state);
    }
    if (address.country) {
      setAddressValue("country", address.country);
    }

    const formattedAddress = `${address.street1}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}`;

    setAddress(formattedAddress);
    setValue("postalCode", address.zip || "");
    setAddressError("");
  };

  const onAddressSubmit = (data: AddressFormData) => {
    const formattedAddress = `${data.addressLine1}${
      data.addressLine2 ? ", " + data.addressLine2 : ""
    }, ${data.city}, ${data.county ? data.county + ", " : ""}${
      data.postalCode
    }, ${data.country}`;

    const parsedAddress: ParsedAddress = {
      street1: data.addressLine1,
      city: data.city,
      state: data.state,
      zip: data.postalCode,
      country: data.country,
    };

    setSelectedAddress(parsedAddress);
    setAddress(formattedAddress);
    setValue("postalCode", data.postalCode);
    setAddressError("");
    setOpenAddressDialog(false);
    updateSnackBarState(true, "Address saved successfully", "success");
    if (isEditingAddress) {
      console.log("Edited Address:", formattedAddress);
    } else {
      console.log("Added Address:", formattedAddress);
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
        (r: any) => r.objectId === selectedRate?.rateObjId
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
        rateObjId: selectedRate?.rateObjId || "",
        carrierAccount: selectedRate?.carrierAccount || "",
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
        setSelectedRate(null);
        const shipmentPayload = {
          ...selectedAddress,
          name: getValues("firstName"),
          email: getValues("email"),
          phone: getValues("phoneNumber"),
          parcel: parcelObj,
        } as ShipmentPayload;

        try {
          const addressValidationResponse: any = await validateAddressApi(
            shipmentPayload
          );

          if (addressValidationResponse?.validationResults?.isValid) {
            var shipmentResponse: any = await createShipment(shipmentPayload);

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
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1">Address</Typography>
                      {address ? (
                        <Button
                          onClick={handleEditAddressClick}
                          startIcon={<EditIcon />}
                          size="small"
                          variant="contained"
                        >
                          Edit Address
                        </Button>
                      ) : (
                        <Button
                          onClick={handleAddAddressClick}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="contained"
                        >
                          Add Address
                        </Button>
                      )}
                    </Box>

                    {address && (
                      <Box
                        sx={{
                          p: 1,
                          border: "1px solid #ccc",
                          borderRadius: 1,
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Typography variant="body2">{address}</Typography>
                      </Box>
                    )}
                  </>
                )}
                {/* {addressError && <p style={{ color: "red" }}>{addressError}</p>}
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
                )} */}
                {/* {address && (
                      <Box
                        sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}
                      >
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
                      </Box>
                    )} */}
                {/* </> */}
                {/* )} */}
                {/* {addressError && <p style={{ color: "red" }}>{addressError}</p>}
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
                )} */}
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
          <Button
            onClick={() => {
              onClose();
              setShipmentJson(null);
              resetAddress();
              setAddress("");
            }}
          >
            Cancel
          </Button>
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

      {/* Address Dialog */}
      <Dialog
        open={openAddressDialog}
        onClose={handleAddressDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditingAddress ? "Edit Address" : "Add Address"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              mt: 1,
            }}
          >
            <Box>
              <PlacesAutocomplete
                orderAmountWithTax={{ orderAmountWithTax: amount }}
                setAddressError={setAddressError}
                setAddress={setAddress}
                setAddressURL={setAddressURL}
                setDeliveryCharge={handleDeliveryChargeUpdate}
                setIsPaymentDisabled={setIsPaymentDisabled}
                onAddressSelected={handleAddressSelected}
              />
            </Box>

            <Controller
              name="addressLine1"
              control={addressControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 1"
                  placeholder="Enter Address Line 1"
                  error={!!addressErrors.addressLine1}
                  helperText={addressErrors.addressLine1?.message}
                  fullWidth
                  required
                />
              )}
            />

            <Controller
              name="city"
              control={addressControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  placeholder="Enter City"
                  error={!!addressErrors.city}
                  helperText={addressErrors.city?.message}
                  fullWidth
                  required
                />
              )}
            />

            <Controller
              name="state"
              control={addressControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  placeholder="Enter State"
                  error={!!addressErrors.state}
                  helperText={addressErrors.state?.message}
                  fullWidth
                  required
                />
              )}
            />

            <Controller
              name="postalCode"
              control={addressControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Postal Code"
                  placeholder="Enter Code"
                  error={!!addressErrors.postalCode}
                  helperText={addressErrors.postalCode?.message}
                  fullWidth
                  required
                />
              )}
            />

            <Controller
              name="country"
              control={addressControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country"
                  placeholder="Enter Country"
                  error={!!addressErrors.country}
                  helperText={addressErrors.country?.message}
                  fullWidth
                  required
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddressDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddressSubmit(onAddressSubmit)}
            variant="contained"
          >
            {isEditingAddress ? "Update Address" : "Save Address"}
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
