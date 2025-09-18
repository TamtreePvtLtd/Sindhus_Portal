import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Stack,
} from "@mui/material";

export interface CreateShipmentTransactionPayload {
  rateObjId: string;
  carrierAccount: string;
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ShippingOptions = ({ shipmentData }: any) => {
  const [selectedRateObj, setSelectedRateObj] =
    useState<CreateShipmentTransactionPayload | null>(null);

  if (!shipmentData?.rates || shipmentData.rates.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No shipping options available.
      </Typography>
    );
  }

  const handleSelectRate = (rate: any) => {
    const selectedObj: CreateShipmentTransactionPayload = {
      rateObjId: rate.objectId,
      carrierAccount: rate.carrierAccount,
    };
    setSelectedRateObj(selectedObj);
    console.log("Selected Shipping Option:", selectedObj);
  };

  return (
    <Box sx={{ p: 2, overflowX: "auto" }}>
      <RadioGroup
        value={selectedRateObj?.rateObjId || ""}
        onChange={(e) => {
          const selectedRate = shipmentData.rates.find(
            (r: any) => r.objectId === e.target.value
          );
          if (selectedRate) {
            handleSelectRate(selectedRate);
          }
        }}
      >
        {shipmentData.rates.map((rate: any) => (
          <Card
            key={rate.objectId}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1.5,
              border:
                selectedRateObj?.rateObjId === rate.objectId
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              image={rate.providerImage75}
              alt={rate.provider}
              sx={{ width: 80, height: 40, objectFit: "contain", p: 1 }}
            />

            <CardContent
              sx={{
                flex: 1,
                py: 1,
                "&:last-child": { pb: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {rate.attributes && rate.attributes.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {rate.attributes.map((attr: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={attr}
                        size="small"
                        sx={{
                          fontSize: 11,
                          backgroundColor: "black",
                          color: "#fff",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} flexDirection={"column"}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {rate.servicelevel?.displayName ??
                        rate.servicelevel?.name}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {rate.durationTerms ||
                      `Estimated ${rate.estimatedDays} days`}
                  </Typography>
                </Box>

                <Box sx={{ pl: 1, display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    ${Number(rate.amount).toFixed(2)}
                  </Typography>
                  <FormControlLabel
                    value={rate.objectId}
                    control={<Radio />}
                    label=""
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </Box>
  );
};

export default ShippingOptions;
