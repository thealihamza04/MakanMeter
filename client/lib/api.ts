import { SimulatorFormState, PredictApiPayload, PredictApiResponse } from '@/types/valuation';
import { KANAL_TO_MARLA } from '@/config/valuation';

/**
 * Resolves the server base URL from environment variables.
 * Falls back to local server default if not defined.
 */
export function getServerUrl(): string {
  if (typeof window !== 'undefined') {
    return (
      process.env.NEXT_PUBLIC_SERVER_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/+$/, '');
  }
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.Server_ulr ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');
}

/**
 * Maps the client simulator form state to the exact schema payload expected by POST /predict
 */
export function buildPredictPayload(formState: SimulatorFormState): PredictApiPayload {
  const currentYear = 2025;
  const propertyAge = Math.max(0, currentYear - (formState.yearBuilt || 2021));

  const numericArea = typeof formState.areaValue === 'number' ? formState.areaValue : 10;
  const isKanal = formState.unit === 'kanal';
  const areaMarla = isKanal ? numericArea * KANAL_TO_MARLA : numericArea;

  // Build amenities list based on active form controls
  const amenities: string[] = [];
  if (formState.hasLawn) {
    amenities.push('Lawn/Garden');
  }

  // Type mapping: 'House', 'Flat', 'Upper', 'Lower'
  const propertyType = formState.propertyType || 'House';

  return {
    area: numericArea,
    area_marla: Number(areaMarla.toFixed(2)),
    area_unit: isKanal ? 'Kanal' : 'Marla',
    location: formState.location || 'DHA Defence',
    bedrooms: formState.bedrooms || 3,
    type: propertyType,
    property_type: propertyType,
    furnished: formState.isFurnished,
    property_age: propertyAge,
    amenities,
    kitchens: formState.kitchens,
    store_rooms: 0,
    servant_quarters: 0,
    gym: 0,
    study_room: 0,
    drawing_room: formState.drawingRooms,
    dining_room: 0,
    lawn_garden: formState.hasLawn ? 1 : 0,
    swimming_pool: 0,
    electricity_backup: 0,
    lounge_sitting_room: 0,
  };
}

/**
 * Calls the /predict endpoint on the backend server
 */
export async function fetchPricePrediction(payload: PredictApiPayload): Promise<PredictApiResponse> {
  const serverUrl = getServerUrl();
  const endpoint = `${serverUrl}/predict`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Server error (${response.status}): ${errorBody || response.statusText}`);
  }

  return response.json();
}
