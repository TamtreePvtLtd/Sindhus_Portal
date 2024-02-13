import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  ICateringRequest,
  ISelectedCateringProduct,
  IServingSizeWithQuantity,
} from "../../interface/types";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { sendCateringRequest } from "../../services/api";
import { SnackbarSeverityEnum } from "../../enums/SnackbarSeverityEnum";
import { useSnackBar } from "../../context/SnackBarContext";
import { Container } from "@mui/system";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface IProps {
  open: boolean;
  onClose: () => void;
  productInfo: ISelectedCateringProduct[];
  productQuantities: IServingSizeWithQuantity[];
  addNotes: { [productId: string]: string };
  onRequestSubmit: () => void;
}

interface ICombinedProduct {
  productId: string;
  title: string;
  quantities: {
    size: string;
    quantity: number;
  }[];
}
const RequestFormInitialValue: ICateringRequest = {
  name: "",
  mobileNumber: "",
  email: "",
  eventDate: "",
  eventTime: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobileNumber: yup
    .string()
    .required()
    .typeError("Please enter the MobileNumber")
    .matches(/^[0-9]{10}$/, "Please enter a valid MobileNumber"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  eventDate: yup.string().required("Event date is required"),
  eventTime: yup.string().required("Event time is required"),
});

function CateringRequestModel(props: IProps) {
  const {
    open,
    onClose,
    productInfo,
    productQuantities,
    addNotes,
    onRequestSubmit,
  } = props;
  const { updateSnackBarState } = useSnackBar();

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    reset,
  } = useForm<ICateringRequest>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: RequestFormInitialValue,
  });

  const [combinedProducts, setCombinedProducts] = useState<ICombinedProduct[]>(
    []
  );

  useEffect(() => {
    const combined = productInfo.map((product) => {
      const matchingQuantities = productQuantities.filter(
        (item) => item.productId === product._id
      );

      const quantities = matchingQuantities
        .map((item) =>
          item.sizes.map((sizeInfo) => ({
            size: sizeInfo.size,
            quantity: sizeInfo.qty,
          }))
        )
        .flat();

      return {
        productId: product._id,
        title: product.title,
        quantities: quantities,
        notes: addNotes[product._id] || "",
      };
    });

    setCombinedProducts(combined);
  }, [productInfo, productQuantities, addNotes]);

  const onSubmitCateringRequest = async (data) => {
    try {
      await sendCateringRequest(data, combinedProducts);
      updateSnackBarState(
        true,
        "Request Send successfully",
        SnackbarSeverityEnum.SUCCESS
      );
      onClose();
      reset();
      onRequestSubmit();
    } catch (error) {
      updateSnackBarState(
        true,
        "Error while submitting the catering Request",
        SnackbarSeverityEnum.ERROR
      );
    }
  };
  const handleCancel = () => {
    reset(), onClose();
  };

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "large" }}>
            Enter Your Details
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitCateringRequest)}>
        <DialogContent>
          <Box>
            <TextField
              sx={{ mb: 1.5 }}
              size="small"
              label="Name *"
              fullWidth
              variant="outlined"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
            <TextField
              sx={{ mb: 1.5 }}
              size="small"
              label="Mobile Number *"
              fullWidth
              variant="outlined"
              {...register("mobileNumber")}
              error={!!errors.mobileNumber}
              helperText={
                errors.mobileNumber ? errors.mobileNumber.message : ""
              }
            />

            <TextField
              sx={{ mb: 1.5 }}
              size="small"
              label="Email *"
              fullWidth
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
            <FormControl sx={{ mb: 0.5 }} fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="eventDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Event Date *"
                      slotProps={{
                        textField: {
                          error: !!errors.eventDate,
                          size: "small",
                        },
                      }}
                      disablePast
                      format="DD-MM-YYYY"
                      value={field.value || null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <Controller
                    name="eventTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        label="Event Time *"
                        value={field.value || null}
                        onChange={(time) => field.onChange(time)}
                        sx={{ width: "100%" }}
                        slotProps={{
                          textField: {
                            error: !!errors.eventTime,
                            size: "small",
                          },
                        }}
                      />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Box>
        </DialogContent>
        <Container sx={{ padding: 0, mb: 2 }}>
          <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              confirm
            </Button>
          </DialogActions>
        </Container>
      </form>
    </Dialog>
  );
}

export default CateringRequestModel;
