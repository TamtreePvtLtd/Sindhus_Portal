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

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ShippingOptions = ({ shipmentData, selectedRate, onSelectRate }: any) => {
  if (!shipmentData?.rates || shipmentData.rates.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No shipping options available.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2, overflowX: "auto" }}>
      <RadioGroup
        value={selectedRate}
        onChange={(e) => onSelectRate(e.target.value)}
      >
        {shipmentData.rates.map((rate: any) => (
          <Card
            key={rate.object_id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1.5,
              padding: "-5px",
              border:
                selectedRate === rate.object_id
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              image={rate.provider_image_75}
              alt={rate.provider}
              sx={{ width: 60, height: 40, objectFit: "contain", p: 1 }}
            />

            <CardContent sx={{ flex: 1, py: 1, "&:last-child": { pb: 1 } }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="body1" fontWeight="bold">
                  {rate.servicelevel.display_name || rate.servicelevel.name}
                </Typography>

                {rate.attributes && rate.attributes.length > 0 && (
                  <Stack direction="row" spacing={0.5}>
                    {rate.attributes.map((attr: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={attr}
                        size="small"
                        sx={{
                          fontSize: 11,
                          backgroundColor: getRandomColor(),
                          color: "#fff",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {rate.duration_terms || `Estimated ${rate.estimated_days} days`}
              </Typography>
            </CardContent>

            <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                ${Number(rate.amount).toFixed(2)}
              </Typography>
              <FormControlLabel
                value={rate.object_id}
                control={<Radio />}
                label=""
              />
            </Box>
          </Card>
        ))}
      </RadioGroup>
    </Box>
  );
};

export default ShippingOptions;
