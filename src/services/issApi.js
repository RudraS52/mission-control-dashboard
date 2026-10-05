export async function getISSData() {
  // Fetch the ISS's current position from the HTTPS tracking API.
  const response = await fetch(
    'https://api.wheretheiss.at/v1/satellites/25544'
  )

  // Stop if the API returns an unsuccessful HTTP status.
  if (!response.ok) {
    throw new Error(`Failed to fetch ISS data: ${response.status}`)
  }

  // Convert the API response into JavaScript data.
  const data = await response.json()

  // Return the telemetry to the React component.
  return data
}