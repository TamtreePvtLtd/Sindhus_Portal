import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { ICateringEnquiry } from "../../interface/types";
import { createCateringEnquiry } from "../../services/api";
import { SnackbarSeverityEnum } from "../../enums/SnackbarSeverityEnum";
import { useSnackBar } from "../../context/SnackBarContext";
import Zoom from "react-reveal/Zoom";

const EnquiryFormInitialValue: ICateringEnquiry = {
  fullName: "",
  email: "",
  typeOfEvent: "",
  guestCount: 0,
  mobileNumber: "",
  message: "",
  eventDate: "",
};

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .required()
    .typeError("Please enter the MobileNumber")
    .matches(/^[0-9]{10}$/, "Please enter a valid MobileNumber"),
  eventDate: yup.string().required("Event date is required"),
});

function CateringEnquiryForm() {
  const { updateSnackBarState } = useSnackBar();
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
  } = useForm<ICateringEnquiry>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: EnquiryFormInitialValue,
  });

  const onSubmitCateringEnquiry = async (data: ICateringEnquiry) => {
    try {
      await createCateringEnquiry(data);
      updateSnackBarState(
        true,
        "Form submitted successfully",
        SnackbarSeverityEnum.SUCCESS
      );
      reset();
    } catch (error) {
      updateSnackBarState(
        true,
        "Error while submitting the form",
        SnackbarSeverityEnum.ERROR
      );
    }
  };

  return (
    <Zoom>
      <Box
        sx={{
          zIndex: 2,
          padding: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmitCateringEnquiry)}>
          <Grid
            container
            spacing={2}
            sx={{
              backgroundColor: "white",
              borderRadius: 5,
              p: 2,
            }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ textAlign: "center", color: "black" }}
              >
                Catering Request Form
              </Typography>
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                label="Full Name *"
                fullWidth
                variant="outlined"
                {...register("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName ? errors.fullName.message : ""}
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                label="Email *"
                fullWidth
                variant="outlined"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                label="Mobile Number *"
                fullWidth
                variant="outlined"
                {...register("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={
                  errors.mobileNumber ? errors.mobileNumber.message : ""
                }
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                label="Type Of Event"
                fullWidth
                variant="outlined"
                {...register("typeOfEvent")}
              />
            </Grid>

            <Grid item lg={3} xs={12}>
              <FormControl fullWidth>
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
                {errors.eventDate && (
                  <FormHelperText error>
                    {errors.eventDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item lg={3} xs={12}>
              <TextField
                label="Guest Count"
                fullWidth
                variant="outlined"
                type="number"
                {...register("guestCount")}
                error={!!errors.guestCount}
                helperText={errors.guestCount ? errors.guestCount.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                {...register("message")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginBottom: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button type="submit" variant="contained">
                Send Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Zoom>
  );
}

export default CateringEnquiryForm;
