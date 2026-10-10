import { useState, useEffect, useRef } from 'react'
import './App.css'
import MissionStatus from './components/MissionStatus'
import Telemetry from './components/Telemetry'
import MissionOverview from './components/MissionOverview'
import MissionTimeline from './components/MissionTimeline'
import OrbitVisualization from './components/OrbitVisualization'
import { getISSData } from './services/issApi'
function App() {
  
  const [telemetryData, setTelemetryData] = useState({
  altitude: "408 km",
  velocity: "7.66 km/s",
  temperature: "21.4 °C",
  battery: "87%",
})

const [batteryLevel, setBatteryLevel] = useState(87)
const [missionPhase, setMissionPhase] = useState("Nominal Operations")
const [currentTime, setCurrentTime] = useState(new Date())
const [phaseChangedAt, setPhaseChangedAt] = useState(new Date())
const [issPosition, setIssPosition] = useState({
  latitude: null,
  longitude: null,
})

// Keep the previous ISS API position between refreshes
const previousIssPosition = useRef({
  latitude: null,
  longitude: null,
})

// Store the ISS movement direction calculated from consecutive positions
const [issDirection, setIssDirection] = useState('--')

// Track the current ISS API request status
const [issLoading, setIssLoading] = useState(true)
const [issError, setIssError] = useState('')

// Gradually decrease battery level to simulate power consumption
useEffect(() => {
  const timer = setInterval(() => {
    setBatteryLevel((prev) => {

// Simulate battery discharge and recharge cycle
const newBattery = prev <= 70 ? 87 : prev - 1


// Simulate mission phase progression
setMissionPhase((prev) => {
  if (prev === "Nominal Operations") {
    return "Data Collection"
  }

  if (prev === "Data Collection") {
    return "Orbit Maintenance"
  }

  return "Nominal Operations"
})

  setTelemetryData((current) => ({
    ...current,
    battery: `${newBattery}%`,
  }))

  return newBattery
})

    setTelemetryData({
      altitude: `${(408 + (Math.random() * 2 - 1)).toFixed(1)} km`,
      velocity: `${(7.66 + (Math.random() * 0.10 - 0.05)).toFixed(2)} km/s`,
      // Simulate small temperature fluctuations
      temperature: `${(21.5 + (Math.random() * 0.6 - 0.3)).toFixed(1)} °C`,
      battery: `${batteryLevel}%`,
    })
  }, 3000)

  const clockTimer = setInterval(() => {
  setCurrentTime(new Date())
}, 1000)

return () => {
  clearInterval(timer)
  clearInterval(clockTimer)
}
}, [])

// Record the time whenever the mission phase changes
useEffect(() => {
  setPhaseChangedAt(new Date())
}, [missionPhase])

// Fetch and monitor live ISS position data
useEffect(() => {
// Request the latest ISS coordinates
  const fetchISSPosition = async () => {
    try {
          const data = await getISSData()
          // Convert the latest API coordinates to numbers
          const newLatitude = Number(data.latitude)
          const newLongitude = Number(data.longitude)
          // Read the previous ISS position saved by useRef
          const previousLatitude = previousIssPosition.current.latitude
          const previousLongitude = previousIssPosition.current.longitude
          // Calculate movement direction after the first API reading
    if (previousLatitude !== null && previousLongitude !== null) {
// Convert degrees to radians for the bearing calculation
const toRadians = (degrees) => (degrees * Math.PI) / 180

// Convert radians back to degrees
const toDegrees = (radians) => (radians * 180) / Math.PI

// Calculate the initial great-circle bearing between two coordinates
const calculateBearing = (
  previousLatitude,
  previousLongitude,
  currentLatitude,
  currentLongitude
) => {
  const lat1 = toRadians(previousLatitude)
  const lat2 = toRadians(currentLatitude)
  const longitudeDifference = toRadians(
    currentLongitude - previousLongitude
  )

  // Calculate the bearing using the spherical Earth formula
  const y = Math.sin(longitudeDifference) * Math.cos(lat2)

  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) *
      Math.cos(lat2) *
      Math.cos(longitudeDifference)

  // Convert the bearing to degrees and normalize it to 0–360°
  const bearing =
    (toDegrees(Math.atan2(y, x)) + 360) % 360

  return bearing
}

const bearing = calculateBearing(
  previousLatitude,
  previousLongitude,
  newLatitude,
  newLongitude
)
// Debug the actual movement used for bearing calculation
console.log('Previous Position:', {
  latitude: previousLatitude,
  longitude: previousLongitude,
})

console.log('Current Position:', {
  latitude: newLatitude,
  longitude: newLongitude,
})

console.log('Calculated Bearing:', bearing)
// Convert the numeric bearing into an 8-point compass direction
const directions = [
  'N',
  'NE',
  'E',
  'SE',
  'S',
  'SW',
  'W',
  'NW',
]

const directionIndex = Math.round(bearing / 45) % 8
const direction = directions[directionIndex]

setIssDirection(direction)
   }
// Save the latest position for the next 10-second comparison
previousIssPosition.current = {
  latitude: newLatitude,
  longitude: newLongitude,
}
// Update React state with the latest ISS coordinates
setIssPosition({
  latitude: newLatitude,
  longitude: newLongitude,
})
  // Clear any previous API error
      setIssError('')
    } catch (error) {
      // Store an error message if the request fails
      setIssError('Unable to fetch ISS position')
    } finally {
      // Mark the request as completed
      setIssLoading(false)
    }
  }
  
  // Fetch immediately when the component loads
  fetchISSPosition()

  // Refresh ISS coordinates every 10 seconds
  const issTimer = setInterval(fetchISSPosition, 10000)

  // Clean up the interval when the component unmounts
  return () => {
    clearInterval(issTimer)
  }
}, [])




useEffect(() => {
  // Log only when ISS position state changes
  console.log('ISS Position Updated:', issPosition)
  console.log('ISS Direction:', issDirection)
  
}, [issPosition])

// Check the ISS position stored in React state
// console.log('ISS Position State:', issPosition)

  return (
   <div className="dashboard">
<header className="dashboard-header">
  <div className="header-content">

    <div className="header-title">
      <h1 style={{ letterSpacing: '2px' }}>Mission Control</h1>
      <p style={{letterSpacing: '1px'}}>Space Engineering Mission Monitoring System</p>
    </div>

    <div className="header-status">
  <div>
    <span
  className={`status-dot ${
    missionPhase === "Orbit Maintenance" ? "status-maintenance" : ""
  }`}
>
  ●
</span>
    <span className="system-nominal" style={{ fontSize: '13.5px' }}>{missionPhase === "Orbit Maintenance"
        ? "MAINTENANCE MODE"
        : "SYSTEM NOMINAL"}
    </span>
  </div>

<div className="mission-meta">
  <div className="mission-clock-box">
    <div className="mission-clock-label">
      🕐 <small>MISSION CLOCK</small>
    </div>

    <small className="mission-clock">
      UTC {currentTime.toISOString().slice(11, 19)}
    </small>
  </div>

</div>
</div>

  </div>
</header>

      <main className="dashboard-content">
        
         <MissionStatus missionPhase={missionPhase} />
         <Telemetry
  data={telemetryData}
  batteryLevel={batteryLevel}
/> 
         <MissionOverview />

 {/* Pass live ISS coordinates and API status to the orbital component */}
<OrbitVisualization
  issPosition={issPosition}
  issLoading={issLoading}
  issError={issError}
  // Pass the calculated ISS movement direction to the orbit component
  issDirection={issDirection}
/>
         <MissionTimeline
  missionPhase={missionPhase}
  phaseChangedAt={phaseChangedAt}
/>
      </main>
      <footer className="dashboard-footer">
  <p>
    © {new Date().getFullYear()} Mission Control Dashboard • Spacecraft Monitoring System.
  </p>
</footer>
    </div>
    
  )
}

export default App