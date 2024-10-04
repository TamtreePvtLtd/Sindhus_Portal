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

export function PlacesAutocomplete() {
  const [value, setValue] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [amount, setAmount] = useState<string | null>(null); // State to store the amount
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);

  const libraries: Libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_LOCATION,
    libraries,
  });

  const { data: nearestAmount, refetch } = useGetNearestGreaterDistance(
    distance?.toString() ?? "" // Trigger refetch when distance is updated
  );

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
            setSelectedPlace({ lat, lng });
            await calculateDistance(origin, { lat, lng });
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
            refetch(); // Fetch the amount based on distance
          } else {
            console.error("Distance value is null");
          }
        } else {
          console.error("Error fetching distance:", status);
        }
      }
    );
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
          } else {
            setDistance(0); // If the clear icon is clicked and value is empty
          }
        }}
        onClose={() => {
          if (!value) {
            setDistance(0); // This also ensures distance is 0 when the dropdown closes and the value is empty
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

      {amount !== null && (
        <TextField
          label="Amount"
          value={`$${amount}`} // Ensure the amount is displayed correctly
          variant="outlined"
          disabled
          fullWidth
          margin="normal"
        />
      )}
    </div>
  );
}
