import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { useGetNearestGreaterDistance } from "../../customRQHooks/Hooks";

interface AutocompleteResult {
  label: string;
  id: string;
}

interface SelectedPlace {
  lat: number;
  lng: number;
}

interface PlacesAutocompleteProps {
  orderAmountWithTax: { orderAmountWithTax: string }; // Assuming it's a number
  setAddressError: (error: string) => void; // Adjust type based on the actual error type
  setAddress: (address: string) => void; // Adjust type based on your address type
  setAddressURL: (address: string) => void; // Adjust type based on your address type
}

export function PlacesAutocomplete({
  orderAmountWithTax,
  setAddressError,
  setAddress,
  setAddressURL,
}: PlacesAutocompleteProps) {
  const [value, setValue] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [amount, setAmount] = useState<string | null>(null); // State to store the amount
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [error, setError] = useState(false); // State to handle error status

  const libraries: Libraries = ["places"];
  console.log("orderAmountWithTax", orderAmountWithTax);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_LOCATION,
    libraries,
  });

  //   if (selectedPlace) {
  var { data: nearestAmount, refetch } = useGetNearestGreaterDistance(
    distance?.toString() ?? ""
  );
  //   }

  useEffect(() => {
    if (distance !== null && nearestAmount) {
      console.log("Nearest Amount:", nearestAmount); // Check if amount is inside nearestAmount
      setAmount(nearestAmount.amount); // Adjust this based on actual data structure
    }
  }, [distance, nearestAmount]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const origin = { lat: 33.176659, lng: -96.88961 };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (event.target.value === "") {
      setSuggestions([]);
      setDistance(null); // Clear the distance when input is cleared
      setAmount(null); // Clear the amount as well
    } else {
      fetchSuggestions(event.target.value);
    }
  };

  const fetchSuggestions = async (input: string) => {
    try {
      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        { input, componentRestrictions: { country: "us" } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const results: AutocompleteResult[] = predictions
              ? predictions.map((prediction) => ({
                  label: prediction.description,
                  id: prediction.place_id,
                }))
              : [];
            setSuggestions(results);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelect = async (address: AutocompleteResult) => {
    setValue(address.label);
    setSuggestions([]);
    setAddress(address.label);

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          address: address.label,
        },
        async (results, status) => {
          if (
            status === window.google.maps.GeocoderStatus.OK &&
            results &&
            results.length > 0
          ) {
            const latLng = results[0].geometry.location;
            const lat = latLng.lat();
            const lng = latLng.lng();
            const addressURL = `https://maps.google.com/?q=${lat},${lng}`;
            setAddressURL(addressURL);
            setSelectedPlace({ lat, lng });
            await calculateDistance(origin, { lat, lng });
            setAddressError("");
          } else {
            console.error(
              "Geocode was not successful for the following reason:",
              status
            );
          }
        }
      );
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };

  const calculateDistance = async (
    origin: SelectedPlace,
    destination: SelectedPlace
  ) => {
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [{ lat: origin.lat, lng: origin.lng }],
        destinations: [{ lat: destination.lat, lng: destination.lng }],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK) {
          const distanceValue = response?.rows[0]?.elements[0]?.distance?.value;
          if (distanceValue != null) {
            const distanceInKilometers = distanceValue / 1000; // Convert meters to kilometers
            const distanceInMiles = distanceInKilometers * 0.621371; // Convert kilometers to miles
            setDistance(distanceInMiles);
            // Just call refetch without passing any parameters
            refetch();
          } else {
            console.error("Distance value is null");
          }
        } else {
          console.error("Error fetching distance:", status);
        }
      }
    );
  };

  const validateInput = () => {
    // Example validation logic: check if value is empty
    if (!value) {
      setError(true);
      setAddressError("Please select an address from the list."); // Call the callback with the error message
      return false;
    }
    return true;
  };
  return (
    <div>
      <Autocomplete
        disablePortal
        options={suggestions}
        getOptionLabel={(option) => option.label}
        onChange={(_e, value) => {
          if (value) {
            handleSelect(value); // When a value is selected
            setError(false);
          } else {
            setDistance(0); // If the clear icon is clicked and value is empty
          }
        }}
        onClose={() => {
          

          if (!validateInput()) {
            setDistance(0); 
          }
        }}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            value={value}
            onChange={handleInputChange}
            label="Type Address"
            variant="outlined"
            required
            error={error} // Show error if validation fails
            helperText={error ? "Please select an address from the list." : ""} // Error message
          />
        )}
      />

      {/* Conditionally render the distance and amount fields */}
      {distance !== null && (
        <TextField
          label="Distance from Shop"
          value={`${distance.toFixed(2)} miles`}
          variant="outlined"
          disabled
          fullWidth
          margin="normal"
        />
      )}
      {distance !== null &&
        orderAmountWithTax &&
        orderAmountWithTax.orderAmountWithTax != null &&
        nearestAmount?.amount == "0" && (
          <p style={{ color: "red" }}>
            Distance is too far. Please choose the pickup option.
          </p>
        )}

      {distance !== null && nearestAmount?.amount != "0" && (
        <TextField
          label="Delivery Charge"
          value={`$${Number(amount).toFixed(2)}`}
          variant="outlined"
          disabled
          fullWidth
          margin="normal"
        />
      )}
      {amount !== null &&
        orderAmountWithTax.orderAmountWithTax != null &&
        selectedPlace &&
        nearestAmount?.amount != "0" && (
          <TextField
            label="Total Amount With Delivery Charge"
            value={`$${(
              Number(amount) + Number(orderAmountWithTax.orderAmountWithTax)
            ).toFixed(2)}`}
            variant="outlined"
            disabled
            fullWidth
            margin="normal"
          />
        )}
    </div>
  );
}
