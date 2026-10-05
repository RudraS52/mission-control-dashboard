export async function getISSData() {
  // Send a request to the public ISS position API
  const response = await fetch(
    'http://api.open-notify.org/iss-now.json'
  )

  // Check whether the API request was successful
  if (!response.ok) {
    throw new Error('Failed to fetch ISS data')
  }

  // Convert the API response into JavaScript data
  const data = await response.json()

  // Return the ISS data to the React component
  return data
}

