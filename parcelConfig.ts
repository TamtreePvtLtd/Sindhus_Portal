import { CartItem } from "./src/context/CartContext";
import { Parcel } from "./src/interface/types";

const ParcelRules = [
  {
    maxWeight: 5,
    size: { length: "15", width: "12", height: "10" },
  },
  {
    maxWeight: 15,
    size: { length: "18", width: "18", height: "16" },
  },
  // add more rules as needed
];

export function getParcelObjectByWeight(weight: number) {
  const rule = ParcelRules.find((r) => weight <= r.maxWeight);

  if (!rule) {
    throw new Error(`No parcel configuration found for weight: ${weight} lbs`);
  }

  return {
    ...rule.size,
    distanceUnit: "in",
    weight: weight.toString(),
    massUnit: "lb",
  } as Parcel;
}

function getWeightFromSize(size) {
  const normalized = size.trim().toLowerCase(); // normalize text

  if (/5\s*pcs/.test(normalized)) return 1; // 5 pcs → 1 lb
  if (/6\s*pcs/.test(normalized)) return 0.5; // 6 pcs → 0.5 lb
  if (/pack of\s*(4|5|6)/.test(normalized)) return 0.5; // pack of 4/5/6 → 0.5 lb
  if (/1\s*lb/.test(normalized)) return 1; // 1 lb → 1 lb
  if (/1\/2\s*lb/.test(normalized)) return 0.5; // 1/2 lb → 0.5 lb

  return 0; // fallback if no match
}

export function CalculateTotalWeight(cart: CartItem[]) {
  return cart.reduce((sum, item) => {
    const itemWeight = getWeightFromSize(item.size);
    return sum + itemWeight * (item.quantity || 1);
  }, 0);
}
